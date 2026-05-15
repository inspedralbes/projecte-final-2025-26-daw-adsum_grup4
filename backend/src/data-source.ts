/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DataSource } from 'typeorm';
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

export const AppDataSource = new DataSource({
  type: (process.env.DB_TYPE as any) || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'projecte_final',
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
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});

export default AppDataSource;
