import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('alumne')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get(':id/stats')
    async getStats(@Param('id') id: string) {
        const stats = await this.usersService.getAlumneStats(Number(id));
        if (!stats) {
            throw new NotFoundException(`Alumne amb id ${id} no trobat`);
        }
        return stats;
    }
}
