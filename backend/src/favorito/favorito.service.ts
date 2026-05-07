import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { FavoritoDTO } from "./favorito.dto";

@Injectable()
export class FavoritoService {
    constructor(private readonly db: DatabaseService) {}

    async getFavoritosByUser(email: string) {
        //devuelve los productos completos (con URL de la foto plana) que el
        //usuario marcó como favoritos. Pasamos por la tabla intermedia
        //producto_fotos para coger todas las fotos del producto en orden, y
        //aplanamos la principal en `foto_url` para que el frontend pinte la
        //miniatura sin más llamadas.
        const { data } = await this.db.getClient()
            .from("favorito")
            .select("product_id, fecha, producto:product_id(*, producto_fotos(orden, fotos(id, path)))")
            .eq("user_email", email)
            .order("fecha", { ascending: false });

        return (data ?? []).map((row: any) => {
            const producto = row?.producto ?? null;
            if (!producto) return row;
            const { producto_fotos, ...rest } = producto;
            const ordered = (producto_fotos ?? [])
                .slice()
                .sort((a: any, b: any) => (a?.orden ?? 0) - (b?.orden ?? 0))
                .map((pf: any) => pf?.fotos?.path)
                .filter((p: string | null | undefined) => !!p);
            return {
                ...row,
                producto: { ...rest, foto_url: ordered[0] ?? null, foto_urls: ordered },
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
