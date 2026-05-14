import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Espai } from './espai.entity';
import { Usuari } from './usuari.entity';

@Entity('reserves')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'espai_id' })
  espaiId: number;

  @ManyToOne(() => Espai, (espai) => espai.reserves)
  @JoinColumn({ name: 'espai_id' })
  espai: Espai;

  @Column({ name: 'usuari_id' })
  usuariId: number;

  @ManyToOne(() => Usuari)
  @JoinColumn({ name: 'usuari_id' })
  usuari: Usuari;

  @Column({ type: 'date' })
  data: string;

  @Column()
  franja: string; // "08:00 - 09:00", etc.

  @CreateDateColumn({ name: 'data_creacio' })
  dataCreacio: Date;
}
