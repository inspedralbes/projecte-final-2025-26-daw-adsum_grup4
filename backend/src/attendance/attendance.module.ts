import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assistencia } from '../entities/assistencia.entity';
import { Sessio } from '../entities/sessio.entity';
import { Usuari } from '../entities/usuari.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceGateway } from './attendance.gateway';
import { AttendanceController } from './attendance.controller';
import { AttendanceToken } from '../entities/attendance-token.entity';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assistencia, Sessio, Usuari, AttendanceToken]),
    LogsModule,
  ],

  controllers: [AttendanceController],
  providers: [AttendanceService, AttendanceGateway],
  exports: [AttendanceService],
})
export class AttendanceModule {}
