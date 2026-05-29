import {IsString, IsNotEmpty, IsEmail, MinLength} from 'class-validator';

export class User
{
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    contra: string;
};

//Datos editables desde "Mis datos". Solo nombre y email; la contraseña se
//cambia por un endpoint aparte porque requiere verificar la actual.
export class UpdateProfileDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @IsString()
    @MinLength(6)
    newPassword: string;
}