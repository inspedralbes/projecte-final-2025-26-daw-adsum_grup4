import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Sessio } from './sessio.entity';
import { Usuari } from './usuari.entity';

export enum MotiuSortida {
  BANY = 'bany',
  SECRETARIA = 'secretaria',
  INFERMERIA = 'infermeria',
  ALTRES = 'altres',
}

@Entity('sortides_aula')
export class SortidaAula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sessio_id' })
  sessioId: number;

  @ManyToOne(() => Sessio, (sessio) => sessio.sortidesAula)
  @JoinColumn({ name: 'sessio_id' })
  sessio: Sessio;

  @Column({ name: 'alumne_id' })
  alumneId: number;

  @ManyToOne(() => Usuari, (usuari) => usuari.sortidesAula)
  @JoinColumn({ name: 'alumne_id' })
  alumne: Usuari;

  @CreateDateColumn({ name: 'hora_sortida' })
  horaSortida: Date;

  @Column({ name: 'hora_tornada', type: 'datetime', nullable: true })
  horaTornada: Date;

  @Column({
    name: 'durada_minuts',
    type: 'int',
    generatedType: 'VIRTUAL',
    asExpression: 'TIMESTAMPDIFF(MINUTE, hora_sortida, hora_tornada)',
    nullable: true,
    insert: false,
    update: false,
  })
  duradaMinuts: number;
}
