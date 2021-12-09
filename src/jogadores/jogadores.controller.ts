import { Controller, Post } from '@nestjs/common';

@Controller('api/v1/jogadores')
export class JogadoresController {

    @Post()
    async criarAtualizarAction() {
        return JSON.stringify({
            'nome': 'Hello World'
        });
    }
}
