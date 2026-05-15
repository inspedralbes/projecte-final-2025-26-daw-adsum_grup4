import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { Usuari } from '../entities/usuari.entity';
import { Grup } from '../entities/grup.entity';
import { Assignatura } from '../entities/assignatura.entity';
import { Matricula } from '../entities/matricula.entity';
import { AssignacioDocent } from '../entities/assignacio-docent.entity';
import { ConfiguracioCentre } from '../entities/configuracio-centre.entity';
import { Sessio } from '../entities/sessio.entity';
import { Modul } from '../entities/modul.entity';
import { Assistencia } from '../entities/assistencia.entity';
import { Nota } from '../entities/nota.entity';
import { Missatge } from '../entities/missatge.entity';
import { Recurs } from '../entities/recurs.entity';
import { Justificacio } from '../entities/justificacio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuari,
      Grup,
      Assignatura,
      Matricula,
      AssignacioDocent,
      ConfiguracioCentre,
      Sessio,
      Modul,
      Assistencia,
      Nota,
      Missatge,
      Recurs,
      Justificacio,
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
