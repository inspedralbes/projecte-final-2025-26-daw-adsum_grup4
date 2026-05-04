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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'emissor_id' })
  emissorId: number;

  @ManyToOne(() => Usuari, (usuari) => usuari.missatgesEnviats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'emissor_id' })
  emissor: Usuari;

  @Column({ name: 'receptor_id' })
  receptorId: number;

  @ManyToOne(() => Usuari, (usuari) => usuari.missatgesRebuts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'receptor_id' })
  receptor: Usuari;

  @Column({ type: 'text' })
  contingut: string;

  @Column({ default: false })
  llegit: boolean;

  @CreateDateColumn({ name: 'data_enviament' })
  dataEnviament: Date;
}
