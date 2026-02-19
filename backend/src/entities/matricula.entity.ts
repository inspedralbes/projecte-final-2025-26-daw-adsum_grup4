import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Usuari } from './usuari.entity';
import { Assignatura } from './assignatura.entity';

export enum MatriculaEstat {
  MATRICULAT = 'matriculat',
  CONVALIDAT = 'convalidat',
  BAIXA = 'baixa',
}

@Entity('matricules')
@Unique(['alumne', 'assignatura', 'anyAcademic'])
export class Matricula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'alumne_id' })
  alumneId: number;

  @ManyToOne(() => Usuari, (usuari) => usuari.matricules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'alumne_id' })
  alumne: Usuari;

  @Column({ name: 'assignatura_id' })
  assignaturaId: number;

  @ManyToOne(() => Assignatura, (assignatura) => assignatura.matricules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assignatura_id' })
  assignatura: Assignatura;

  @Column({ name: 'any_academic', length: 9, default: '2025-2026' })
  anyAcademic: string;

  @Column({
    type: 'enum',
    enum: MatriculaEstat,
    default: MatriculaEstat.MATRICULAT,
  })
  estat: MatriculaEstat;
}
