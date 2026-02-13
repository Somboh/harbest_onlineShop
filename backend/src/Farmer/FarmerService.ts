import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Farmer } from "src/Farmer/FarmerSchema";
import { Model } from "mongoose";
import { FarmerDTO } from "src/Farmer/FarmerDTO";

@Injectable()
export class FarmerService {
    //Se inyecta el modelo de Farmer para poder hacer operaciones en la base de datos
    constructor(@InjectModel(Farmer.name) private farmerModel: Model<Farmer>){}

    async getAllFarmers(): Promise<Farmer[]> {
        return await this.farmerModel.find().exec();
    }

    async getFarmerById(id: string): Promise<Farmer> {
        const farmer = await this.farmerModel.findById(id).exec(); 
        if(!farmer){
            throw new NotFoundException(`Farmer not found`);
        }
        return farmer;
    }

    async createFarmer(farmer: FarmerDTO): Promise<Farmer> {
        //se crea la instancia del modelo con los datos del farmer
        const createdFarmer = new this.farmerModel(farmer);

        //se guarda en la base de datos 
        //se puede usar el método save() porque es una instancia del modelo
        return await createdFarmer.save();
    }
}