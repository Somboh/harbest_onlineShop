import { Controller,Get,Post,Put, Delete, Body } from "@nestjs/common";
import { FarmerService } from "src/service/FarmerService";
import { FarmerDTO } from "src/dto/FarmerDTO";

@Controller("farmer")
export class FarmerController {
    constructor(private readonly farmerService: FarmerService) {}

    @Get("/")
    async getAllFarmers(): Promise<string> {
        return await this.farmerService.getAllFarmers();
    }

    @Post("/new")
    //Se pasa como parametro el cuerpo de la petición que debe ser un objeto del tipo FarmerDTO
    //Si pasa la validación del DTO, se llama al servicio para crear el farmer
    async createFarmer(@Body() farmer: FarmerDTO){
        return await this.farmerService.createFarmer(farmer);
    }
}