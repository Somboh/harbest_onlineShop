import { Injectable } from "@nestjs/common";
import { Product } from "./product.dto";
import { randomString } from 'src/Global';
import * as fs from 'fs/promises';
import { DatabaseService } from "src/database/database.service";
import { CloudinaryService } from "src/Cloudinary/cloudinary.service";

//Aplana cada fila producto+producto_fotos+fotos en un objeto con
//foto_url (la principal) y foto_urls (todas en orden), de forma que el
//frontend pueda mostrar tanto la miniatura en tarjetas como el carrusel
//en el detalle sin saber del join.
function flattenWithPhotos(rows: any[] | null) {
    return (rows ?? []).map((row) => {
        const { producto_fotos, ...rest } = row ?? {};
        const ordered = (producto_fotos ?? [])
            .slice()
            .sort((a: any, b: any) => (a?.orden ?? 0) - (b?.orden ?? 0))
            .map((pf: any) => pf?.fotos?.path)
            .filter((p: string | null | undefined): p is string => !!p);
        return {
            ...rest,
            foto_url: ordered[0] ?? null,
            foto_urls: ordered,
        };
    });
}

const SELECT_WITH_FOTOS = "*, producto_fotos(orden, fotos(id, path))";

//Borra del disco local los archivos temporales que multer guardó. Nunca lanza:
//si fs.unlink falla solo lo logueamos para no enmascarar el error de negocio.
async function cleanupLocal(files: Express.Multer.File[]) {
    await Promise.all((files ?? []).map(async (f) => {
        if (!f?.path) return;
        try { await fs.unlink(f.path); }
        catch (err) { console.error("Error al borrar archivo local:", f.path, err); }
    }));
}

@Injectable()
export class ProductService {
    constructor(private cloudinaryService: CloudinaryService, private db:DatabaseService){}

    async getAllProducts(){
        const {data} = await this.db.getClient()
            .from("producto")
            .select(SELECT_WITH_FOTOS);
        return flattenWithPhotos(data);
    }

    async getProductById(id: string){
        const {data} = await this.db.getClient()
            .from("producto")
            .select(SELECT_WITH_FOTOS)
            .eq("id", id);
        return flattenWithPhotos(data);
    }

    async getProductsByFarmer(farmerId: string){
        const {data} = await this.db.getClient()
            .from("producto")
            .select(SELECT_WITH_FOTOS)
            .eq("email_agricultor", farmerId);
        return flattenWithPhotos(data);
    }

    /*
        Sube cada archivo a Cloudinary, registra cada uno en la tabla `fotos`
        y crea las filas correspondientes en `producto_fotos` con el orden
        recibido del frontend (índice del array). En cualquier fallo se hace
        rollback: se borran de Cloudinary los archivos ya subidos, las filas
        ya insertadas y, si llegamos a crear el producto, se elimina también.
    */
    async createProduct(product: Product, fotos: Express.Multer.File[]) {
        if(!fotos || fotos.length === 0){
            return {status: "ERROR", message: "Debes subir al menos una foto del producto"};
        }

        const uploadedPublicIds: string[] = [];
        let productoCreado = false;
        const id = randomString();

        try {
            //1) Subir todas las fotos a Cloudinary
            const uploads = [] as { public_id: string, secure_url: string }[];
            for (const file of fotos) {
                const res = await this.cloudinaryService.uploadImage(file.path);
                if (!res || (res as any).error) {
                    throw new Error("Error al subir la imagen a Cloudinary");
                }
                uploadedPublicIds.push(res.public_id);
                uploads.push({ public_id: res.public_id, secure_url: res.secure_url });
            }

            //2) Insertar las filas en la tabla `fotos`
            const { error: errorFotos } = await this.db.getClient()
                .from("fotos")
                .insert(uploads.map(u => ({ id: u.public_id, path: u.secure_url })));
            if (errorFotos) {
                throw new Error("Error al insertar las fotos en la base de datos: " + errorFotos.message);
            }

            //3) Insertar el producto
            const { error: errorProduct } = await this.db.getClient().from("producto").insert({
                id,
                nombre: product.nombre,
                descripcion: product.descripcion,
                precio: product.precio,
                cantidad: product.cantidad,
                //Guardamos el "lleno" inicial para que el botón Reponer pueda
                //volver al valor original aunque se haya vendido todo el stock.
                cantidad_inicial: product.cantidad,
                email_agricultor: product.email_agricultor,
                categoria: product.categoria,
                valoracion: 0,
            });
            if (errorProduct) {
                throw new Error("Error al crear el producto: " + errorProduct.message);
            }
            productoCreado = true;

            //4) Enlazar las fotos al producto en producto_fotos con su orden
            const { error: errorLink } = await this.db.getClient()
                .from("producto_fotos")
                .insert(uploads.map((u, idx) => ({
                    producto_id: id,
                    foto_id: u.public_id,
                    orden: idx,
                })));
            if (errorLink) {
                throw new Error("Error al enlazar las fotos al producto: " + errorLink.message);
            }

            await cleanupLocal(fotos);
            return {status: "OK", message: "Producto creado"};
        }
        catch (error) {
            //Rollback en orden inverso al que se hizo el progreso.
            if (productoCreado) {
                await this.db.getClient().from("producto").delete().eq("id", id)
                    .then(({ error: e }) => { if (e) console.error("Rollback producto:", e); });
            }
            if (uploadedPublicIds.length > 0) {
                await this.db.getClient().from("fotos").delete().in("id", uploadedPublicIds)
                    .then(({ error: e }) => { if (e) console.error("Rollback fotos DB:", e); });
                for (const pid of uploadedPublicIds) {
                    await this.cloudinaryService.deleteImage(pid).catch(err => console.error("Rollback Cloudinary:", pid, err));
                }
            }
            await cleanupLocal(fotos);
            return {status: "ERROR", message: error?.message ?? "Error al crear el producto"};
        }
    }

