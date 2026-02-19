import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuari } from './usuari.entity';

@Entity('logs_auditoria')
export class LogAuditoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'usuari_autor_id' })
    usuariAutorId: number;

    @ManyToOne(() => Usuari, (usuari) => usuari.logsAutor)
    @JoinColumn({ name: 'usuari_autor_id' })
    autor: Usuari;

    @Column({ name: 'usuari_afectat_id', nullable: true })
    usuariAfectatId: number;

    @Column({ length: 50 })
    accio: string;

    @Column({ type: 'json', nullable: true })
    detalls: any;

    @CreateDateColumn({ name: 'data_accio' })
    dataAccio: Date;

    @Column({ name: 'ip_origen', length: 45, nullable: true })
    ipOrigen: string;
}
