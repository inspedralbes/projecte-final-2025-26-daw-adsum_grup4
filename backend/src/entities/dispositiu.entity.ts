import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuari } from './usuari.entity';

@Entity('dispositius')
export class Dispositiu {
    @PrimaryGeneratedColumn()
    id_dispositiu: number;

    @ManyToOne(() => Usuari, (usuari) => usuari.dispositius)
    @JoinColumn({ name: 'usuari_id' })
    usuari: Usuari;

    @Column()
    usuari_id: number;

    @Column()
    fingerprint: string;

    @Column({ default: false })
    confianca: boolean;
}
