import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JustificationsService } from './justifications.service';
import { JustificationsController } from './justifications.controller';
import { Justificacio } from '../entities/justificacio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Justificacio])],
  controllers: [JustificationsController],
  providers: [JustificationsService],
  exports: [JustificationsService],
})
export class JustificationsModule {}
