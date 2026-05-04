import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissatgeriaController } from './missatgeria.controller';
import { MissatgeriaService } from './missatgeria.service';
import { Missatge } from '../entities/missatge.entity';
import { Usuari } from '../entities/usuari.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Missatge, Usuari])],
  controllers: [MissatgeriaController],
  providers: [MissatgeriaService],
  exports: [MissatgeriaService],
})
export class MissatgeriaModule {}
