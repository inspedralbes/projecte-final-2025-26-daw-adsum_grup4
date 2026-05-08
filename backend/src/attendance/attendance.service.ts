import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceToken } from '../entities/attendance-token.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceToken)
    private readonly tokenRepository: Repository<AttendanceToken>,
  ) {}

  async generateToken(): Promise<AttendanceToken> {
    const tokenValue = uuidv4(); // Generamos un código único
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + 5); // Caduca en 5 segundos

    const newToken = this.tokenRepository.create({
      token: tokenValue,
      expiresAt: expiresAt,
      isUsed: false,
    });

    return await this.tokenRepository.save(newToken);
  }

  async validateToken(tokenValue: string): Promise<boolean> {
    const token = await this.tokenRepository.findOne({
      where: { token: tokenValue, isUsed: false },
    });

    if (!token) return false;

    const now = new Date();
    if (token.expiresAt < now) return false;

    // Marcamos como usado para que no se pueda copiar
    token.isUsed = true;
    await this.tokenRepository.save(token);

    return true;
  }
}
