import { Injectable } from "@nestjs/common";
import { Product } from "./product.dto";
import { CloudinaryService } from "src/Cloudinary/cloudinary.service";

import { randomString } from 'src/Global';
import { pool } from 'src/main';
import * as fs from 'fs/promises';
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

    async updateProduct(id: string, product: Product){
        //se comprueba si la imagen ya existe
        //const [resFoto] = await pool.query("select * from fotos where id = ?",[product.foto])

        //si existe no se hace nada con la imagen

        /*en el caso de que no exista:
            - cojo la imagen antigua de la base de datos para borrarla de cloudinary
            - subo la nueva imagen a cloudinary y obtengo la URL
            - almaceno la nueva URL en la base de datos 
                (actualizo la tabla fotos con la nueva URL, si se borra la foto se borra el producto)
            - actualizo el producto con la nueva URL de la imagen
        */
    }

    async deleteProduct(id: string){
        // //se obtiene la imagen de la BD para luego poder borrarla de cloudinary
        // const url = await pool.query("select foto from producto where id = ?", [id]);

        // //se borra la imagen de cloudinary

        // //se borra la foto de la tabla fotos
        // await pool.query("delete from fotos where id = ?", [url[0][0].foto]);
        
        
        // return res;
    }
}