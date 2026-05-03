import { Body, Controller, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { PedidoService } from "./pedido.service";
import { CreatePedidoDTO, UpdateEstadoPedidoDTO } from "./pedido.dto";
import { AuthGuard } from "src/Auth/auth.guard";

@Controller("pedidos")
export class PedidoController {
    constructor(private readonly pedidoService: PedidoService) {}

    @Get("/user/:email")
    async getPedidosByUser(@Param("email") email: string) {
        return this.pedidoService.getPedidosByUser(email);
    }

    @Get("/farmer/:email")
    async getPedidosByFarmer(@Param("email") email: string) {
        return this.pedidoService.getPedidosByFarmer(email);
    }

    @Get("/:id")
    async getPedidoById(@Param("id") id: string) {
        return this.pedidoService.getPedidoById(id);
    }

    @UseGuards(AuthGuard)
    @Post("/")
    async createPedido(@Body() dto: CreatePedidoDTO) {
        return this.pedidoService.createPedido(dto);
    }

    @UseGuards(AuthGuard)
    @Put("/:id/estado")
    async updateEstado(@Param("id") id: string, @Body() dto: UpdateEstadoPedidoDTO) {
        return this.pedidoService.updateEstado(id, dto.estado);
    }
}
