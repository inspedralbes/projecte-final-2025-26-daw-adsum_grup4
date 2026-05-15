import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('consultar')
  async consultar(@Body() data: { consulta: string }, @Req() req) {
    const alumneId = req.user.id;
    const resposta = await this.aiService.generarResposta(alumneId, data.consulta);
    return { resposta };
  }
}
