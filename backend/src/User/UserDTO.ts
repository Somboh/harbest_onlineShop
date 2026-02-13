import {IsString, IsInt, IsNotEmpty} from 'class-validator';

export class UserDTO {
    @IsString()
    @IsNotEmpty()
    nombre: string;
    
    @IsString()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;
}