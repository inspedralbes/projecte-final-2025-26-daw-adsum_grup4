import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuari } from '../entities/usuari.entity';
import { Assistencia } from '../entities/assistencia.entity';
import { Nota } from '../entities/nota.entity';
import { Grup } from '../entities/grup.entity';
import { Modul } from '../entities/modul.entity';
import { Dispositiu } from '../entities/dispositiu.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuari,
      Assistencia,
      Nota,
      Grup,
      Modul,
      Dispositiu,
    ]),
  ],
  controllers: [UsersController, NotesController],
  providers: [UsersService, NotesService],
  exports: [UsersService],
})
export class UsersModule { }
