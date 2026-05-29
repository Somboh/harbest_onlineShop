import { DatabaseService } from "src/database/database.service";
import { Valoracion } from "./valoracion.dto";
import { randomString } from "src/Global";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ValoracionService {
    constructor(private readonly db:DatabaseService) {}

    async getValoraciones() {
        const {data} = await this.db.getClient().from("valoracion").select("*");
        return data;
    }

    async getValoracionById(id: number) {
        const {data} = await this.db.getClient().from("valoracion").select("*").eq("id", id);
        return data;
    }

    async getValoracionesByProductId(productId: number) {
        const {data} = await this.db.getClient().from("valoracion").select("*").eq("product_id", productId);
        return data;
    }

    async getValoracionesByUserEmail(user_email: string) {
        const {data} = await this.db.getClient().from("valoracion").select("*").eq("user_email", user_email);
        return data;
    }

    async createValoracion(data:Valoracion) {
        let v = {
            id : randomString(),
            valoracion : data.valoracion,
            product_id : data.product_id,
            user_email : data.user_email
        }
        const {data:valoracion} = await this.db.getClient().from("valoracion").insert(v).select("*").single();
        return valoracion;
    }

    async updateValoracion(id: number, data: Valoracion) {
        const {data:valoracion} = await this.db.getClient().from("valoracion").update(data).eq("id", id).select("*").single();
        return valoracion;
    }

    async deleteValoracion(id: number) {
        const {data:valoracion} = await this.db.getClient().from("valoracion").delete().eq("id", id).select("*").single();
        return valoracion;
    }
}