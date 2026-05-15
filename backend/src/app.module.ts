/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { AttendanceModule } from './attendance/attendance.module';
import { SeedModule } from './seed/seed.module';
import { NotificacionsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';
import { LogsModule } from './logs/logs.module';
import { ExportModule } from './export/export.module';

import { Usuari } from './entities/usuari.entity';
import { Grup } from './entities/grup.entity';
import { Assignatura } from './entities/assignatura.entity';
import { Matricula } from './entities/matricula.entity';
import { AssignacioDocent } from './entities/assignacio-docent.entity';
import { ConfiguracioCentre } from './entities/configuracio-centre.entity';
import { Horari } from './entities/horari.entity';
import { Sessio } from './entities/sessio.entity';
import { Assistencia } from './entities/assistencia.entity';
import { SortidaAula } from './entities/sortida-aula.entity';
import { Justificacio } from './entities/justificacio.entity';
import { LogAuditoria } from './entities/log-auditoria.entity';
import { SubscripcioPush } from './entities/subscripcio-push.entity';
import { Modul } from './entities/modul.entity';
import { Nota } from './entities/nota.entity';
import { AttendanceToken } from './entities/attendance-token.entity';
import { Dispositiu } from './entities/dispositiu.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: (configService.get<string>('DB_TYPE') as any) || 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          Usuari,
          Grup,
          Assignatura,
          Matricula,
          AssignacioDocent,
          ConfiguracioCentre,
          Horari,
          Sessio,
          Assistencia,
          SortidaAula,
          Justificacio,
          LogAuditoria,
          SubscripcioPush,
          Modul,
          Nota,
          Dispositiu,
          AttendanceToken,
        ],
        synchronize: true,
        retryAttempts: 10,
        retryDelay: 3000,
        autoLoadEntities: true,
      }),
    }),
    TypeOrmModule.forFeature([Usuari]),
    UsersModule,
    GroupsModule,
    AttendanceModule,
    SeedModule,
    NotificacionsModule,
    AuthModule,
    LogsModule,
    ExportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
