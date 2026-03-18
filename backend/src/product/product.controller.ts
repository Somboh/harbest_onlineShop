import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Product } from "./product.dto";
import { AuthGuard } from "src/Auth/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

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
    /*
        lo que hago con el interceptor es:
         - esperar a un archivo que se llame "foto" en el body de la petición
         - guardarlo en la carpeta "uploads" del servidor local
         - renombrarlo con un nombre único (timestamp + número aleatorio) para evitar colisiones
         - una vez guardado el archivo se pasa al service para subirlo a cloudinary y obtener la URL, que es lo que se guardará en la base de datos
    */
    @UseInterceptors(FileInterceptor('foto',{
        storage: diskStorage({
            destination: './uploads',
            filename: (req,file,cb)=>{
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null,uniqueSuffix+extname(file.originalname));
            }
        })
    }))
    async createProduct(@Body() product: Product, @UploadedFile() foto: Express.Multer.File){
        return await this.productService.createProduct(product,foto);
    }

    @UseGuards(AuthGuard)
    @Put("/:id")
    @UseInterceptors(FileInterceptor('foto',{
        storage: diskStorage({
            destination: './uploads',
            filename: (req,file,cb)=>{
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null,uniqueSuffix+extname(file.originalname));
            }
        })
    }))
    async updateProduct(@Param("id") id: string, @Body() product: Product, @UploadedFile() foto?: Express.Multer.File){
        return await this.productService.updateProduct(id, product, foto);
    }

    @UseGuards(AuthGuard)
    @Delete("/:id")
    async deleteProduct(@Param("id") id: string){
        return await this.productService.deleteProduct(id);
    }
}