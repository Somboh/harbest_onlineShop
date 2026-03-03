import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class Product {
    @IsString()
    @IsNotEmpty()
    nombre: String;

    @IsString()
    @IsNotEmpty()
    descripcion: String;

    @IsInt()
    @IsNotEmpty()
    @Type(() => Number) //para transformar el valor a número, ya que viene como string en el body
    precio: number;
    
    @IsInt()
    @IsNotEmpty()
    @Type(() => Number) //para transformar el valor a número, ya que viene como string en el body
    cantidad: number;

    @IsString()
    @IsNotEmpty()
    email_agricultor: String;
}