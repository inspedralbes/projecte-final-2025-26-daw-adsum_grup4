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
import { ChatModule } from './chat/chat.module';
import { AiModule } from './ai/ai.module';
import { Missatge } from './entities/missatge.entity';
import { Recurs } from './entities/recurs.entity';
import { ResourcesModule } from './resources/resources.module';
import { JustificationsModule } from './justifications/justifications.module';
import { BookingModule } from './booking/booking.module';
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
import { Espai } from './entities/espai.entity';
import { Reserva } from './entities/reserva.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
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
          Missatge,
          Recurs,
          Espai,
          Reserva,
        ],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
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
    ChatModule,
    AiModule,
    ResourcesModule,
    JustificationsModule,
    BookingModule,
    ExportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
