import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Modul } from './modul.entity';
import { Usuari } from './usuari.entity';

@Entity('recursos')
export class Recurs {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ length: 100 })
  titol: string;

  @Column({ name: 'nom_fitxer', length: 255 })
  nomFitxer: string;

  @Column({ length: 20 })
  mida: string;

  @Column({ length: 10, default: 'file' })
  icona: string;

  @Column({ length: 100, default: 'bg-blue-500' })
  color: string;

  @Column({ name: 'modul_id', nullable: true })
  modulId: number;

  @ManyToOne(() => Modul)
  @JoinColumn({ name: 'modul_id' })
  modul: Modul;

  @Column({ name: 'autor_id', nullable: true })
  autorId: number;

  @ManyToOne(() => Usuari)
  @JoinColumn({ name: 'autor_id' })
  autor: Usuari;

  @CreateDateColumn({ name: 'data_pujada' })
  dataPujada: Date;
}
