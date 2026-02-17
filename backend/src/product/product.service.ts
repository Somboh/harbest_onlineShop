import { Injectable } from "@nestjs/common";
import { Product } from "./product.dto";

import { randomString } from 'src/Global';
import { pool } from 'src/main';
@Injectable()
export class ProductService {
    async getAllProducts(){}

    async getProductById(id: string){}

    async getProductsByFarmer(farmerId: string){}

    async createProduct(product: Product){}

    async updateProduct(id: string, product: Product){}

    async deleteProduct(id: string){}
}