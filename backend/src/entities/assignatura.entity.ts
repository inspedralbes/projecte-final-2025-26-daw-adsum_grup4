import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Matricula } from './matricula.entity';
import { AssignacioDocent } from './assignacio-docent.entity';

@Entity('assignatures')
export class Assignatura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  codi: string;

  @Column({ length: 100 })
  nom: string;

  @Column({ type: 'text', nullable: true })
  descripcio: string;

  @Column({ name: 'color_identificatiu', length: 7, default: '#3b82f6' })
  colorIdentificatiu: string;

  @Column({ length: 10, default: '1r' })
  curs: string;

  @Column({ name: 'hores_setmanals', default: 3 })
  horesSetmanals: number;

  @OneToMany(() => Matricula, (matricula) => matricula.assignatura)
  matricules: Matricula[];

  @OneToMany(() => AssignacioDocent, (assignacio) => assignacio.assignatura)
  assignacions: AssignacioDocent[];
}
