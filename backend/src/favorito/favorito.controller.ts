import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { FavoritoService } from "./favorito.service";
import { FavoritoDTO } from "./favorito.dto";
import { AuthGuard } from "src/Auth/auth.guard";

@Controller("favoritos")
export class FavoritoController {
    constructor(private readonly favoritoService: FavoritoService) {}

    @Get("/user/:email")
    async getFavoritosByUser(@Param("email") email: string) {
        return this.favoritoService.getFavoritosByUser(email);
    }

    @UseGuards(AuthGuard)
    @Post("/")
    async addFavorito(@Body() dto: FavoritoDTO) {
        return this.favoritoService.addFavorito(dto);
    }

    @UseGuards(AuthGuard)
    @Delete("/:user_email/:product_id")
    async removeFavorito(
        @Param("user_email") user_email: string,
        @Param("product_id") product_id: string,
    ) {
        return this.favoritoService.removeFavorito(user_email, product_id);
    }
}
