import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuari } from './usuari.entity';
import { AssignacioDocent } from './assignacio-docent.entity';

@Entity('grups')
export class Grup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 10 })
    codi: string;

    @Column({ length: 50 })
    nom: string;

    @Column({ name: 'curs_academic', length: 10, default: '2025-2026' })
    cursAcademic: string;

    @Column({ name: 'aula_base', length: 20, nullable: true })
    aulaBase: string;

    @Column({ name: 'tutor_id', nullable: true })
    tutorId: number;

    @OneToOne(() => Usuari, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'tutor_id' })
    tutor: Usuari;

    @Column({ name: 'delegat_id', nullable: true })
    delegatId: number;

    @OneToOne(() => Usuari, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'delegat_id' })
    delegat: Usuari;

    @OneToMany(() => Usuari, (usuari) => usuari.grup)
    alumnes: Usuari[];

    @OneToMany(() => AssignacioDocent, (assignacio) => assignacio.grup)
    assignacions: AssignacioDocent[];
}
