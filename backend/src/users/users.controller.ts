import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Usuari } from '../entities/usuari.entity';

@Controller('api/usuaris')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async crearUsuari(@Body() dadesUsuari: Partial<Usuari>): Promise<Usuari> {
    return await this.usersService.crear(dadesUsuari);
  }

  @Get()
  async obtenirTots(): Promise<Usuari[]> {
    return await this.usersService.trobarTots();
  }

  @Get(':id')
  async obtenirPerId(@Param('id') id: string): Promise<Usuari> {
    return await this.usersService.trobarUn(+id);
  }

  @Put(':id')
  async actualitzarUsuari(
    @Param('id') id: string,
    @Body() dadesActualitzades: Partial<Usuari>,
  ): Promise<Usuari> {
    return await this.usersService.actualitzar(+id, dadesActualitzades);
  }

  @Delete(':id')
  async eliminarUsuari(@Param('id') id: string): Promise<void> {
    return await this.usersService.eliminar(+id);
  }

  @Get(':id/stats')
  async getStats(@Param('id') id: string) {
    const stats = await this.usersService.getAlumneStats(Number(id));
    if (!stats) {
      throw new NotFoundException(`Alumne amb id ${id} no trobat`);
    }
    return stats;
  }

  @Get('professor/:id/moduls')
  async getProfessorModuls(@Param('id') id: string) {
    return await this.usersService.getProfessorModuls(Number(id));
  }

  @Get('modul/:id/students')
  async getModulStudents(@Param('id') id: string) {
    const students = await this.usersService.getModulStudents(Number(id));
    if (!students) {
      throw new NotFoundException(`Mòdul amb id ${id} no trobat`);
    }
    return students;
  }

  @Post('modul/:id/seed')
  async seedStudents(@Param('id') id: string) {
    return await this.usersService.seedStudents(Number(id));
  }

  @Get(':id/notes')
  async getNotes(@Param('id') id: string) {
    return await this.usersService.getAlumneNotes(Number(id));
  }

  @Get(':id/schedule')
  async getSchedule(@Param('id') id: string) {
    return await this.usersService.getAlumneSchedule(Number(id));
  }
}
