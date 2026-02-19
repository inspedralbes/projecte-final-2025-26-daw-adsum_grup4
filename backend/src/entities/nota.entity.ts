import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuari } from './usuari.entity';
import { Modul } from './modul.entity';

@Entity('notes')
export class Nota {
    @PrimaryGeneratedColumn()
    id_nota: number;

    @ManyToOne(() => Usuari, (usuari) => usuari.notes)
    @JoinColumn({ name: 'alumne_id' })
    alumne: Usuari;

    @Column()
    alumne_id: number;

    @ManyToOne(() => Modul, (modul) => modul.notes)
    @JoinColumn({ name: 'modul_id' })
    modul: Modul;

    @Column()
    modul_id: number;

    @Column({ type: 'decimal', precision: 4, scale: 2 })
    valor: number;

    @Column({ nullable: true })
    comentari: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    data_registre: Date;
}
