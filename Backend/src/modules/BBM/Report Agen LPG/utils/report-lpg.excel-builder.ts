import * as ExcelJS from 'exceljs';
import { ReportAgenLpgDto, ReportAgenLpgYearlyDto } from '../dto/report-agen-lpg.dto';
import { RealisasiBulananLpg } from '../../Realisasi LPG/realisasi-bulanan-lpg.entity';

export class ReportLpgExcelBuilder {
  /**
   * Builds the monthly LPG report Excel file.
   * @param realisasiData - The data fetched from the database.
   * @param dto - The DTO containing the month and year.
   * @returns A promise that resolves to the Excel buffer and file name.
   */
  async buildMonthlyReport(
    realisasiData: RealisasiBulananLpg[],
    dto: ReportAgenLpgDto
  ): Promise<{ buffer: Buffer; fileName: string }> {
    const { bulan, tahun } = dto;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan LPG Bulanan');

    // Main header
    worksheet.addRow(['PENYALURAN LPG 3 KG']);
    worksheet.addRow([`BULAN ${this.getMonthName(bulan).toUpperCase()} TAHUN ${tahun}`]);
    worksheet.addRow([]);

    // Style main header
    worksheet.getRow(1).font = { bold: true, size: 14 };
    worksheet.getRow(2).font = { bold: true, size: 12 };
    worksheet.getRow(1).alignment = { horizontal: 'center' };
    worksheet.getRow(2).alignment = { horizontal: 'center' };

    // Merge cells for header
    worksheet.mergeCells('A1:D1');
    worksheet.mergeCells('A2:D2');

    // Table header
    const headerRow = worksheet.addRow(['NO', 'NAMA AGEN', 'ALAMAT', 'Realisasi Penyaluran (tabung)']);
    headerRow.font = { bold: true };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
    headerRow.eachCell((cell) => {
      cell.border = { top: { style: 'thick' }, left: { style: 'thick' }, bottom: { style: 'thick' }, right: { style: 'thick' } };
    });

    // Data rows
    realisasiData.forEach((item, index) => {
      const addedRow = worksheet.addRow([
        index + 1,
        item.realisasiMain.agen.nama_usaha,
        item.realisasiMain.agen.alamat,
        item.realisasi_tabung,
      ]);
      addedRow.eachCell((cell) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
      // Apply number format to the realization column
      addedRow.getCell(4).numFmt = '#,##0';
    });

    // Auto-fit columns
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 25;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 20;

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `Laporan_LPG_${this.getMonthName(bulan)}_${tahun}.xlsx`;

    return { buffer: Buffer.from(buffer), fileName };
  }

  /**
   * Builds the yearly LPG report Excel file.
   * @param agenDataMap - The processed map of agent data.
   * @param dto - The DTO containing the year and quota.
   * @returns A promise that resolves to the Excel buffer and file name.
   */
  async buildYearlyReport(
    agenDataMap: Map<number, any>,
    dto: ReportAgenLpgYearlyDto
  ): Promise<{ buffer: Buffer; fileName: string }> {

    const { tahun, kuota_mt } = dto;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan LPG Tahunan');

    // Main header
    worksheet.addRow(['PENYALURAN LPG 3 KG (Tabung)']);
    worksheet.addRow([`TAHUN ${tahun}`]);
    worksheet.addRow([]);
    worksheet.getRow(1).font = { bold: true, size: 14 };
    worksheet.getRow(2).font = { bold: true, size: 12 };
    worksheet.getRow(1).alignment = { horizontal: 'center' };
    worksheet.getRow(2).alignment = { horizontal: 'center' };
    worksheet.mergeCells('A1:P1');
    worksheet.mergeCells('A2:P2');

    // Table headers
    const headerRow1 = worksheet.addRow(['NO', 'NAMA AGEN', 'ALAMAT AGEN', 'PENYALURAN (TABUNG)', ...Array(11).fill(''), 'TOTAL']);
    const headerRow2 = worksheet.addRow(['', '', '', 'JAN', 'FEB', 'MAR', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGTS', 'SEP', 'OKT', 'NOV', 'DES', '']);
    worksheet.mergeCells('A4:A5');
    worksheet.mergeCells('B4:B5');
    worksheet.mergeCells('C4:C5');
    worksheet.mergeCells('D4:O4');
    worksheet.mergeCells('P4:P5');

    // Style headers
    const applyHeaderStyle = (row: ExcelJS.Row, cellsToStyle: number[]) => {
      cellsToStyle.forEach(colNum => {
        const cell = row.getCell(colNum);
        cell.font = { bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
        cell.border = { top: { style: 'thick' }, left: { style: 'thick' }, bottom: { style: 'thick' }, right: { style: 'thick' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    };
    applyHeaderStyle(headerRow1, [1, 2, 3, 4, 16]);
    for (let i = 4; i <= 15; i++) {
      headerRow1.getCell(i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
      headerRow1.getCell(i).border = { top: { style: 'thick' }, left: { style: 'thick' }, bottom: { style: 'thick' }, right: { style: 'thick' } };
    }
    applyHeaderStyle(headerRow2, [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

    // Data rows
    let rowIndex = 1;
    agenDataMap.forEach((agenData) => {
      const rowData = [rowIndex++, agenData.nama_usaha, agenData.alamat, ...agenData.monthly, agenData.total];
      const addedRow = worksheet.addRow(rowData);

      addedRow.eachCell((cell, colNumber) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        if (colNumber > 3) {
          cell.alignment = { horizontal: 'center' };
          cell.numFmt = '#,##0';
        }
      });
    });

    // Summary Rows
    const monthlyTotals = Array(12).fill(0);
    agenDataMap.forEach(data => data.monthly.forEach((val, i) => monthlyTotals[i] += val));
    const grandTotal = monthlyTotals.reduce((a, b) => a + b, 0);

    const totalRealisasiRow = worksheet.addRow(['', 'TOTAL REALISASI', '', ...monthlyTotals, grandTotal]);
    const kuotaTabung = (kuota_mt * 1000) / 3;
    const kuotaLpgRow = worksheet.addRow(['', `KUOTA LPG 3 KG DI KOTA SALATIGA (${kuota_mt} MT)`, '', ...Array(12).fill(null), kuotaTabung]);
    const sisaKuotaRow = worksheet.addRow(['', `SISA KUOTA LPG TAHUN ${tahun}`, '', ...Array(12).fill(null), kuotaTabung - grandTotal]);

    // Style summary rows
    const summaryStyle = (row: ExcelJS.Row, mergeMonths: boolean) => {
      row.getCell(2).font = { bold: true };
      row.getCell(3).font = { bold: true };
      row.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
      row.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
      worksheet.mergeCells(`${row.getCell(2).address}:${row.getCell(3).address}`);

      if (mergeMonths) {
        for (let i = 4; i <= 15; i++) {
          const cell = row.getCell(i);
          cell.font = { bold: true };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
        }
        worksheet.mergeCells(`${row.getCell(4).address}:${row.getCell(15).address}`);
      } else {
        for (let i = 4; i <= 15; i++) {
          const cell = row.getCell(i);
          cell.font = { bold: true };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
          cell.alignment = { horizontal: 'center' };
          cell.numFmt = '#,##0';
        }
      }

      const totalCell = row.getCell(16);
      totalCell.font = { bold: true };
      totalCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
      totalCell.alignment = { horizontal: 'center' };
      totalCell.numFmt = '#,##0';

      for (let i = 1; i <= 16; i++) {
        const cell = row.getCell(i);
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      }
    };

    summaryStyle(totalRealisasiRow, false);
    summaryStyle(kuotaLpgRow, true);
    summaryStyle(sisaKuotaRow, true);

    worksheet.getCell('D10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell('D11').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

    // --- START: Chart Addition ---
    try {
      const lastDataRow = sisaKuotaRow.number;
      const chartStartRow = lastDataRow + 2;

      // Kita tetap gunakan (as any) untuk lolos dari pengecekan TypeScript
      (worksheet as any).addChart({
        type: 'bar',
        style: 10,
        title: {
          text: `Grafik Penyaluran LPG 3KG Tahun ${tahun}`,
          font: { size: 14, bold: true },
        },
        legend: { position: 'b' },
        x_axis: { title: { text: 'Bulan' } },
        y_axis: {
          title: { text: 'Jumlah (Tabung)' },
          number_format: '#,##0',
        },
        series: [
          {
            name: `'${worksheet.name}'!$B$${totalRealisasiRow.number}`,
            xvalues: `'${worksheet.name}'!$D$5:$O$5`,
            yvalues: `'${worksheet.name}'!$D$${totalRealisasiRow.number}:$O$${totalRealisasiRow.number}`,
          },
        ],
        anchor: {
          type: 'twoCell',
          from: { col: 2, colOff: 0, row: chartStartRow, rowOff: 0 },
          to: { col: 16, colOff: 0, row: chartStartRow + 20, rowOff: 0 },
        },
      });
    } catch (error) {
      // JIKA GAGAL: Cetak peringatan di konsol backend dan lanjutkan proses
      // Ini akan mencegah server dari crash.
      console.warn(
        '******************************************************************\n' +
        'WARNING: Gagal membuat grafik Excel karena masalah environment.\n' +
        'Laporan tetap dibuat tanpa grafik. Error:',
        error.message,
        '\n******************************************************************'
      );
    }
    // --- END: Chart Addition ---

    // Column widths
    [5, 25, 30, ...Array(12).fill(10), 15].forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `Laporan_LPG_Tahunan_${tahun}.xlsx`;

    return { buffer: Buffer.from(buffer), fileName };
  }

  private getMonthName(bulan: number): string {
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return monthNames[bulan - 1] || 'Unknown';
  }
}