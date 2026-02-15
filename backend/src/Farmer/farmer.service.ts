import { Injectable, NotFoundException } from "@nestjs/common";
import { FarmerDTO } from "src/Farmer/farmer.dto";

import { randomString } from 'src/Global';
import { pool } from 'src/main';

@Injectable()
export class FarmerService {
    //Se inyecta el modelo de Farmer para poder hacer operaciones en la base de datos
    constructor(){}

    async getAllFarmers(){
        const [result] = await pool.query(
          'SELECT * from agricultor',
        );

        return result;
    }

    async getFarmerById(id: string){
        const [result] = await pool.query(
          'SELECT * from agricultor WHERE id = ?',
          [id],
        );

        return result;
    }

    async createFarmer(farmer: FarmerDTO){
        let id = randomString();
        const [result] = await pool.query(
          'INSERT INTO agricultor (id, nombre, email, contra, direccion, telefono) VALUES (?, ?, ?, ?, ?, ?)',
          [id, farmer.nombre, farmer.email, farmer.contra, farmer.direccion, farmer.telefono],
        );

        return result;
    }
}