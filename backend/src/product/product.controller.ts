import { Controller, Delete, Get, Post, Put, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Product } from "./product.dto";
import { AuthGuard } from "src/Auth/auth.guard";

@Controller("product")
export class ProductController {
    constructor(private readonly productService: ProductService){}
    
    @Get("/")
    async getAllProducts(){
        return await this.productService.getAllProducts();
    }
    
    @Get("/:id")
    async getProductById(id: string){
        return await this.productService.getProductById(id);
    }
    
    @Get("/farmer/:farmerId")
    async getProductsByFarmer(farmerId: string){
        return await this.productService.getProductsByFarmer(farmerId);
    }
    
    @UseGuards(AuthGuard)
    @Post("/")
    async createProduct(product: Product){
        return await this.productService.createProduct(product);
    }

    @UseGuards(AuthGuard)
    @Put("/:id")
    async updateProduct(id: string, product: Product){
        return await this.productService.updateProduct(id, product);
    }

    @UseGuards(AuthGuard)
    @Delete("/:id")
    async deleteProduct(id: string){
        return await this.productService.deleteProduct(id);
    }
}