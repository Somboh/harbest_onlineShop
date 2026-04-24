import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ValoracionService } from "./valoracion.service";
import { AuthGuard } from "src/Auth/auth.guard";
import { Valoracion } from "./valoracion.dto";

@Controller('/valoraciones')
export class ValoracionController {
    constructor(private readonly valoracionService: ValoracionService){}

    @Get("/")
    async getValoraciones() {return this.valoracionService.getValoraciones();}

    @Get("/:id")
    async getValoracionById(@Param("id") id: number) {return this.valoracionService.getValoracionById(id);}

    @Get("/product/:product_id")
    async getValoracionesByProductId(@Param("product_id") product_id: number) {return this.valoracionService.getValoracionesByProductId(product_id);}

    @Get("/user/:user_email")
    async getValoracionesByUserEmail(@Param("user_email") user_email: string) {return this.valoracionService.getValoracionesByUserEmail(user_email);}

    @Post("/")
    @UseGuards(AuthGuard)
    async createValoracion(@Body() data: Valoracion) {return this.valoracionService.createValoracion(data);}

    @Put("/:id")
    @UseGuards(AuthGuard)
    async updateValoracion(@Param("id") id: number, @Body() data: Valoracion) {return this.valoracionService.updateValoracion(id, data);}

    @Delete("/:id")
    @UseGuards(AuthGuard)
    async deleteValoracion(@Param("id") id: number) {return this.valoracionService.deleteValoracion(id);}
}