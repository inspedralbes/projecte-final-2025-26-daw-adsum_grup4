import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assistencia } from '../entities/assistencia.entity';

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(Assistencia)
    private readonly assistenciaRepo: Repository<Assistencia>,
  ) {}

  async exportToGoogleSheets(modulId: number) {
    // En un entorn real, aquí usaríem l'API de Google Sheets (googleapis)
    // Per a la demo del TR, simularem que generem un enllaç de sincronització.
    
    const dades = await this.assistenciaRepo.find({
      where: { sessio: { assignacioDocent: { assignaturaId: modulId } } },
      relations: ['alumne', 'sessio']
    });

    console.log(`Exportant ${dades.length} registres a Google Sheets...`);

    // Simulació de delay d'API externa
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      success: true,
      message: 'Sincronització completada correctament',
      sheetUrl: 'https://docs.google.com/spreadsheets/d/1ADSUM_MOCK_SHEET_ID/edit',
      recordsExported: dades.length
    };
  }
}
