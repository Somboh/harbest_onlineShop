import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export const ESTADOS_PEDIDO = [
    "pendiente",
    "preparando",
    "enviado",
    "entregado",
    "cancelado",
] as const;
export type EstadoPedido = typeof ESTADOS_PEDIDO[number];

export class PedidoLineaDTO {
    @IsString()
    @IsNotEmpty()
    product_id: string;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    cantidad: number;
}

export class CreatePedidoDTO {
    @IsString()
    @IsNotEmpty()
    user_email: string;

    @IsString()
    @IsNotEmpty()
    farmer_email: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => PedidoLineaDTO)
    lineas: PedidoLineaDTO[];

    @IsOptional()
    @IsString()
    direccion_envio?: string;
}

export class UpdateEstadoPedidoDTO {
    @IsString()
    @IsNotEmpty()
    @IsIn(ESTADOS_PEDIDO as unknown as string[])
    estado: EstadoPedido;
}
