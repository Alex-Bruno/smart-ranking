import { Jogador } from './interfaces/jogador.interface';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as uuid from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) { };

    async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
        const { email } = criarJogadorDto;

        //const jogadorEncontrado = this.jogadores.find(jogador => jogador.email === email);

        const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

        (jogadorEncontrado) ? this.atualizar(criarJogadorDto) : this.criar(criarJogadorDto);
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return await this.jogadorModel.find().exec();
    }

    async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {
        const jogadorEncontrado = this.jogadorModel.findOne({email}).exec();

        if (!jogadorEncontrado)
            throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`);

        return jogadorEncontrado;

    }

    async deletarJogador(email): Promise<any> {
        return await this.jogadorModel.deleteOne({email}).exec();
        /*
            const jogadorEncontrado = this.jogadores.find(jogador => jogador.email === email);

            if (!jogadorEncontrado)
                throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`);

            this.jogadores = this.jogadores.filter(jogador => jogador.email !== email);
        */
    }

    private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        const jogadorCriado = new this.jogadorModel(criarJogadorDto);

        return await jogadorCriado.save();

        /*
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
        */
    }

    private async atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        return await this.jogadorModel.findOneAndUpdate(
            { email: criarJogadorDto.email }, { $set: criarJogadorDto }
        ).exec();
        /*
            const { nome } = criarJogadorDto;

            jogador.nome = nome;

            this.logger.log(`atualizarJogadorDto: ${JSON.stringify(jogador)}`);
        */
    }
}
