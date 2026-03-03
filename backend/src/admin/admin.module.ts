import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Usuari } from '../entities/usuari.entity';
import { Assistencia } from '../entities/assistencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuari, Assistencia])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
