import { Injectable } from "@nestjs/common";
import { Product } from "./product.dto";
import { randomString } from 'src/Global';
import * as fs from 'fs/promises';
import { DatabaseService } from "src/database/database.service";
import { CloudinaryService } from "src/Cloudinary/cloudinary.service";
@Injectable()
export class ProductService {
    constructor(private cloudinaryService: CloudinaryService, private db:DatabaseService){}

    async getAllProducts(){
        const {data} = await this.db.getClient().from("producto").select("*");
        return data;
    }

    async getProductById(id: string){
        const {data} = await this.db.getClient().from("producto").select("*").eq("id", id);
        return data;
    }   

    async getProductsByFarmer(farmerId: string){
        const {data} = await this.db.getClient().from("producto").select("*").eq("email_agricultor", farmerId);
        return data;
    }

    async createProduct(product: Product, foto: Express.Multer.File) {
        try {
            const resFoto = await this.cloudinaryService.uploadImage(foto.path);
            if (!resFoto || resFoto.error) {
                throw new Error("Error al subir la imagen");
            }
    
            //se inserta la foto en la tabla fotos
            await this.db.getClient().from("fotos").insert({id: resFoto.public_id, path: resFoto.secure_url});
    
            //una vez guardada la foto se almacena el producto (ya que foto en producto es una clave ajena)
            const id = randomString();

            const { error:errorProduct } = await this.db.getClient().from("producto").insert({
                id,
                nombre: product.nombre,
                foto: resFoto.public_id,
                descripcion: product.descripcion,
                precio: product.precio,
                cantidad: product.cantidad,
                email_agricultor: product.email_agricultor,
                categoria: product.categoria,
                valoracion: 0,
            });
    
            if(errorProduct){
                await this.cloudinaryService.deleteImage(resFoto.public_id); //elimino la imagen de cloudinary si hay un error al insertar el producto en la base de datos
                await this.db.getClient().from("fotos").delete().eq("id", resFoto.public_id); //elimino la foto de la tabla fotos si hay un error al insertar el producto en la base de datos
                await fs.unlink(foto.path); //elimino la foto del servidor local una vez subida a cloudinary
                return {status: "ERROR", message: "Error al crear el producto: " + errorProduct.message};
            }
            //se borra la imagen del servidor local una vez subida a cloudinary
            await fs.unlink(foto.path);
        }
        catch(error){
            if(foto && foto.path){
                await fs.unlink(foto.path).catch(err => console.error("Error al borrar la imagen local:", err));
            }
            throw error;
        }
        return {status: "OK", message:"Producto creado"};
    }

