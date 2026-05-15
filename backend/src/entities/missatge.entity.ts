import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuari } from './usuari.entity';

@Entity('missatges')
export class Missatge {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ length: 50 })
  sala: string;

  @Column({ name: 'usuari_id' })
  usuariId: number;

  @ManyToOne(() => Usuari)
  @JoinColumn({ name: 'usuari_id' })
  usuari: Usuari;

  @CreateDateColumn({ name: 'data_enviament' })
  dataEnviament: Date;
}
