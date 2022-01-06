import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from "class-validator";
import { Evento } from "../interfaces/categoria.interface";

export class CriarCategoriaDto {

    @IsString()
    @IsNotEmpty()
    readonly categoria: string;

    @IsString()
    @IsNotEmpty()
    readonly descricao: string;

    @IsArray()
    @ArrayMinSize(1)
    readonly eventos: Array<Evento>;
}