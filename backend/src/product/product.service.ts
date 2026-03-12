import { Injectable } from "@nestjs/common";
import { Product } from "./product.dto";
import { randomString } from 'src/Global';
import { DatabaseService } from 'src/database/database.service';
import { CloudinaryService } from 'src/Cloudinary/cloudinary.service';
import * as fs from 'fs/promises';

@Injectable()
export class ProductService {
    constructor(
        private db: DatabaseService,
        private cloudinaryService: CloudinaryService
    ) {}

    async getAllProducts() {
        const { data, error } = await this.db.getClient()
            .from('producto')
            .select('*');
        if (error) throw error;
        return data;
    }

    async getProductById(id: string) {
        const { data, error } = await this.db.getClient()
            .from('producto')
            .select('*')
            .eq('id', id)
            .single();
        if (error) return null;
        return data;
    }

    async getProductsByFarmer(farmerId: string) {
        const { data, error } = await this.db.getClient()
            .from('producto')
            .select('*')
            .eq('email_agricultor', farmerId);
        if (error) throw error;
        return data;
    }

    async createProduct(product: Product, foto: Express.Multer.File) {
        try {
            const resFoto = await this.cloudinaryService.uploadImage(foto.path);
            if (!resFoto || resFoto.error) {
                throw new Error("Error al subir la imagen");
            }

            const { error: fotoError } = await this.db.getClient()
                .from('fotos')
                .insert({ path: resFoto.secure_url, id: resFoto.public_id });
            if (fotoError) throw fotoError;

            const id = randomString();
            const { data, error } = await this.db.getClient()
                .from('producto')
                .insert({ id, nombre: product.nombre, foto: resFoto.public_id, descripcion: product.descripcion, precio: product.precio, cantidad: product.cantidad, email_agricultor: product.email_agricultor });
            if (error) throw error;

            await fs.unlink(foto.path);
            return data;
        } catch (error) {
            if (foto && foto.path) {
                await fs.unlink(foto.path).catch(err => console.error("Error al borrar la imagen local:", err));
            }
            throw error;
        }
    }

    async updateProduct(id: string, product: Product, foto?: Express.Multer.File) {
        const { data: producto, error: getError } = await this.db.getClient()
            .from('producto')
            .select('*')
            .eq('id', id)
            .single();
        if (getError || !producto) throw new Error("Producto no encontrado");

        if (foto) {
            const { data: fotoBD, error: fotoGetError } = await this.db.getClient()
                .from('fotos')
                .select('*')
                .eq('id', producto.foto)
                .single();
            if (fotoGetError || !fotoBD) throw new Error("Foto no encontrada");

            try {
                await this.cloudinaryService.deleteImage(fotoBD.id);
            } catch (error) {
                throw new Error("Error al borrar la imagen antigua de cloudinary: " + error.message);
            }

            let resFoto;
            try {
                resFoto = await this.cloudinaryService.uploadImage(foto.path);
            } catch (error) {
                throw new Error("Error al subir la nueva imagen a cloudinary: " + error.message);
            }

            try {
                await this.db.getClient()
                    .from('fotos')
                    .update({ path: resFoto.secure_url, id: resFoto.public_id })
                    .eq('id', producto.foto);

                const { error } = await this.db.getClient()
                    .from('producto')
                    .update({ nombre: product.nombre, foto: resFoto.public_id, descripcion: product.descripcion, precio: product.precio, cantidad: product.cantidad, email_agricultor: product.email_agricultor })
                    .eq('id', id);
                if (error) throw error;

                await fs.unlink(foto.path);
            } catch (error) {
                throw new Error("Error al actualizar el producto en la base de datos: " + error.message);
            }
        } else {
            const { error } = await this.db.getClient()
                .from('producto')
                .update({ nombre: product.nombre, descripcion: product.descripcion, precio: product.precio, cantidad: product.cantidad, email_agricultor: product.email_agricultor })
                .eq('id', id);
            if (error) throw new Error("Error al actualizar el producto en la base de datos: " + error.message);
        }
    }

    async deleteProduct(id: string) {
        const { data: producto, error: getError } = await this.db.getClient()
            .from('producto')
            .select('*')
            .eq('id', id)
            .single();
        if (getError || !producto) throw new Error("Producto no encontrado");

        if (producto.foto) {
            const { data: fotoBD, error: fotoGetError } = await this.db.getClient()
                .from('fotos')
                .select('*')
                .eq('id', producto.foto)
                .single();
            if (fotoGetError || !fotoBD) throw new Error("Foto no encontrada");

            try {
                await this.cloudinaryService.deleteImage(fotoBD.id);
            } catch (error) {
                throw new Error("Error al borrar la imagen de cloudinary: " + error.message);
            }

            const { error: deleteProductError } = await this.db.getClient()
                .from('producto')
                .delete()
                .eq('id', id);
            if (deleteProductError) throw new Error("Error al borrar el producto: " + deleteProductError.message);

            const { error: deleteFotoError } = await this.db.getClient()
                .from('fotos')
                .delete()
                .eq('id', producto.foto);
            if (deleteFotoError) throw new Error("Error al borrar la foto: " + deleteFotoError.message);
        }
    }
}
