import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { DatabaseModule } from 'src/database/database.module';
import { CloudinaryModule } from "src/Cloudinary/cloudinary.module";

@Module({
    imports: [DatabaseModule, CloudinaryModule],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
