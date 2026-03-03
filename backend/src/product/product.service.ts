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

    async updateProduct(id: string, product: Product,foto?: Express.Multer.File){
        //se comprueba si la imagen del producto ha cambiado

        //si es igual no se hace nada con la imagen pero si que se modifica el producto con los nuevos datos

        /*en el caso de que sea distinta:
            - cojo la imagen antigua de la base de datos para borrarla de cloudinary (con el id de la BD)
            - modifico la fila en la BD por lo que cambia la url y el id
            - actualizo el producto y además añado la clave ajena de la foto con el nuevo id de la foto
        */
    }

    async deleteProduct(id: string){
        /*
            - hay que obtener el producto de la BD
            - sacamos la url y el id de la foto para borrarla de cloudinary
            - borramos la foto de cloudinary
            - borramos el producto de la BD
            - borramos la foto de la BD
        */
    }
}