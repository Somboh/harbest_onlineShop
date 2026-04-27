import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class Valoracion {
    @IsNumber()
    @IsNotEmpty()
    valoracion:number;

    @IsInt()
    @IsNotEmpty()
    product_id:number;

    @IsString()
    @IsNotEmpty()
    user_email:string;
}