    async updateProduct(id: string, product: Product,foto?: Express.Multer.File){
        //obtener el producto de la BD, para comprobar si existe el producto a actualizar y para obtener la foto antigua en caso de que se suba una nueva imagen
        const {data,error} = await this.db.getClient().from("producto").select("*").eq("id", id).single();
        if(error || !data){
            throw new Error("Producto no encontrado");
        }

        //si se ha subido una nueva imagen, hay que actualizar la foto del producto junto al resto de datos
        if(foto){
            //saco de la BD la foto antigua para borrarla de cloudinary
            const {data:fotoBD,error:fotoError} = await this.db.getClient().from("fotos").select("*").eq("id", data.foto).single();

            if(fotoError || !fotoBD || fotoBD.length === 0){
                throw new Error("Foto no encontrada");
            }

            try {
                await this.cloudinaryService.deleteImage(fotoBD.id)
            } catch (error) {
                if(foto && foto.path){
                    await fs.unlink(foto.path).catch(err => console.error("Error al borrar la imagen local:", err));
                }

                throw new Error("Error al borrar la imagen antigua de cloudinary: " + error.message);
            }

            let resFoto;
            try {
                resFoto = await this.cloudinaryService.uploadImage(foto.path);
            } catch (error) {
                if(foto && foto.path){
                    await fs.unlink(foto.path).catch(err => console.error("Error al borrar la imagen local:", err));
                }
                throw new Error("Error al subir la nueva imagen a cloudinary: " + error.message);
            }

            try {
                const { error: fotoErrorUpdate } = await this.db.getClient().from("fotos").update({ path: resFoto.secure_url, id: resFoto.public_id }).eq("id", data.foto);
                const { error: productError } = await this.db.getClient().from("producto").update({ 
                    nombre: product.nombre,
                    foto: resFoto.public_id,
                    descripcion: product.descripcion,
                    precio: product.precio,
                    cantidad: product.cantidad,
                    email_agricultor: product.email_agricultor,
                    categoria: product.categoria,
                    valoracion: product.valoracion,
                }).eq("id", id);
                //se borra la imagen del servidor local una vez subida a cloudinary
                if(fotoErrorUpdate){
                    await this.cloudinaryService.deleteImage(resFoto.public_id); //elimino la imagen de cloudinary si hay un error al actualizar la foto en la base de datos
                    await fs.unlink(foto.path);
                    throw new Error("Error al actualizar la foto en la base de datos: " + fotoErrorUpdate.message);
                }
                else if(productError){
                    await this.cloudinaryService.deleteImage(resFoto.public_id); //elimino la imagen de cloudinary si hay un error al actualizar el producto en la base de datos
                    await fs.unlink(foto.path);
                    throw new Error("Error al actualizar el producto en la base de datos: " + productError.message);
                }
                await fs.unlink(foto.path);
            } catch (error) {
                await fs.unlink(foto.path); //elimino la foto del servidor local una vez subida a cloudinary
                throw new Error("Error al actualizar el producto en la base de datos: " + error.message);
            }
        }
        //en el caso de que no se haya subido una nueva imagen, solo se actualizan los datos del producto sin modificar la foto
        else{
            try {
                await this.db.getClient().from("producto").update({
                    nombre: product.nombre,
                    descripcion: product.descripcion,
                    precio: product.precio,
                    cantidad: product.cantidad,
                    email_agricultor: product.email_agricultor,
                    categoria: product.categoria,
                    valoracion: product.valoracion,
                }).eq("id", id);
            } catch (error) {
                throw new Error("Error al actualizar el producto en la base de datos: " + error.message);
            }
        }
        return {status: "OK", message:"Producto actualizado"};
    }

    async deleteProduct(id: string){
        /*
            - hay que obtener el producto de la BD
            - sacamos la url y el id de la foto para borrarla de cloudinary
            - borramos la foto de cloudinary
            - borramos el producto de la BD
            - borramos la foto de la BD
        */
       //comprobar que el producto existe y se saca el id de la foto para borrarla de cloudinary
       const {data,error} = await this.db.getClient().from("producto").select("*").eq("id", id).single();
       if(error){
           throw new Error("Error al obtener el producto: " + error.message);
       }
       if(!data){
           throw new Error("Producto no encontrado");
       }

       if(data.foto){
            //saco de la BD la foto para borrarla de cloudinary
            const {data:fotoBD,error:fotoError} = await this.db.getClient().from("fotos").select("*").eq("id", data.foto).single();
            if(fotoError || !fotoBD){
                throw new Error("Foto no encontrada");
            }

            try {
                await this.cloudinaryService.deleteImage(fotoBD.id)
            } catch (error) {
                throw new Error("Error al borrar la imagen de cloudinary: " + error.message);
            }

            //se borra el producto de la BD y luego la foto de la BD
            try {
                await this.db.getClient().from("producto").delete().eq("id", id);
                await this.db.getClient().from("fotos").delete().eq("id", data.foto);
            } catch (error) {
                throw new Error("Error al borrar el producto o la foto de la base de datos: " + error.message);
            }
       }
       return {status: "OK", message:"Producto eliminado"};
    }
}
