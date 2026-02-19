import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('alumne/:id')
  async getNotes(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.getAlumneNotes(id);
  }

  @Get('alumne/:id/mitjana')
  async getMitjana(@Param('id', ParseIntPipe) id: number) {
    return { mitjana: await this.notesService.getMitjana(id) };
  }
}
