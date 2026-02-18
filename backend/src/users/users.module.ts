import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuari } from '../entities/usuari.entity';
import { Dispositiu } from '../entities/dispositiu.entity';
import { Assistencia } from '../entities/assistencia.entity';
import { Nota } from '../entities/nota.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Usuari, Dispositiu, Assistencia, Nota])],
  controllers: [UsersController, NotesController],
  providers: [UsersService, NotesService],
})
export class UsersModule { }
