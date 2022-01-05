import { Jogador } from './interfaces/jogador.interface';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as uuid from 'uuid';

@Injectable()
export class JogadoresService {

    private jogadores: Jogador[] = [];

    private readonly logger = new Logger(JogadoresService.name);

    async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
        const { email } = criarJogadorDto;

        const jogadorEncontrado = this.jogadores.find(jogador => jogador.email === email);

        (jogadorEncontrado) ? this.atualizar(jogadorEncontrado, criarJogadorDto) : this.criar(criarJogadorDto);
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return await this.jogadores;
    }

    async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {
        const jogadorEncontrado = this.jogadores.find(jogador => jogador.email === email);

        if (!jogadorEncontrado)
            throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`);

        return jogadorEncontrado;

    }

    async deletarJogador(email): Promise<void> {

        const jogadorEncontrado = this.jogadores.find(jogador => jogador.email === email);

        if (!jogadorEncontrado)
            throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`);

        this.jogadores = this.jogadores.filter(jogador => jogador.email !== email);
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

    private atualizar(jogador: Jogador, criarJogadorDto: CriarJogadorDto): void {
        const { nome } = criarJogadorDto;

        jogador.nome = nome;

        this.logger.log(`atualizarJogadorDto: ${JSON.stringify(jogador)}`);
    }
}
