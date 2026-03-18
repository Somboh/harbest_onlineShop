import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { CloudinaryModule } from "src/Cloudinary/cloudinary.module";
import { DatabaseModule } from "src/database/database.module";
@Module({
    imports: [CloudinaryModule,DatabaseModule],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}