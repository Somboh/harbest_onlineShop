import { Injectable} from "@nestjs/common";
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

    async deleteFarmer(id:String){
      const [result] = await pool.query(
        'delete from agricultor where id = ?',
        [id]
      );

      return result;
    }

    async modifyFarmer(id:String,farmer: FarmerDTO,foto?: Express.Multer.File){
      const [result] = await pool.query(
        'update agricultor set nombre = ?, email = ?, telefono = ?, direccion = ? where id = ?',
        [farmer.nombre, farmer.email, farmer.telefono, farmer.direccion, id]
      );

      return result;
    }
}