import { Injectable } from "@nestjs/common";
import { FarmerDTO } from "src/Farmer/farmer.dto";
import { randomString } from 'src/Global';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FarmerService {
    constructor(private db: DatabaseService) {}

    async getAllFarmers() {
        const { data, error } = await this.db.getClient()
            .from('agricultor')
            .select('*');

        if (error) throw error;
        return data;
    }

    async getFarmerById(id: string) {
        const { data, error } = await this.db.getClient()
            .from('agricultor')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data;
    }

    async deleteFarmer(id: string) {
        const { error } = await this.db.getClient()
            .from('agricultor')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { message: 'Agricultor eliminado' };
    }

    async modifyFarmer(id: string, farmer: FarmerDTO) {
        const { error } = await this.db.getClient()
            .from('agricultor')
            .update({ nombre: farmer.nombre, email: farmer.email, telefono: farmer.telefono, direccion: farmer.direccion })
            .eq('id', id);

        if (error) throw error;
        return { message: 'Agricultor actualizado' };
    }
}
