import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JustificationsService } from './justifications.service';
import { JustificacioEstat } from '../entities/justificacio.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/justificacions')
@UseGuards(JwtAuthGuard)
export class JustificationsController {
  constructor(private readonly justificationsService: JustificationsService) {}

  @Post('pujar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/justificacions',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async crear(
    @UploadedFile() file: any,
    @Body() dades: { motiu: string; dataInici: string; dataFi: string },
    @Req() req: any,
  ) {
    return this.justificationsService.crear({
      alumneId: req.user.id,
      motiu: dades.motiu,
      dataInici: dades.dataInici,
      dataFi: dades.dataFi,
      arxiuUrl: file ? file.filename : null,
    });
  }

  @Get('meves')
  async llistarMeves(@Req() req: any) {
    return this.justificationsService.llistarPerAlumne(req.user.id);
  }

  @Get('totes')
  async llistarTotes() {
    return this.justificationsService.llistarTotes();
  }

  @Patch(':id/validar')
  async validar(
    @Param('id') id: number,
    @Body() dades: { estat: JustificacioEstat; observacions?: string },
  ) {
    return this.justificationsService.validar(id, dades.estat, dades.observacions);
  }
}
