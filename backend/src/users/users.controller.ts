import { Controller, Get, Post, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('alumne/:id/stats')
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
}
