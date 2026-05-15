import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reserva } from './reserva.entity';

@Entity('espais')
export class Espai {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  tipus: string; // aula, lab, material

  @Column()
  capacitat: number;

  @Column({ nullable: true })
  equipament: string;

  @Column({ default: true })
  disponible: boolean;

  @OneToMany(() => Reserva, (reserva) => reserva.espai)
  reserves: Reserva[];
}
