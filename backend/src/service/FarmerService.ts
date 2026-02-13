import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Farmer } from "src/schemas/FarmerSchema";
import { Model } from "mongoose";
import { FarmerDTO } from "src/dto/FarmerDTO";

@Injectable()
export class FarmerService {
    //Se inyecta el modelo de Farmer
    constructor(@InjectModel(Farmer.name) private farmerModel: Model<Farmer>){}

    async getAllFarmers(): Promise<string> {
        return "All farmers"; 
    }

    async createFarmer(farmer: FarmerDTO): Promise<Farmer> {
        //se crea la instancia del modelo con los datos del farmer
        const createdFarmer = new this.farmerModel(farmer);

        //se guarda en la base de datos 
        //se puede usar el método save() porque es una instancia del modelo
        return await createdFarmer.save();
    }
}