import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuari } from './usuari.entity';
import { Modul } from './modul.entity';

export enum AssistenciaEstat {
  PRESENT = 'present',
  ABSENT = 'absent',
  RETARD = 'retard',
  JUSTIFICAT = 'justificat',
}

@Entity('assistencies')
export class Assistencia {
  @PrimaryGeneratedColumn()
  id_assistencia: number;

  @ManyToOne(() => Usuari, (usuari) => usuari.assistencies)
  @JoinColumn({ name: 'alumne_id' })
  alumne: Usuari;

  @Column()
  alumne_id: number;

  @ManyToOne(() => Modul, (modul) => modul.assistencies)
  @JoinColumn({ name: 'modul_id' })
  modul: Modul;

  @Column()
  modul_id: number;

  @Column({ type: 'date' })
  data: string;

  @Column({ type: 'time' })
  hora: string;

  @Column({
    type: 'enum',
    enum: AssistenciaEstat,
    default: AssistenciaEstat.PRESENT,
  })
  estat: AssistenciaEstat;
}
