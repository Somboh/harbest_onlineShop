import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Product } from "./product.dto";
import { AuthGuard } from "src/Auth/auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

const MAX_FOTOS = 5;

const fotosStorage = diskStorage({
    destination: './uploads',
    filename: (req,file,cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + extname(file.originalname));
    },
});

@Controller("product")
export class ProductController {
    constructor(private readonly productService: ProductService){}

    @Get("/")
    async getAllProducts(){
        return await this.productService.getAllProducts();
    }

    @Get("/search")
    async searchProducts(@Query("q") q: string){
        return await this.productService.searchProducts(q);
    }

    @Get("/category/:categoria")
    async getProductsByCategory(@Param("categoria") categoria: string){
        return await this.productService.getProductsByCategory(categoria);
    }

    @Get("/farmer/:farmerId")
    async getProductsByFarmer(@Param("farmerId") farmerId: string){
        return await this.productService.getProductsByFarmer(farmerId);
    }

    @Get("/:id")
    async getProductById(@Param("id") id: string){
        return await this.productService.getProductById(id);
    }

    @UseGuards(AuthGuard)
    @Post("/")
    /*
        Recibimos hasta MAX_FOTOS archivos en el campo "fotos" del multipart.
        Cada uno se guarda primero en ./uploads con un nombre único, después
        el service los sube a Cloudinary y los enlaza al producto vía la tabla
        intermedia producto_fotos. El orden en el array determina el orden de
        las fotos (la primera es la principal).
    */
    @UseInterceptors(FilesInterceptor('fotos', MAX_FOTOS, { storage: fotosStorage }))
    async createProduct(@Body() product: Product, @UploadedFiles() fotos: Express.Multer.File[]){
        if(!fotos || fotos.length === 0){
            throw new BadRequestException("Debes subir al menos una foto del producto");
        }
        return await this.productService.createProduct(product, fotos);
    }

    @UseGuards(AuthGuard)
    @Put("/:id")
    @UseInterceptors(FilesInterceptor('fotos', MAX_FOTOS, { storage: fotosStorage }))
    async updateProduct(@Param("id") id: string, @Body() product: Product, @UploadedFiles() fotos?: Express.Multer.File[]){
        return await this.productService.updateProduct(id, product, fotos ?? []);
    }

    @UseGuards(AuthGuard)
    @Patch("/:id/reponer")
    async reponerProduct(@Param("id") id: string){
        return await this.productService.reponerProduct(id);
    }

    @UseGuards(AuthGuard)
    @Delete("/:id")
    async deleteProduct(@Param("id") id: string){
        return await this.productService.deleteProduct(id);
    }
}
