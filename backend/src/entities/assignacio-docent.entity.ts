import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Usuari } from './usuari.entity';
import { Assignatura } from './assignatura.entity';
import { Grup } from './grup.entity';
import { Horari } from './horari.entity';
import { Sessio } from './sessio.entity';

@Entity('assignacions_docents')
@Unique(['assignatura', 'grup', 'anyAcademic'])
export class AssignacioDocent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'professor_id' })
  professorId: number;

  @ManyToOne(() => Usuari, (usuari) => usuari.assignacionsDocents)
  @JoinColumn({ name: 'professor_id' })
  professor: Usuari;

  @Column({ name: 'assignatura_id' })
  assignaturaId: number;

  @ManyToOne(() => Assignatura, (assignatura) => assignatura.assignacions)
  @JoinColumn({ name: 'assignatura_id' })
  assignatura: Assignatura;

  @Column({ name: 'grup_id' })
  grupId: number;

  @ManyToOne(() => Grup, (grup) => grup.assignacions)
  @JoinColumn({ name: 'grup_id' })
  grup: Grup;

  @Column({ name: 'any_academic', length: 9, default: '2025-2026' })
  anyAcademic: string;

  @OneToMany(() => Horari, (horari) => horari.assignacioDocent)
  horaris: Horari[];

  @OneToMany(() => Sessio, (sessio) => sessio.assignacioDocent)
  sessions: Sessio[];
}
