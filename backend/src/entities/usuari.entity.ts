import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Grup } from './grup.entity';
import { Dispositiu } from './dispositiu.entity';
import { Modul } from './modul.entity';
import { Assistencia } from './assistencia.entity';

export enum UserRole {
  ALUMNE = 'alumne',
  PROFESSOR = 'professor',
}

@Entity('usuaris')
export class Usuari {
  @PrimaryGeneratedColumn()
  id_usuari: number;

  @Column()
  nom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ALUMNE,
  })
  rol: UserRole;

  @ManyToOne(() => Grup, (grup) => grup.usuaris)
  @JoinColumn({ name: 'grup_id' })
  grup: Grup;

  @Column({ nullable: true })
  grup_id: number;

  @OneToMany(() => Dispositiu, (dispositiu) => dispositiu.usuari)
  dispositius: Dispositiu[];

  @OneToMany(() => Modul, (modul) => modul.professor)
  moduls_impartits: Modul[];

  @OneToMany(() => Assistencia, (assistencia) => assistencia.alumne)
  assistencies: Assistencia[];
}
