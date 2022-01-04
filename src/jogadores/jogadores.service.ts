import { Jogador } from './interfaces/jogador.interface';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Injectable, Logger } from '@nestjs/common';
import * as uuid from 'uuid';

@Injectable()
export class JogadoresService {

    private jogadores: Jogador[] = [];

    private readonly logger = new Logger(JogadoresService.name);

    async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
        this.criar(criarJogadorDto);
    }

    private criar(criarJogadorDto: CriarJogadorDto): void {
        const { nome, email, telefoneCelular } = criarJogadorDto;

        const jogador: Jogador = {
            _id: uuid.v1(),
            nome,
            telefoneCelular,
            email,
            ranking: 'A',
            posicaoRanking: 1,
            urlFotoJogador: 'http://google.com'
        }

        this.logger.log(`criaJogadorDto: ${JSON.stringify(jogador)}`);

        this.jogadores.push(jogador);
    }
}
