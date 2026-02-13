/* 
    Los DTO son más seguros que un simple JSON
    ya que comprueban que no pasen por ejemplo un nombre vacio
    o que el telefono sea un numero y no un string, etc
*/

import {IsString, IsInt, IsNotEmpty} from 'class-validator';

export class FarmerDTO {
    @IsString()
    @IsNotEmpty()
    nombre: string;
    
    @IsString()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;
    
    @IsString()
    @IsNotEmpty()
    direccion: string;
    
    @IsInt()
    @IsNotEmpty()
    telefono: number;
}