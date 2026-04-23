import { Injectable} from "@nestjs/common";
import { CloudinaryService } from "src/Cloudinary/cloudinary.service";
import { FarmerDTO } from "src/Farmer/farmer.dto";
import { DatabaseService } from "src/database/database.service";
import * as fs from 'fs/promises';

@Injectable()
export class FarmerService {
    //Se inyecta el modelo de Farmer para poder hacer operaciones en la base de datos
    constructor(private cloudinaryService: CloudinaryService,private db: DatabaseService){}

    async getAllFarmers(){
      const {data,error} = await this.db.getClient().from('agricultor').select('*');

      if(error){
        return {status:'ERROR', message:'Error al obtener los agricultores'};
      }
      return data;
    }

    async getFarmerById(id: string){
      const {data,error} = await this.db.getClient().from('agricultor').select('*').eq('id', id).single();

      if(error){
        return {status:'ERROR', message:'Error al obtener el agricultor'};
      }
      
      return data;
    }

    async getFarmerByEmail(email: string){
      const {data,error} = await this.db.getClient().from('agricultor').select('*').eq('email', email).single();

      if(error){
        return {status:'ERROR', message:'Error al obtener el agricultor'};
      }

      return data;
    }
    

    async deleteFarmer(id:String){
      //comprobar si el agricultor existe
      const {data,error} = await this.db.getClient().from("agricultor").select("*").eq("id", id).single();

      if(error || !data){
        return {status:'ERROR', message:'Agricultor no encontrado'};
      }
      
      //borrar la foto del agricultor de cloudinary
      try {
        await this.cloudinaryService.deleteImage(data.foto);
        
        //borrar el agriculto y luego la foto de la BD
        await this.db.getClient().from("agricultor").delete().eq("id", id);
        await this.db.getClient().from("fotos").delete().eq("id", data.foto);

      } catch (error) {
        return {status:'ERROR', message:'Error al borrar la foto del agricultor'};
      }
      return {status:'OK', message:'Agricultor eliminado'};
    }

    async updateFarmer(id:String,farmer: FarmerDTO,foto?: Express.Multer.File){
      //comprobar si el agricultor existe
      const {data,error} = await this.db.getClient().from("agricultor").select("*").eq("id", id).single();

      if(error || !data){
        if(foto){
          await fs.unlink(foto.path);
        }
        return {status:'ERROR', message:'Agricultor no encontrado'};
      }

      if(foto){
        //se sube la foto nueva a cloudinary
        let newFoto = await this.cloudinaryService.uploadImage(foto.path);
        if(!newFoto || newFoto.error){
          if(foto){
            await fs.unlink(foto.path);
          }
          return {status:'ERROR', message:'Error al subir la foto'};
        }

        //se inserta la nueva foto en la tabla fotos
        await this.db.getClient().from("fotos").insert({id: newFoto.public_id, path: newFoto.secure_url});

        //se actualiza el agricultor con la nueva foto
        const {error} = await this.db.getClient().from("agricultor").update({ ...farmer, foto: newFoto.public_id }).eq("id", id);
        if(error){
          if(foto){
            await fs.unlink(foto.path);
          }
          return {status:'ERROR', message:'Error al actualizar el agricultor'};
        }

        //se borra la imagen antigua del agricultor de cloudinary
        try {
          //se borra de cloudinary
          await this.cloudinaryService.deleteImage(data.foto);

          //se borra de la tabla fotos
          await this.db.getClient().from("fotos").delete().eq("id", data.foto);

          await fs.unlink(foto.path);
        } catch (error) {
          if(foto){
            await fs.unlink(foto.path);
          }
          return {status:'ERROR', message:'Error al borrar la foto antigua'};
        }
      }

      return {status:'OK', message:'Agricultor actualizado'};
    }
}
