import { Controller,Get,Post,Put, Delete, Body,Param } from "@nestjs/common";
import { FarmerService } from "src/Farmer/FarmerService";
import { FarmerDTO } from "src/Farmer/FarmerDTO";
import { Farmer } from "src/Farmer/FarmerSchema";

@Controller("farmer")
export class FarmerController {
    constructor(private readonly farmerService: FarmerService) {}

    @Get("/")
    //Obtener todos los agricultores
    async getAllFarmers(): Promise<Farmer[]> {
        return await this.farmerService.getAllFarmers();
    }

    @Get("/:id")
    //Obtener un agricultor por su ID
    async getFarmerById(@Param("id") id: string): Promise<Farmer>{
        return this.farmerService.getFarmerById(id);
    }
    @Post("/new")
    //Se pasa como parametro el cuerpo de la petición que debe ser un objeto del tipo FarmerDTO
    //Si pasa la validación del DTO, se llama al servicio para crear el farmer
    async createFarmer(@Body() farmer: FarmerDTO){
        return await this.farmerService.createFarmer(farmer);
    }
}