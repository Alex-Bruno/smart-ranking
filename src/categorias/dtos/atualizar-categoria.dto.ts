import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Evento } from "../interfaces/categoria.interface";

export class AtualizarCategoriaDto {

    @IsString()
    @IsOptional()
    readonly descricao: string;

    @IsArray()
    @ArrayMinSize(1)
    readonly eventos: Array<Evento>;
}