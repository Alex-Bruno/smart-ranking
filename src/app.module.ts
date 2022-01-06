import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://root:A5m9RDBYVVDfKtV@cluster0.y1eby.mongodb.net/smartranking?retryWrites=true&w=majority',
      { useNewUrlParser: true, useUnifiedTopology: true }
    ),
    JogadoresModule,
    CategoriasModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
