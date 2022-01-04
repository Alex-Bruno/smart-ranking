import { JogadoresService } from './jogadores.service';
import { Body, Controller, Post } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {

    constructor (private readonly jogadoresService: JogadoresService) {}

    @Post()
    async criarAtualizarAction(
        @Body() criarJogadorDto: CriarJogadorDto
    ) {
        await this.jogadoresService.criarAtualizarJogador(criarJogadorDto);
    }
}
