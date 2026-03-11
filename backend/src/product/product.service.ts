import { Injectable } from "@nestjs/common";
import { Product } from "./product.dto";
import { CloudinaryService } from "src/Cloudinary/cloudinary.service";

import { randomString } from 'src/Global';
import { pool } from 'src/main';
import * as fs from 'fs/promises';
import { error } from "console";
@Injectable()
export class ProductService {
    constructor(private cloudinaryService: CloudinaryService){}

    async getAllProducts(){
        const [res] = await pool.query("select * from producto");
        return res;
    }

    async getProductById(id: string){
        const [res] = await pool.query("select * from producto where id = ?", [id]);
        return res;
    }   

    async getProductsByFarmer(farmerId: string){
        const [res] = await pool.query("select * from producto where farmer_id = ?", [farmerId]);
        return res;
    }


    async createProduct(product: Product, foto: Express.Multer.File){
        /* 
            aqui lo que hago es:
                - subo la imagen a cloudinary y obtengo la URL
                - inserto la URL de la imagen en la tabla fotos
                - inserto el producto en la tabla producto, con la URL de la imagen como clave ajena
                - borro la imagen del servidor local una vez subida a cloudinary
        */
        try{
            //primero hay que subir la imagen a cloudinary y obtener la URL para guardarla en la base de datos
            const resFoto = await this.cloudinaryService.uploadImage(foto.path);
    
            if(!resFoto || resFoto.error){
                throw new Error("Error al subir la imagen");
            }
    
            //se inserta la foto en la tabla fotos
            const [resFotoBD] = await pool.query("insert into fotos (path,id) values (?,?)", [resFoto.secure_url,resFoto.public_id]);
    
            //una vez guardada la foto se almacena el producto (ya que foto en producto es una clave ajena)
            const id = randomString();
            const [res] = await pool.query("insert into producto (id, nombre, foto, descripcion, precio, cantidad,email_agricultor) values (?, ?, ?, ?, ?, ?, ?)",
                [id,product.nombre,resFoto.public_id,product.descripcion,product.precio,product.cantidad,product.email_agricultor]
            );
    
            //se borra la imagen del servidor local una vez subida a cloudinary
            await fs.unlink(foto.path);
            return res;
        }
        catch(error){
            if(foto && foto.path){
                await fs.unlink(foto.path).catch(err => console.error("Error al borrar la imagen local:", err));
            }
            throw error;
        }
    }

    async updateProduct(id: string, product: Product,foto?: Express.Multer.File){
        //obtener el producto de la BD, para comprobar si existe el producto a actualizar y para obtener la foto antigua en caso de que se suba una nueva imagen
        const [producto] = await pool.query("select * from producto where id = ?", [id]);
        if(producto[0] === undefined){
            throw new Error("Producto no encontrado");
        }

        //si se ha subido una nueva imagen, hay que actualizar la foto del producto junto al resto de datos
        if(foto){
            //saco de la BD la foto antigua para borrarla de cloudinary
            const [fotoBD] = await pool.query("select * from fotos where id = ?", [producto[0].foto]);
            if(fotoBD[0] === undefined){
                throw new Error("Foto no encontrada");
            }

            //borro la foto antigua de cloudinary
            try {
                await this.cloudinaryService.deleteImage(fotoBD[0].id)
            } catch (error) {
                throw new Error("Error al borrar la imagen antigua de cloudinary: " + error.message);
            }

            //subo la nueva imagen a cloudinary y obtengo la URL para guardarla en la base de datos
            let resFoto;
            try {
                resFoto = await this.cloudinaryService.uploadImage(foto.path);
            } catch (error) {
                throw new Error("Error al subir la nueva imagen a cloudinary: " + error.message);
            }

            //una vez subida a la nube la subo a la BD y actualizo el producto con la nueva foto
            try {
                await pool.query("update fotos set path = ?, id = ? where id = ?", [resFoto.secure_url,resFoto.public_id,producto[0].foto]);
                await pool.query("update producto set nombre = ?, foto = ?, descripcion = ?, precio = ?, cantidad = ?, email_agricultor = ? where id = ?",
                    [product.nombre,resFoto.public_id,product.descripcion,product.precio,product.cantidad,product.email_agricultor,id]
                );
                //se borra la imagen del servidor local una vez subida a cloudinary
                await fs.unlink(foto.path);
            } catch (error) {
                throw new Error("Error al actualizar el producto en la base de datos: " + error.message);
            }
        }
        //en el caso de que no se haya subido una nueva imagen, solo se actualizan los datos del producto sin modificar la foto
        else{
            try {
                await pool.query("update producto set nombre = ?, descripcion = ?, precio = ?, cantidad = ?, email_agricultor = ? where id = ?",
                    [product.nombre,product.descripcion,product.precio,product.cantidad,product.email_agricultor,id]
                );
            } catch (error) {
                throw new Error("Error al actualizar el producto en la base de datos: " + error.message);
            }
        }
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
       const [producto] = await pool.query("select * from producto where id = ?", [id]);
       if(producto[0] === undefined){
           throw new Error("Producto no encontrado");
       }

       if(producto[0].foto){
            //saco de la BD la foto para borrarla de cloudinary
            const [fotoBD] = await pool.query("select * from fotos where id = ?", [producto[0].foto]);
            if(fotoBD[0] === undefined){
                throw new Error("Foto no encontrada");
            }

            //se borra la foto de cloudinary
            try {
                await this.cloudinaryService.deleteImage(fotoBD[0].id)
            } catch (error) {
                throw new Error("Error al borrar la imagen de cloudinary: " + error.message);
            }

            //se borra el producto de la BD y luego la foto de la BD
            try {
                await pool.query("delete from producto where id = ?", [id]);
                await pool.query("delete from fotos where id = ?", [producto[0].foto]);
            } catch (error) {
                throw new Error("Error al borrar el producto o la foto de la base de datos: " + error.message);
            }
       }
    }
}