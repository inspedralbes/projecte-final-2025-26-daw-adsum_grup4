import { Entity, PrimaryColumn, Column, Check } from 'typeorm';

@Entity('configuracio_centre')
@Check('check_unica_fila', '"id" = 1')
export class ConfiguracioCentre {
  @PrimaryColumn({ default: 1 })
  id: number;

  @Column({ name: 'minuts_tall_retard', default: 10 })
  minutsTallRetard: number;

  @Column({ name: 'minuts_tall_absencia', default: 30 })
  minutsTallAbsencia: number;

  @Column({
    name: 'curs_actual',
    length: 20,
    default: '2025-2026',
    nullable: true,
  })
  cursActual: string;
}
