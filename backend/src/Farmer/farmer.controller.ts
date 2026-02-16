import { Controller,Get,Post,Put, Delete, Body,Param, UseGuards } from "@nestjs/common";
import { FarmerService } from "src/Farmer/farmer.service";
import { FarmerDTO } from "src/Farmer/farmer.dto";
import { AuthGuard } from "src/Auth/auth.guard";

@Controller("farmer")
export class FarmerController {
    constructor(private readonly farmerService: FarmerService) {}

    @Get("/")
    //Obtener todos los agricultores
    async getAllFarmers(){
        return await this.farmerService.getAllFarmers();
    }

    @Get("/:id")
    //Obtener un agricultor por su ID
    async getFarmerById(@Param("id") id: string){
        return this.farmerService.getFarmerById(id);
    }

    @UseGuards(AuthGuard)
    @Delete("/:id")
    async deleteFarmer(@Param("id") id: string){
        return this.farmerService.deleteFarmer(id);
    }

    @UseGuards(AuthGuard)
    @Put("/:id")
    async modifyFarmer(@Param("id") id: string, @Body() farmer: FarmerDTO){
        return this.farmerService.modifyFarmer(id,farmer);
    }
}