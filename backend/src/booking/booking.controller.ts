import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/reserves')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('espais')
  async llistarEspais() {
    return await this.bookingService.llistarEspais();
  }

  @Get('meves')
  async llistarMeves(@Req() req: any) {
    return await this.bookingService.llistarReservesUsuari(req.user.id);
  }

  @Post('crear')
  async crear(@Req() req: any, @Body() dades: { espaiId: number, data: string, franja: string }) {
    return await this.bookingService.crearReserva(req.user.id, dades);
  }

  @Delete(':id')
  async cancel·lar(@Req() req: any, @Param('id') id: number) {
    return await this.bookingService.cancel·larReserva(id, req.user.id);
  }
}
