import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuari } from './usuari.entity';
import { Modul } from './modul.entity';

@Entity('grups')
export class Grup {
  @PrimaryGeneratedColumn()
  id_grup: number;

  @Column()
  nom: string;

  @Column()
  curs_academic: string;

  @OneToMany(() => Usuari, (usuari) => usuari.grup)
  usuaris: Usuari[];

  @OneToMany(() => Modul, (modul) => modul.grup)
  moduls: Modul[];
}
