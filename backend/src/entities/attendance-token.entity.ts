import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('attendance_tokens')
@Index('idx_attendance_token_modul', ['modulId'])
@Index('idx_attendance_token_expires', ['expiresAt'])
export class AttendanceToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  token: string;

  @Column()
  modulId: number;

  @Column()
  professorId: number;

  @Column({ default: 15 })
  lateMinutes: number;

  @Column({ default: 30 })
  absentMinutes: number;

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  isUsed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
