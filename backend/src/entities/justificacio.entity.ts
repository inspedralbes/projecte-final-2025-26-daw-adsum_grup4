import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Usuari } from './usuari.entity';

export enum JustificacioEstat {
  PENDENT = 'pendent',
  VALIDADA = 'validada',
  REBUTJADA = 'rebutjada',
}

@Entity('justificacions')
export class Justificacio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'alumne_id' })
  alumneId: number;

  @ManyToOne(() => Usuari, (usuari) => usuari.justificacions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'alumne_id' })
  alumne: Usuari;

  @Column({ name: 'data_inici', type: 'date' })
  dataInici: string;

  @Column({ name: 'data_fi', type: 'date' })
  dataFi: string;

  @Column({ type: 'text' })
  motiu: string;

  @Column({ name: 'arxiu_url', nullable: true })
  arxiuUrl: string;

  @Column({
    enum: JustificacioEstat,
    default: JustificacioEstat.PENDENT,
  })
  estat: JustificacioEstat;

  @Column({ name: 'observacions_professor', type: 'text', nullable: true })
  observacionsProfessor: string;

  @CreateDateColumn({ name: 'data_solicitud' })
  dataSolicitud: Date;
}
