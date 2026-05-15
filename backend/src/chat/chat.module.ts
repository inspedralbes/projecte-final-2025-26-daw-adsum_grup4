import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { Missatge } from '../entities/missatge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Missatge])],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
