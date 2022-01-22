import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { Desafio, Partida } from './interfaces/desafio.interface';
import { DesafioStatus } from './desafio-status.enum';

@Injectable()
export class DesafiosService {

    constructor(
        @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
        @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
        private readonly jogadoresService: JogadoresService,
        private readonly categoriasService: CategoriasService,
    ) { };

    async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<any> {

        const jogadores = await this.jogadoresService.consultarTodosJogadores();

        criarDesafioDto.jogadores.map(jogadorDto => {
            const jogadorEncontrado = jogadores.filter(jogador => jogador._id == jogadorDto._id);

            if (!jogadorEncontrado.length)
                throw new NotFoundException(`Jogador com id ${jogadorDto._id} não encontrado`);
        });

        const solicitanteEncontrado = jogadores.filter(jogador => jogador._id == criarDesafioDto.solicitante);

        if (!solicitanteEncontrado.length)
            throw new NotFoundException(`Solicitante com id ${criarDesafioDto.solicitante} não encontrado`);

        const solicitanteNaListaDeJogadores = criarDesafioDto.jogadores.filter(jogador => jogador._id == criarDesafioDto.solicitante);
        if (!solicitanteNaListaDeJogadores.length)
            throw new BadRequestException(`Solicitante ${criarDesafioDto.solicitante} não está na lista de jogadores`);

        const categoriaDoJogador = await this.categoriasService.consultarCategoriaPeloJogador(criarDesafioDto.solicitante);
        if (!categoriaDoJogador)
            throw new BadRequestException(`Solicitante ${criarDesafioDto.solicitante} não está inscrito em uma categoria`);

        const desafioCriado = new this.desafioModel(criarDesafioDto);
        desafioCriado.categoria = categoriaDoJogador.categoria;
        desafioCriado.dataHoraSolicitacao = new Date();
        desafioCriado.status = DesafioStatus.PENDENTE;

        return await desafioCriado.save();
    }

    async consultarTodosDesafios(): Promise<Array<Desafio>> {
        return await this.desafioModel.find()
            .populate('jogadores')
            .populate('solicitante')
            .populate('partida')
            .exec();
    }

    async consultarDesafiosDeUmJogador(_id: any): Promise<Array<Desafio>> {

        const jogadores = await this.jogadoresService.consultarTodosJogadores();

        const jogadorEncontrado = jogadores.filter(jogador => jogador._id == _id);

        if (!jogadorEncontrado.length)
            throw new NotFoundException(`Jogador com id ${_id} não encontrado`);

        return await this.desafioModel.find()
            .where('jogadores')
            .in(_id)
            .populate('jogadores')
            .populate('solicitante')
            .populate('partida')
            .exec();
    }

    async atualizarDesafio(_id: string, atualizarDesafioDto: AtualizarDesafioDto): Promise<void> {
        const desafioEncontrado = await this.desafioModel.findById(_id).exec();

        if (!desafioEncontrado)
            throw new BadRequestException(`Desafio com _id: ${_id} não encontrado`);

        if (atualizarDesafioDto.status)
            desafioEncontrado.dataHoraResposta = new Date();


        desafioEncontrado.status = atualizarDesafioDto.status;
        desafioEncontrado.dataHoraDesafio = atualizarDesafioDto.dataHoraDesafio;

        this.desafioModel.findOneAndUpdate({ _id }, { $set: atualizarDesafioDto }).exec();
    }

    async atribuirDesafioPartida(_id: string, atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto): Promise<void> {
        const desafioEncontrado = await this.desafioModel.findById(_id).exec();

        if (!desafioEncontrado)
            throw new BadRequestException(`Desafio com _id: ${_id} não encontrado`);

        const jogadorFilter = desafioEncontrado.jogadores.filter(jogador => jogador._id == atribuirDesafioPartidaDto.def);

        if (!jogadorFilter)
            throw new BadRequestException(`O jogador vencedor não faz parte do desafio`);

        const partidaCriada = new this.partidaModel(atribuirDesafioPartidaDto);

        partidaCriada.categoria = desafioEncontrado.categoria;

        partidaCriada.jogadores = desafioEncontrado.jogadores;

        const resultado = await partidaCriada.save();

        desafioEncontrado.status = DesafioStatus.REALIZADO;

        desafioEncontrado.partida = resultado._id;

        try {
            await this.desafioModel.findOneAndUpdate({ _id }, { $set: desafioEncontrado }).exec();
        } catch (error) {
            await this.partidaModel.deleteOne({ _id: resultado._id }).exec();
            throw new InternalServerErrorException()
        }

    }

    async deletarDesafio(_id: string): Promise<void> {
        const desafioEncontrado = await this.desafioModel.findById(_id).exec();

        if (!desafioEncontrado)
            throw new BadRequestException(`Desafio com _id: ${_id} não encontrado`);

        desafioEncontrado.status = DesafioStatus.CANCELADO;

        await this.desafioModel.findOneAndUpdate({ _id }, { $set: desafioEncontrado }).exec();
    }

}
