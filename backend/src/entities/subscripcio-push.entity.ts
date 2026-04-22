import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Usuari } from './usuari.entity';

@Entity('subscripcions_push')
export class SubscripcioPush {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuari_id' })
  usuariId: number;

  @ManyToOne(() => Usuari, (usuari) => usuari.subscripcionsPush, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuari_id' })
  usuari: Usuari;

  @Column({ name: 'token_subscripcio', type: 'text' })
  tokenSubscripcio: string;

  @Column({ name: 'agent_usuari', length: 255, nullable: true })
  agentUsuari: string;

  @CreateDateColumn({ name: 'data_creacio' })
  dataCreacio: Date;
}
