import { Injectable } from '@nestjs/common';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

@Injectable()
export class ExportService {
  /**
   * Export data to CSV buffer
   */
  async exportToCsv(data: any[], filename: string): Promise<Buffer> {
    try {
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(data);
      return Buffer.from(csv);
    } catch (error) {
      throw new Error(`Error generating CSV: ${error.message}`);
    }
  }

  /**
   * Export data to PDF buffer
   */
  async exportToPdf(data: any[], filename: string, title: string, columns: { label: string, key: string }[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err) => reject(err));

        // Title
        doc.fontSize(20).text(title, { align: 'center', underline: true });
        doc.moveDown();

        // Table Header
        const startX = 50;
        const colWidth = 450 / columns.length;

        doc.fontSize(12).font('Helvetica-Bold');
        let currentX = startX;
        columns.forEach(col => {
          doc.text(col.label, currentX, doc.y, { width: colWidth, align: 'left' });
          currentX += colWidth;
        });

        doc.moveDown();
        doc.fontSize(10).font('Helvetica');

        // Table Rows
        data.forEach(row => {
          let rowY = doc.y;
          let rowX = startX;

          columns.forEach(col => {
            const value = row[col.key]?.toString() || '-';
            doc.text(value, rowX, rowY, { width: colWidth, align: 'left', ellipsis: true });
            rowX += colWidth;
          });
          doc.moveDown();

          // Add new page if we're near the bottom
          if (doc.y > 700) {
            doc.addPage();
          }
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
