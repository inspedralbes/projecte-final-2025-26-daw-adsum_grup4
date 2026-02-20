import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Sessio } from './sessio.entity';
import { Usuari } from './usuari.entity';
import { Assignatura } from './assignatura.entity';
import { Modul } from './modul.entity';

export enum AssistenciaEstat {
  PRESENT = 'present',
  RETARD = 'retard',
  ABSENT = 'absent',
  JUSTIFICAT = 'justificat',
}

export enum MetodeValidacio {
  PIN_MANUAL = 'pin_manual',
  QR_MOBIL = 'qr_mobil',
  TARGETA_NFC = 'targeta_nfc',
  PROFESSOR_MANUAL = 'professor_manual',
}

@Entity('assistencies')
@Unique(['sessio', 'alumne'])
export class Assistencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sessio_id', nullable: true })
  sessioId: number;

  @ManyToOne(() => Sessio, (sessio) => sessio.assistencies, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'sessio_id' })
  sessio: Sessio;

  @Column({ name: 'alumne_id' })
  alumneId: number;

  @ManyToOne(() => Usuari, (usuari) => usuari.assistencies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'alumne_id' })
  alumne: Usuari;

  @Column({ name: 'modul_id', nullable: true })
  modulId: number;

  @ManyToOne(() => Modul, (modul) => modul.assistencies, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'modul_id' })
  modul: Modul;

  @CreateDateColumn({ name: 'data_registre' })
  dataRegistre: Date;

  @Column({
    type: 'enum',
    enum: AssistenciaEstat,
    default: AssistenciaEstat.PRESENT,
  })
  estat: AssistenciaEstat;

  @Column({
    name: 'metode_validacio',
    type: 'enum',
    enum: MetodeValidacio,
  })
  metodeValidacio: MetodeValidacio;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitud: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitud: number;

  @Column({ name: 'dispositiu_hash', length: 64, nullable: true })
  dispositiuHash: string;

  @Column({ name: 'es_fraudulent', default: false })
  esFraudulent: boolean;
}