    /*
        Si llega un array de fotos no vacío, se reemplazan TODAS las fotos
        del producto por las nuevas. Si llega vacío, solo se actualizan los
        campos del producto y las fotos existentes se quedan como están.
        Esto coincide con la UX del agricultor: o no toca las fotos o las
        cambia todas.
    */
    async updateProduct(id: string, product: Product, fotos: Express.Multer.File[] = []){
        const {data, error} = await this.db.getClient().from("producto").select("*").eq("id", id).single();
        if (error || !data) {
            await cleanupLocal(fotos);
            throw new Error("Producto no encontrado");
        }

        //Si el agricultor edita y sube la cantidad por encima del "lleno"
        //histórico, ese pasa a ser el nuevo lleno. Así Reponer siempre
        //devuelve al máximo conocido.
        const nuevaCantidadInicial = Math.max(
            Number(data.cantidad_inicial ?? 0),
            Number(product.cantidad ?? 0),
        );

        const productFields = {
            nombre: product.nombre,
            descripcion: product.descripcion,
            precio: product.precio,
            cantidad: product.cantidad,
            cantidad_inicial: nuevaCantidadInicial,
            email_agricultor: product.email_agricultor,
            categoria: product.categoria,
            valoracion: product.valoracion,
        };

        if (fotos.length === 0) {
            const { error: productError } = await this.db.getClient()
                .from("producto").update(productFields).eq("id", id);
            if (productError) {
                throw new Error("Error al actualizar el producto: " + productError.message);
            }
            return {status: "OK", message: "Producto actualizado"};
        }

        //Reemplazo total de fotos: subimos las nuevas, las enlazamos, y solo
        //después borramos las antiguas. Si algo falla a mitad, hacemos rollback
        //de lo nuevo y dejamos las viejas intactas.
        const uploadedPublicIds: string[] = [];
        const linkedNewIds: string[] = [];

        try {
            //1) Recoger las fotos antiguas para borrarlas al final
            const { data: oldLinks, error: oldErr } = await this.db.getClient()
                .from("producto_fotos").select("foto_id").eq("producto_id", id);
            if (oldErr) throw new Error("Error al leer las fotos antiguas: " + oldErr.message);
            const oldFotoIds = (oldLinks ?? []).map((r: any) => r.foto_id);

            //2) Subir las nuevas a Cloudinary
            const uploads = [] as { public_id: string, secure_url: string }[];
            for (const file of fotos) {
                const res = await this.cloudinaryService.uploadImage(file.path);
                if (!res || (res as any).error) {
                    throw new Error("Error al subir la imagen a Cloudinary");
                }
                uploadedPublicIds.push(res.public_id);
                uploads.push({ public_id: res.public_id, secure_url: res.secure_url });
            }

            //3) Insertar nuevos registros en `fotos`
            const { error: errorFotos } = await this.db.getClient()
                .from("fotos")
                .insert(uploads.map(u => ({ id: u.public_id, path: u.secure_url })));
            if (errorFotos) throw new Error("Error al insertar las fotos: " + errorFotos.message);

            //4) Borrar los enlaces antiguos en producto_fotos antes de insertar
            //   los nuevos para no dejar huérfanos si algo falla
            const { error: delLinksErr } = await this.db.getClient()
                .from("producto_fotos").delete().eq("producto_id", id);
            if (delLinksErr) throw new Error("Error al borrar enlaces antiguos: " + delLinksErr.message);

            //5) Insertar los nuevos enlaces con su orden
            const { error: linkErr } = await this.db.getClient()
                .from("producto_fotos")
                .insert(uploads.map((u, idx) => ({
                    producto_id: id,
                    foto_id: u.public_id,
                    orden: idx,
                })));
            if (linkErr) throw new Error("Error al enlazar las nuevas fotos: " + linkErr.message);
            linkedNewIds.push(...uploadedPublicIds);

            //6) Actualizar campos del producto
            const { error: productError } = await this.db.getClient()
                .from("producto").update(productFields).eq("id", id);
            if (productError) throw new Error("Error al actualizar el producto: " + productError.message);

            //7) Borrar las fotos antiguas (Cloudinary + tabla fotos). En este
            //   punto los enlaces ya no apuntan a ellas, así que es seguro.
            if (oldFotoIds.length > 0) {
                await this.db.getClient().from("fotos").delete().in("id", oldFotoIds)
                    .then(({ error: e }) => { if (e) console.error("Borrado fotos antiguas DB:", e); });
                for (const pid of oldFotoIds) {
                    await this.cloudinaryService.deleteImage(pid)
                        .catch(err => console.error("Borrado Cloudinary antigua:", pid, err));
                }
            }

            await cleanupLocal(fotos);
            return {status: "OK", message: "Producto actualizado"};
        }
        catch (err) {
            //Rollback de lo nuevo: enlaces, filas en fotos, archivos Cloudinary.
            if (linkedNewIds.length > 0) {
                await this.db.getClient().from("producto_fotos")
                    .delete().eq("producto_id", id).in("foto_id", linkedNewIds)
                    .then(({ error: e }) => { if (e) console.error("Rollback links update:", e); });
            }
            if (uploadedPublicIds.length > 0) {
                await this.db.getClient().from("fotos").delete().in("id", uploadedPublicIds)
                    .then(({ error: e }) => { if (e) console.error("Rollback fotos DB update:", e); });
                for (const pid of uploadedPublicIds) {
                    await this.cloudinaryService.deleteImage(pid)
                        .catch(error => console.error("Rollback Cloudinary update:", pid, error));
                }
            }
            await cleanupLocal(fotos);
            throw new Error("Error al actualizar el producto: " + (err?.message ?? "desconocido"));
        }
    }

