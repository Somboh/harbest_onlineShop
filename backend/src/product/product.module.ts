import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { CloudinaryModule } from "src/Cloudinary/cloudinary.module";

@Module({
    imports: [CloudinaryModule],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}