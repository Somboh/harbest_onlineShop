import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { FavoritoDTO } from "./favorito.dto";

@Injectable()
export class FavoritoService {
    constructor(private readonly db: DatabaseService) {}

    async getFavoritosByUser(email: string) {
        //devuelve los productos completos (con URL de la foto plana) que el
        //usuario marcó como favoritos. Hacemos el join con producto y luego
        //con fotos para que el frontend pueda pintar la miniatura sin más llamadas.
        const { data } = await this.db.getClient()
            .from("favorito")
            .select("product_id, fecha, producto:product_id(*, fotos:foto(path))")
            .eq("user_email", email)
            .order("fecha", { ascending: false });

        //Aplanamos foto_url en producto para que el front no tenga que saber del join.
        return (data ?? []).map((row: any) => {
            const producto = row?.producto ?? null;
            if (!producto) return row;
            const { fotos, ...rest } = producto;
            return {
                ...row,
                producto: { ...rest, foto_url: fotos?.path ?? null },
            };
        });
    }

    async addFavorito(dto: FavoritoDTO) {
        //la PK compuesta (user_email, product_id) en BD evita duplicados
        const { error } = await this.db.getClient()
            .from("favorito")
            .insert({
                user_email: dto.user_email,
                product_id: dto.product_id,
                fecha: new Date().toISOString(),
            });

        if (error) {
            //si ya existe, lo tratamos como éxito idempotente
            if (error.code === "23505") {
                return { status: "OK", message: "Ya estaba en favoritos" };
            }
            return { status: "ERROR", message: "Error al añadir a favoritos: " + error.message };
        }
        return { status: "OK", message: "Añadido a favoritos" };
    }

    async removeFavorito(user_email: string, product_id: string) {
        const { error } = await this.db.getClient()
            .from("favorito")
            .delete()
            .eq("user_email", user_email)
            .eq("product_id", product_id);

        if (error) {
            return { status: "ERROR", message: "Error al quitar de favoritos: " + error.message };
        }
        return { status: "OK", message: "Eliminado de favoritos" };
    }
}
