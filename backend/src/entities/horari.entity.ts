import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AssignacioDocent } from './assignacio-docent.entity';

export enum DiaSetmana {
  DILLUNS = 'dilluns',
  DIMARTS = 'dimarts',
  DIMECRES = 'dimecres',
  DIJOUS = 'dijous',
  DIVENDRES = 'divendres',
}

@Entity('horaris')
export class Horari {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'assignacio_docent_id' })
  assignacioDocentId: number;

  @ManyToOne(() => AssignacioDocent, (assignacio) => assignacio.horaris, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assignacio_docent_id' })
  assignacioDocent: AssignacioDocent;

  @Column({ enum: DiaSetmana })
  diaSetmana: DiaSetmana;

  @Column({ name: 'hora_inici', type: 'time' })
  horaInici: string;

  @Column({ name: 'hora_fi', type: 'time' })
  horaFi: string;

  @Column({ length: 20 })
  aula: string;
}
