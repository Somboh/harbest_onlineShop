import { Module } from "@nestjs/common";
import { FavoritoController } from "./favorito.controller";
import { FavoritoService } from "./favorito.service";
import { DatabaseModule } from "src/database/database.module";

@Module({
    imports: [DatabaseModule],
    controllers: [FavoritoController],
    providers: [FavoritoService],
})
export class FavoritoModule {}
