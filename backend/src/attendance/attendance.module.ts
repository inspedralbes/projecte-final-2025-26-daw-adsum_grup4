import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modul } from '../entities/modul.entity';
import { Assistencia } from '../entities/assistencia.entity';
import { AttendanceToken } from '../entities/attendance-token.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceGateway } from './attendance.gateway';
import { AttendanceController } from './attendance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Modul, Assistencia, AttendanceToken])],
  controllers: [AttendanceController],
  providers: [AttendanceService, AttendanceGateway],
  exports: [AttendanceService],
})
export class AttendanceModule {}
