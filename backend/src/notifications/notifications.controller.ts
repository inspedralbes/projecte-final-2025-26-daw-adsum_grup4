import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import { NotificacionsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notificacions')
@UseGuards(JwtAuthGuard)
export class NotificacionsController {
  constructor(private readonly notificacionsService: NotificacionsService) {}

  // Endpoint per registrar la subscripció Push
  @Post('subscriure')
  async subscriure(
    @Request() req: any,
    @Body() subscription: any,
    @Headers('user-agent') userAgent: string,
  ) {
    // req.user ve del JwtToken
    return this.notificacionsService.subscriure(
      req.user,
      subscription,
      userAgent,
    );
  }
}
