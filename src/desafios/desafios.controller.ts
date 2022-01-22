import { ValidacaoParametrosPipe } from 'src/commom/pipes/validacao-parametros.pipe';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { DesafioStatusValidacaoPipe } from './pipes/desafio-status-validation.pipe';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Controller, Post, UsePipes, ValidationPipe, Body, Get, Query, Put, Param, Delete } from '@nestjs/common';
import { DesafiosService } from './desafios.service';

@Controller('api/v1/desafios')
export class DesafiosController {
    constructor(private readonly desafioService: DesafiosService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async criarDesafio(
        @Body() criarDesafioDto: CriarDesafioDto
    ): Promise<Desafio> {
        return await this.desafioService.criarDesafio(criarDesafioDto);
    }

    @Get()
    async consultarDesafios(
        @Query('idJogador') _id: string
    ): Promise<Array<Desafio>> {
        return (_id) ? await this.desafioService.consultarDesafiosDeUmJogador(_id) : await this.desafioService.consultarTodosDesafios();
    }

    @Put('/:desafio')
    @UsePipes(ValidationPipe)
    async atualizarCategoria(
        @Body(DesafioStatusValidacaoPipe) atualizarDesafioDto: AtualizarDesafioDto,
        @Param('desafio') _id: string
    ): Promise<void> {
        await this.desafioService.atualizarDesafio(_id, atualizarDesafioDto);
    }

    @Post('/:desafio/partida')
    async atribuirDesafioPartida(
        @Body(ValidationPipe) atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
        @Param('desafio') _id: string
    ): Promise<void> {
        return await this.desafioService.atribuirDesafioPartida(_id, atribuirDesafioPartidaDto);
    }

    @Delete('/:_id')
    async deletarDesafio(
        @Param('_id', ValidacaoParametrosPipe) _id: string
    ): Promise<void> {
        this.desafioService.deletarDesafio(_id);
    }
}
