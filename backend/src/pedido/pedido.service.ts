import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { randomString } from "src/Global";
import { CreatePedidoDTO, EstadoPedido } from "./pedido.dto";

@Injectable()
export class PedidoService {
    constructor(private readonly db: DatabaseService) {}

    async getPedidosByUser(email: string) {
        //pedidos de un cliente, ordenados por fecha desc
        const { data } = await this.db.getClient()
            .from("pedido")
            .select("*")
            .eq("user_email", email)
            .order("fecha", { ascending: false });
        return data;
    }

    async getPedidosByFarmer(email: string) {
        //pedidos recibidos por un agricultor, ordenados por fecha desc
        const { data } = await this.db.getClient()
            .from("pedido")
            .select("*")
            .eq("farmer_email", email)
            .order("fecha", { ascending: false });
        return data;
    }

    async getPedidoById(id: string) {
        //pedido + sus líneas (con datos básicos del producto)
        const { data: pedido, error } = await this.db.getClient()
            .from("pedido")
            .select("*")
            .eq("id", id)
            .single();
        if (error || !pedido) {
            throw new NotFoundException("Pedido no encontrado");
        }

        const { data: lineas } = await this.db.getClient()
            .from("pedido_producto")
            .select("*, producto:product_id(id, nombre, foto, categoria, fotos:foto(path))")
            .eq("pedido_id", id);

        //Aplanamos foto_url para que el frontend pinte la miniatura sin tener
        //que conocer el join con la tabla fotos.
        const lineasConFoto = (lineas ?? []).map((l: any) => {
            const producto = l?.producto;
            if (!producto) return l;
            const { fotos, ...prodRest } = producto;
            return {
                ...l,
                producto: { ...prodRest, foto_url: fotos?.path ?? null },
            };
        });

        return { ...pedido, lineas: lineasConFoto };
    }

    async createPedido(dto: CreatePedidoDTO) {
        //1. cargar productos para calcular precio_unitario y total
        const productIds = dto.lineas.map(l => l.product_id);
        const { data: productos, error: errorProductos } = await this.db.getClient()
            .from("producto")
            .select("id, precio, cantidad, email_agricultor")
            .in("id", productIds);

        if (errorProductos) {
            return { status: "ERROR", message: "Error al cargar los productos: " + errorProductos.message };
        }
        if (!productos || productos.length !== productIds.length) {
            return { status: "ERROR", message: "Alguno de los productos no existe" };
        }

        //2. validar stock disponible y calcular total
        let total = 0;
        const lineasConPrecio = dto.lineas.map(linea => {
            const prod = productos.find(p => p.id === linea.product_id);
            if (!prod) {
                throw new Error(`Producto ${linea.product_id} no encontrado`);
            }
            if (prod.cantidad < linea.cantidad) {
                throw new Error(`Stock insuficiente para el producto ${linea.product_id}`);
            }
            total += prod.precio * linea.cantidad;
            return {
                pedido_id: "",
                product_id: linea.product_id,
                cantidad: linea.cantidad,
                precio_unitario: prod.precio,
            };
        });

        //3. crear el pedido
        const pedidoId = randomString();
        const { error: errorPedido } = await this.db.getClient()
            .from("pedido")
            .insert({
                id: pedidoId,
                user_email: dto.user_email,
                farmer_email: dto.farmer_email,
                fecha: new Date().toISOString(),
                estado: "pendiente",
                total: Math.round(total * 100) / 100,
                direccion_envio: dto.direccion_envio ?? null,
            });

        if (errorPedido) {
            return { status: "ERROR", message: "Error al crear el pedido: " + errorPedido.message };
        }

        //4. crear las líneas del pedido
        const lineasInsert = lineasConPrecio.map(l => ({
            id: randomString(),
            pedido_id: pedidoId,
            product_id: l.product_id,
            cantidad: l.cantidad,
            precio_unitario: l.precio_unitario,
        }));

        const { error: errorLineas } = await this.db.getClient()
            .from("pedido_producto")
            .insert(lineasInsert);

        if (errorLineas) {
            //rollback manual: borramos el pedido
            await this.db.getClient().from("pedido").delete().eq("id", pedidoId);
            return { status: "ERROR", message: "Error al crear las líneas del pedido: " + errorLineas.message };
        }

        //5. descontar stock
        for (const linea of dto.lineas) {
            const prod = productos.find(p => p.id === linea.product_id);
            if (!prod) continue;
            await this.db.getClient()
                .from("producto")
                .update({ cantidad: prod.cantidad - linea.cantidad })
                .eq("id", linea.product_id);
        }

        return { status: "OK", message: "Pedido creado", id: pedidoId };
    }

    async updateEstado(id: string, estado: EstadoPedido) {
        //Cargamos el estado anterior para saber si la transición a "entregado"
        //es nueva. Si es la primera vez, sumamos el total al beneficio mensual.
        const { data: prev, error: prevError } = await this.db.getClient()
            .from("pedido")
            .select("estado")
            .eq("id", id)
            .single();
        if (prevError || !prev) {
            throw new NotFoundException("Pedido no encontrado");
        }

        const { data, error } = await this.db.getClient()
            .from("pedido")
            .update({ estado })
            .eq("id", id)
            .select("*")
            .single();

        if (error || !data) {
            throw new NotFoundException("Pedido no encontrado");
        }

        if (prev.estado !== "entregado" && estado === "entregado") {
            await this.acumularBeneficio(data);
        }

        return { status: "OK", message: "Estado actualizado", pedido: data };
    }

    //Suma el total del pedido al acumulado mensual del agricultor mediante la
    //función SQL add_beneficio_mensual (atomic upsert). Si la llamada falla
    //solo lo registramos: no queremos que un fallo en el ledger bloquee la
    //transición de estado del pedido.
    private async acumularBeneficio(pedido: any) {
        try {
            const fecha = new Date(pedido.fecha ?? Date.now());
            const anio = fecha.getUTCFullYear();
            const mes = fecha.getUTCMonth() + 1;
            const monto = Number(pedido.total ?? 0);
            if (!pedido.farmer_email || monto <= 0) return;
            const { error } = await this.db.getClient().rpc("add_beneficio_mensual", {
                p_farmer_email: pedido.farmer_email,
                p_anio: anio,
                p_mes: mes,
                p_monto: monto,
            });
            if (error) {
                console.error("[beneficio_mensual] error acumulando:", error.message);
            }
        } catch (err) {
            console.error("[beneficio_mensual] excepción acumulando:", err);
        }
    }

    async getBeneficiosByFarmer(email: string) {
        const { data } = await this.db.getClient()
            .from("beneficio_mensual")
            .select("*")
            .eq("farmer_email", email)
            .order("anio", { ascending: false })
            .order("mes", { ascending: false });
        return data ?? [];
    }
}
