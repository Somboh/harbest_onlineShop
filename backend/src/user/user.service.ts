import { Injectable } from '@nestjs/common';
import { User } from './user.dto';
import { CloudinaryService } from 'src/Cloudinary/cloudinary.service';
import { DatabaseService } from 'src/database/database.service';
import bcrypt from 'bcryptjs';

import * as fs from 'fs/promises';
@Injectable()
export class UserService {
  constructor(private cloudinaryService: CloudinaryService,private db:DatabaseService){}
  // async createUser(data) {
  //   let id = randomString();
  //   const [result] = await pool.query(
  //     'INSERT INTO usuario (id, nombre, email, contra) VALUES (?, ?, ?, ?)',
  //     [id, data.nombre, data.email, data.contra],
  //   );

  //   return result;
  // }

  async getUser(userId:string) {
    const {data} = await this.db.getClient().from("usuario").select("*").eq("id", userId).single();
    return data;
  }
  async getUsers() {
    const {data} = await this.db.getClient().from("usuario").select("*");
    return data;
  }
  async getUserByEmail(email: string) {
    const {data} = await this.db.getClient().from("usuario").select("*").eq("email", email).single();
    return data;
  }

  async updateUser(userId:string, user:User, foto?:Express.Multer.File) {
    try {
      //se obtiene el usuario de la BD
      const {data:usr} = await this.db.getClient().from("usuario").select("*").eq("id", userId).single();
      if (!usr || usr.length === 0) {
        if(foto){
          await fs.unlink(foto.path); //elimino la foto del servidor local si el usuario no existe
        }
        throw new Error("Usuario no encontrado");
      }

      if(foto){ //si hay foto se actualiza
        const fotoAntigua = usr.foto;

        //se sube la nueva foto a cloudinary
        let newFoto = await this.cloudinaryService.uploadImage(foto.path);
        if(!newFoto || newFoto.error){
          throw new Error("Error al subir la nueva imagen");
        }

        //se inserta la nueva foto en la tabla fotos
        await this.db.getClient().from("fotos").insert({id: newFoto.public_id, path: newFoto.secure_url});
        //se actualiza el usuario con la nueva foto

        //primero hago hash de la nueva contraseña para guardarla en la base de datos
        const salt = await bcrypt.genSalt(10);
        //segundo guardo la info del usuario en la BD, con la nueva foto como clave ajena
        await this.db.getClient().from("usuario").update({
          nombre: user.nombre,
          email: user.email,
          contra: await bcrypt.hash(user.contra, salt),
          foto: newFoto.public_id
        }).eq("id", userId);
        
        if(fotoAntigua){
          //se borra la foto actual del usuario de cloudinary
          await this.cloudinaryService.deleteImage(fotoAntigua);

          //se borra la foto anitgua del usuario de la tabla fotos
          await this.db.getClient().from("fotos").delete().eq("id", fotoAntigua);
        }

        //se borra la imagen del servidor local una vez subida a cloudinary
        await fs.unlink(foto.path);
      }
      else{ //si no hay foto se actualiza solo el usuario sin cambiar la foto
        const salt = await bcrypt.genSalt(10);
        await this.db.getClient().from("usuario").update({
          nombre: user.nombre,
          email: user.email,
          contra: await bcrypt.hash(user.contra, salt)
        }).eq("id", userId);
      }
      
    } catch (error) {
      if(foto){
        await fs.unlink(foto.path); //elimino la foto del servidor local una vez subida a cloudinary
      }
      throw new Error("Error al actualizar el usuario");
    }
    return {status: "OK", message:"Usuario actualizado"};
  }
  async deleteUser(userId:string) {
    const {data:usr} = await this.db.getClient().from("usuario").select("*").eq("id", userId).single();
    if(!usr){
      throw new Error("Usuario no encontrado");
    }
    const {data:usrProf} = await this.db.getClient().from("fotos").select("*").eq("id", usr.foto).single();
    if(!usrProf){
      throw new Error("Foto del usuario no encontrada");
    }
    try {
      await this.cloudinaryService.deleteImage(usrProf.id);
      await this.db.getClient().from("usuario").delete().eq("id", userId);
      await this.db.getClient().from("fotos").delete().eq("id", usr.foto);
    } catch (error) {
      throw new Error("Error al eliminar el usuario");
    }
    return {status: "OK", message:"Usuario eliminado"};
  }
}
