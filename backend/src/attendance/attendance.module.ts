import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assistencia } from '../entities/assistencia.entity';
import { Sessio } from '../entities/sessio.entity';
import { Usuari } from '../entities/usuari.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceGateway } from './attendance.gateway';
import { AttendanceController } from './attendance.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Assistencia, Sessio, Usuari])],

    controllers: [AttendanceController],
    providers: [AttendanceService, AttendanceGateway],
    exports: [AttendanceService],
})
export class AttendanceModule { }
