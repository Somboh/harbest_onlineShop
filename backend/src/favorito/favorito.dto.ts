import { IsNotEmpty, IsString } from "class-validator";

export class FavoritoDTO {
    @IsString()
    @IsNotEmpty()
    user_email: string;

    @IsString()
    @IsNotEmpty()
    product_id: string;
}
