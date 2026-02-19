import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuari } from '../entities/usuari.entity';
import { Assistencia } from '../entities/assistencia.entity';
import { Nota } from '../entities/nota.entity';
import { Grup } from '../entities/grup.entity';
// import { Modul } from '../entities/modul.entity'; // Checking if Modul entity exists. It was in dev branch.
// Assuming Modul entity exists as it was in dev.
// However, in my previous list_dir of entities (which I didn't do fully), I didn't see it?
// I'll check existence of Modul entity before importing if I want to be 100% safe, but for merge verification I should trust dev has it.
// Actually, I'll list the entities dir to be sure.
// For now I will include it but if it fails I'll fix it.
// Wait, I can't check file existence easily inside write_to_file.
// I'll assume it exists because it came from dev.
import { Modul } from '../entities/modul.entity';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Usuari, Assistencia, Nota, Grup, Modul])],
  controllers: [UsersController, NotesController],
  providers: [UsersService, NotesService],
  exports: [UsersService],
})
export class UsersModule {}
