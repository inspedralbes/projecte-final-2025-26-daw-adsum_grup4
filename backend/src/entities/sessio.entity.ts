import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { AssignacioDocent } from './assignacio-docent.entity';
import { Assistencia } from './assistencia.entity';
import { SortidaAula } from './sortida-aula.entity';

export enum SessioEstat {
  ACTIVA = 'activa',
  TANCADA = 'tancada',
}

@Entity('sessions')
export class Sessio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'assignacio_docent_id' })
  assignacioDocentId: number;

  @ManyToOne(() => AssignacioDocent, (assignacio) => assignacio.sessions)
  @JoinColumn({ name: 'assignacio_docent_id' })
  assignacioDocent: AssignacioDocent;

  @CreateDateColumn({ name: 'data_inici' })
  dataInici: Date;

  @Column({ name: 'data_fi', type: 'datetime', nullable: true })
  dataFi: Date;

  @Column({ name: 'pin_acces', length: 6, nullable: true })
  pinAcces: string;

  @Column({ name: 'bitacola_docent', type: 'text', nullable: true })
  bitacolaDocent: string;

  @Column({ type: 'enum', enum: SessioEstat, default: SessioEstat.ACTIVA })
  estat: SessioEstat;

  @Column({
    name: 'latitud_origen',
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  latitudOrigen: number;

  @Column({
    name: 'longitud_origen',
    type: 'decimal',
    precision: 11,
    scale: 8,
    nullable: true,
  })
  longitudOrigen: number;

  @OneToMany(() => Assistencia, (assistencia) => assistencia.sessio)
  assistencies: Assistencia[];

  @OneToMany(() => SortidaAula, (sortida) => sortida.sessio)
  sortidesAula: SortidaAula[];
}
