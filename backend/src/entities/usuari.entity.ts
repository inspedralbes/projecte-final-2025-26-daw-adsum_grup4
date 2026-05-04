import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Grup } from './grup.entity';
import { Matricula } from './matricula.entity';
import { AssignacioDocent } from './assignacio-docent.entity';
import { Assistencia } from './assistencia.entity';
import { SortidaAula } from './sortida-aula.entity';
import { Justificacio } from './justificacio.entity';
import { Missatge } from './missatge.entity';
import { LogAuditoria } from './log-auditoria.entity';
import { SubscripcioPush } from './subscripcio-push.entity';
import { Dispositiu } from './dispositiu.entity';
import type {
  GamificacioData,
  DadesFamiliars,
  ConfiguracioUsuari,
} from '../users/interfaces/dades-usuari.interface';
import { Nota } from './nota.entity';
import { Modul } from './modul.entity';

export enum UserRole {
  ADMIN = 'admin',
  PROFESSOR = 'professor',
  ALUMNE = 'alumne',
  FAMILIA = 'familia',
}

export enum NivellEducatiu {
  PRIMARIA = 'primaria',
  ESO = 'eso',
  BATXILLERAT = 'batxillerat',
  CICLES = 'cicles',
}

@Entity('usuaris')
export class Usuari {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ length: 50 })
  nom: string;

  @Column({ length: 100 })
  cognoms: string;

  @Column({ length: 100 })
  email: string;

  @Column({ name: 'contrasenya_hash' })
  contrasenyaHash: string;

  @Column({ name: 'dni_nie', length: 20, nullable: true })
  dniNie: string;

  @Column({ length: 15, nullable: true })
  telefon: string;

  @Column({ name: 'foto_url', nullable: true })
  fotoUrl: string;

  @OneToMany(() => Dispositiu, (dispositiu) => dispositiu.usuari)
  dispositius: Dispositiu[];

  @Column({ type: 'enum', enum: UserRole, default: UserRole.ALUMNE })
  rol: UserRole;

  @Column({ name: 'es_actiu', default: true })
  esActiu: boolean;

  @Column({ name: 'grup_id', nullable: true })
  grupId: number;

  @ManyToOne(() => Grup, (grup) => grup.alumnes, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'grup_id' })
  grup: Grup;

  @Column({
    name: 'nivell_educatiu',
    type: 'enum',
    enum: NivellEducatiu,
    nullable: true,
  })
  nivellEducatiu: NivellEducatiu;

  @Column({ length: 100, nullable: true })
  departament: string;

  @Column({ name: 'nfc_uid', length: 50, nullable: true })
  nfcUid: string;

  @Column({ name: 'token_qr_secret', length: 100, nullable: true })
  tokenQrSecret: string;

  @Column({ name: 'dades_familiares', type: 'json', nullable: true })
  dadesFamiliares: DadesFamiliars;

  @Column({ name: 'configuracio_usuari', type: 'json', nullable: true })
  configuracioUsuari: ConfiguracioUsuari;

  @Column({
    name: 'gamificacio_data',
    type: 'json',
    nullable: true,
    default: () =>
      "(JSON_OBJECT('ratxa_actual', 0, 'punts', 0, 'insignies', JSON_ARRAY()))",
  })
  gamificacioData: GamificacioData;

  @CreateDateColumn({ name: 'data_creacio' })
  dataCreacio: Date;

  @Column({ name: 'ultim_acces', type: 'timestamp', nullable: true })
  ultimAcces: Date;

  @OneToMany(() => Matricula, (matricula) => matricula.alumne)
  matricules: Matricula[];

  @OneToMany(() => AssignacioDocent, (assignacio) => assignacio.professor)
  assignacionsDocents: AssignacioDocent[];

  @OneToMany(() => Assistencia, (assistencia) => assistencia.alumne)
  assistencies: Assistencia[];

  @OneToMany(() => SortidaAula, (sortida) => sortida.alumne)
  sortidesAula: SortidaAula[];

  @OneToMany(() => Justificacio, (justificacio) => justificacio.alumne)
  justificacions: Justificacio[];

  @OneToMany(() => LogAuditoria, (log) => log.autor)
  logsAutor: LogAuditoria[];

  @Column({ name: 'token_recuperacio', length: 255, nullable: true })
  tokenRecuperacio: string;

  @Column({
    name: 'caducitat_token_recuperacio',
    type: 'datetime',
    nullable: true,
  })
  caducitatTokenRecuperacio: Date;

  @OneToMany(() => SubscripcioPush, (subscripcio) => subscripcio.usuari)
  subscripcionsPush: SubscripcioPush[];

  @ManyToMany(() => Usuari, (usuari) => usuari.fills)
  @JoinTable({
    name: 'relacio_familia_alumnes',
    joinColumn: { name: 'alumne_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tutor_id', referencedColumnName: 'id' },
  })
  tutors: Usuari[];

  @ManyToMany(() => Usuari, (usuari) => usuari.tutors)
  fills: Usuari[];

  @OneToMany(() => Nota, (nota) => nota.alumne)
  notes: Nota[];

  @OneToMany(() => Modul, (modul) => modul.professor)
  moduls_impartits: Modul[];

  @OneToMany(() => Missatge, (missatge) => missatge.emissor)
  missatgesEnviats: Missatge[];

  @OneToMany(() => Missatge, (missatge) => missatge.receptor)
  missatgesRebuts: Missatge[];
}
