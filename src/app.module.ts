import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://root:A5m9RDBYVVDfKtV@cluster0.y1eby.mongodb.net/smartranking?retryWrites=true&w=majority',
      { useNewUrlParser: true, useUnifiedTopology: true }
    ),
    JogadoresModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
