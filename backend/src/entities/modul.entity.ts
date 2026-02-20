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
  @JoinColumn({ name: 'id_usuari' })
  professor: Usuari;

  @Column({ name: 'id_usuari' })
  id_usuari: number;

  @ManyToOne(() => Grup, (grup) => grup.moduls)
  @JoinColumn({ name: 'id_grup' })
  grup: Grup;

  @Column({ name: 'id_grup' })
  id_grup: number;

  @OneToMany(() => Assistencia, (assistencia) => assistencia.modul)
  assistencies: Assistencia[];

  @OneToMany(() => Nota, (nota) => nota.modul)
  notes: Nota[];
}
