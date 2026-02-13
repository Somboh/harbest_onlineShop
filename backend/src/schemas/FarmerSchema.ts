import { Prop, Schema , SchemaFactory} from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type FarmerDocument = HydratedDocument<Farmer>;

@Schema()
export class Farmer {
    @Prop({required: true})
    nombre: string;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop({required: true})
    direccion: string;

    @Prop()
    telefono: Number;
}

export const FarmerSchema = SchemaFactory.createForClass(Farmer);