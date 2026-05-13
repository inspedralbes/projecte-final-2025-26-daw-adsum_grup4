import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { HallpassService } from './hallpass.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MotiuSortida } from '../entities/sortida-aula.entity';

@Controller('hallpass')
@UseGuards(JwtAuthGuard)
export class HallpassController {
  constructor(private readonly hallpassService: HallpassService) {}

  @Post('crear')
  async crearSortida(
    @Body() body: { alumneId: number; motiu: MotiuSortida; duradaMinuts?: number },
  ) {
    return await this.hallpassService.crearSortida(
      body.alumneId,
      body.motiu,
      body.duradaMinuts,
    );
  }

  @Get('alumne/:id')
  async getSortidesAlumne(@Param('id') id: string) {
    return await this.hallpassService.getSortidesAlumne(+id);
  }

  @Post(':id/tornada')
  async registrarTornada(@Param('id') id: string) {
    return await this.hallpassService.registrarTornada(+id);
  }

  @Get('actives')
  async getSortidesActives() {
    return await this.hallpassService.getSortidesActives();
  }
}