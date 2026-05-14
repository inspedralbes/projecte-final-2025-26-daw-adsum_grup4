import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assistencia } from '../entities/assistencia.entity';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Assistencia])],
  controllers: [ExportController],
  providers: [ExportService],
})
export class ExportModule {}