    //Reponer = volver a llenar el stock al valor inicial guardado al crear o
    //al editar el producto. No toca el resto de campos para no requerir foto
    //ni multipart en una operación tan simple.
    async reponerProduct(id: string){
        const {data, error} = await this.db.getClient()
            .from("producto")
            .select("cantidad_inicial")
            .eq("id", id)
            .single();
        if(error || !data){
            return {status: "ERROR", message: "Producto no encontrado"};
        }
        const objetivo = Number(data.cantidad_inicial ?? 0);
        if(!Number.isFinite(objetivo) || objetivo <= 0){
            return {status: "ERROR", message: "Este producto no tiene cantidad inicial registrada"};
        }
        const {error: updateError} = await this.db.getClient()
            .from("producto")
            .update({cantidad: objetivo})
            .eq("id", id);
        if(updateError){
            return {status: "ERROR", message: "No se pudo reponer el producto: " + updateError.message};
        }
        return {status: "OK", message: "Producto repuesto", cantidad: objetivo};
    }

    /*
        Borra el producto y, en cascada, sus enlaces en producto_fotos
        (gracias al ON DELETE CASCADE). Después limpia los archivos en
        Cloudinary y las filas huérfanas de la tabla fotos.
    */
    async deleteProduct(id: string){
        const {data, error} = await this.db.getClient().from("producto").select("id").eq("id", id).single();
        if (error) {
            throw new Error("Error al obtener el producto: " + error.message);
        }
        if (!data) {
            throw new Error("Producto no encontrado");
        }

        //Recoger los foto_id antes de borrar el producto (al borrar, las filas
        //de producto_fotos desaparecen por cascade y perdemos la referencia).
        const { data: links } = await this.db.getClient()
            .from("producto_fotos").select("foto_id").eq("producto_id", id);
        const fotoIds = (links ?? []).map((r: any) => r.foto_id);

        const { error: errorDelete } = await this.db.getClient().from("producto").delete().eq("id", id);
        if (errorDelete) {
            throw new Error("Error al borrar el producto: " + errorDelete.message);
        }

        //Borrar fotos en Cloudinary y en la tabla fotos. Si algo falla aquí
        //solo lo logueamos: el producto ya está borrado y para el usuario
        //la operación es un éxito.
        for (const pid of fotoIds) {
            await this.cloudinaryService.deleteImage(pid)
                .catch(err => console.error("Error al borrar imagen Cloudinary:", pid, err));
        }
        if (fotoIds.length > 0) {
            await this.db.getClient().from("fotos").delete().in("id", fotoIds)
                .then(({ error: e }) => { if (e) console.error("Error al borrar fotos DB:", e); });
        }

        return {status: "OK", message: "Producto eliminado"};
    }

    async getProductsByCategory(categoria: string){
        const {data} = await this.db.getClient()
            .from("producto")
            .select(SELECT_WITH_FOTOS)
            .eq("categoria", categoria);
        return flattenWithPhotos(data);
    }

    async searchProducts(q: string){
        if(!q || q.trim().length === 0){
            return [];
        }
        //Buscamos por nombre y traemos también las URLs de las fotos a través
        //de la tabla intermedia para que el frontend pueda pintar miniaturas
        //sin una segunda llamada.
        const {data} = await this.db.getClient()
            .from("producto")
            .select(SELECT_WITH_FOTOS)
            .ilike("nombre", `%${q.trim()}%`);
        return flattenWithPhotos(data);
    }
}
