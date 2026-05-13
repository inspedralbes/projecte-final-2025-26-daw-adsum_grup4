/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import { NotificacionsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notificacions')
export class NotificacionsController {
  constructor(private readonly notificacionsService: NotificacionsService) {}

  @Post('subscriure')
  @UseGuards(JwtAuthGuard)
  async subscriure(
    @Request() req: any,
    @Body() subscription: any,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.notificacionsService.subscriure(
      req.user,
      subscription,
      userAgent,
    );
  }

  @Get('vapid-public-key')
  getVapidPublicKey() {
    return { publicKey: this.notificacionsService.getVapidPublicKey() };
  }
}
