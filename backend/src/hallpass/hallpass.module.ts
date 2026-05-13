import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HallpassService } from './hallpass.service';
import { HallpassController } from './hallpass.controller';
import { SortidaAula } from '../entities/sortida-aula.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SortidaAula])],
  providers: [HallpassService],
  controllers: [HallpassController],
})
export class HallpassModule {}