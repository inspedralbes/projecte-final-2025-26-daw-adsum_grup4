import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AiService {
  constructor(private readonly usersService: UsersService) {}

  async generarResposta(alumneId: number, consulta: string) {
    const q = consulta.toLowerCase();
    const stats = await this.usersService.getAlumneStats(alumneId);
    const notes = await this.usersService.getAlumneNotes(alumneId);

    if (!stats) return "No he pogut accedir a les teves dades acadèmiques.";

    // Lògica de "Gemini" integrada amb dades del TR
    if (q.includes('com vaig') || q.includes('rendiment') || q.includes('notes') || q.includes('analitza')) {
      const mitjana = notes.length > 0 
        ? (notes.reduce((acc, n) => acc + n.valor, 0) / notes.length).toFixed(1)
        : '0.0';
      
      let feedback = `Hola. He analitzat el teu expedient acadèmic a la plataforma ADSUM. Actualment, la teva mitjana ponderada és de **${mitjana}**. `;
      
      if (Number(mitjana) >= 9) feedback += "Això indica un rendiment excepcional. Continua amb aquesta disciplina. 🌟";
      else if (Number(mitjana) >= 7) feedback += "Tens un bon nivell competencial, tot i que hi ha marge de millora en les activitats de síntesi.";
      else if (Number(mitjana) >= 5) feedback += "Estàs en el llindar de l'aprovat. Et recomano revisar els recursos del repositori per reforçar conceptes.";
      else feedback += "Atenció: El teu rendiment actual està per sota dels objectius mínims del cicle.";

      feedback += `\n\nRespecte a l'assistència, el teu registre indica un **${stats.stats.percentatge}%** de presència a l'aula. `;
      if (stats.stats.percentatge < 80) feedback += "\n\n⚠️ **ALERTA CRÍTICA**: Estàs per sota del 80% requerit. Podries perdre el dret a l'avaluació contínua si no justifiques les faltes pendents immediatament.";
      
      return feedback;
    }

    if (q.includes('horari') || q.includes('classe') || q.includes('avui')) {
      const schedule = await this.usersService.getAlumneSchedule(alumneId);
      if (schedule.length === 0) return "He consultat el calendari oficial i no m'apareixen sessions programades per al teu grup en el dia d'avui.";
      
      let res = "Aquest és el teu horari acadèmic per a la jornada d'avui:\n\n";
      schedule.forEach(s => {
        res += `- **${s.hora}**: ${s.modul} | Docent: ${s.professor}\n`;
      });
      res += "\nRecorda tenir el teu codi QR a punt per al fitxatge a la porta.";
      return res;
    }

    if (q.includes('justificar') || q.includes('falta') || q.includes('malalt')) {
      return "Segons la normativa del centre integrada a ADSUM, per justificar una absència has de:\n1. Anar al mòdul de **Tràmits**.\n2. Emplenar el formulari de justificació.\n3. Adjuntar un fitxer (PDF o imatge) del comprovant oficial.\n\nUn cop enviat, el teu tutor rebrà una notificació per validar-lo. Vols que t'ajudi amb alguna altra cosa?";
    }

    // Resposta genèrica estil IA
    return "Entenc la teva consulta. Com a Assistent Gemini de la plataforma ADSUM, estic programat per ajudar-te amb la gestió de la teva identitat acadèmica. Puc analitzar el teu rendiment, consultar el teu horari en temps real o guiar-te en els tràmits de secretaria. Què necessites exactament?";
  }
}
