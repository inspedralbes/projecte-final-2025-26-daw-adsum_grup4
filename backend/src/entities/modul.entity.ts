import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Usuari } from './usuari.entity';
import { Grup } from './grup.entity';
import { Assistencia } from './assistencia.entity';
import { Nota } from './nota.entity';

@Entity('moduls')
export class Modul {
  @PrimaryGeneratedColumn()
  id_modul: number;

  @Column()
  nom: string;

  @Column()
  codi: string;

  @ManyToOne(() => Usuari, (usuari) => usuari.moduls_impartits)
  @JoinColumn({ name: 'professor_id' })
  professor: Usuari;

  @Column({ name: 'professor_id' })
  professor_id: number;

  @ManyToOne(() => Grup, (grup) => grup.moduls)
  @JoinColumn({ name: 'grup_id' })
  grup: Grup;

  @Column({ name: 'grup_id' })
  grup_id: number;

  @OneToMany(() => Assistencia, (assistencia) => assistencia.modul)
  assistencies: Assistencia[];

  @OneToMany(() => Nota, (nota) => nota.modul)
  notes: Nota[];
}
