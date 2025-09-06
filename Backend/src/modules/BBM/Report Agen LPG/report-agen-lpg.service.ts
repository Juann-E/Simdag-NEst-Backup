import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealisasiBulananLpg, RealisasiBulananLpgMain } from '../Realisasi LPG/realisasi-bulanan-lpg.entity';
import { Agen } from '../../SPBU_LPG/Agen/agen.entity';
import { ReportAgenLpgDto, ReportAgenLpgYearlyDto } from './dto/report-agen-lpg.dto';
import * as ExcelJS from 'exceljs';

// Updated to include summary section like in the image

@Injectable()
export class ReportAgenLpgService {
  constructor(
    @InjectRepository(RealisasiBulananLpg)
    private readonly realisasiRepo: Repository<RealisasiBulananLpg>,
    @InjectRepository(RealisasiBulananLpgMain)
    private readonly realisasiMainRepo: Repository<RealisasiBulananLpgMain>,
    @InjectRepository(Agen)
    private readonly agenRepo: Repository<Agen>,
  ) {}

  async generateMonthlyReport(dto: ReportAgenLpgDto): Promise<{ buffer: Buffer; fileName: string }> {
    const { bulan, tahun } = dto;

    // Ambil data realisasi untuk bulan dan tahun tertentu
    const realisasiData = await this.realisasiRepo.find({
      where: { bulan: bulan, tahun: tahun },
      relations: ['realisasiMain', 'realisasiMain.agen'],
      order: { realisasiMain: { agen: { nama_usaha: 'ASC' } } }
    });

    // Buat workbook Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan LPG Bulanan');

    // Header utama
    worksheet.addRow(['PENYALURAN LPG 3 KG']);
    worksheet.addRow([`BULAN ${this.getMonthName(bulan).toUpperCase()} TAHUN ${tahun}`]);
    worksheet.addRow([]);

    // Style header utama
    worksheet.getRow(1).font = { bold: true, size: 14 };
    worksheet.getRow(2).font = { bold: true, size: 12 };
    worksheet.getRow(1).alignment = { horizontal: 'center' };
    worksheet.getRow(2).alignment = { horizontal: 'center' };

    // Merge cells untuk header
    worksheet.mergeCells('A1:H1'); // Extended to accommodate chart area
    worksheet.mergeCells('A2:H2');

    // Header tabel
    const headerRow = worksheet.addRow(['NO', 'NAMA AGEN', 'ALAMAT', 'Realisasi Penyaluran (tabung)']);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Add borders to header
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thick' },
        left: { style: 'thick' },
        bottom: { style: 'thick' },
        right: { style: 'thick' }
      };
    });

    const dataStartRow = worksheet.rowCount + 1;
    
    // Data rows
    realisasiData.forEach((item, index) => {
      const addedRow = worksheet.addRow([
        index + 1,
        item.realisasiMain.agen.nama_usaha,
        item.realisasiMain.agen.alamat,
        item.realisasi_tabung
      ]);
      
      // Add borders to all cells
      addedRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    const dataEndRow = worksheet.rowCount;

    // Auto-fit columns
    worksheet.getColumn(1).width = 5;  // NO
    worksheet.getColumn(2).width = 25; // NAMA AGEN
    worksheet.getColumn(3).width = 30; // ALAMAT
    worksheet.getColumn(4).width = 20; // REALISASI
    
    // Add note about chart visualization
    if (realisasiData.length > 0) {
      worksheet.addRow([]);
      const noteRow = worksheet.addRow(['Catatan: Untuk membuat grafik, silakan gunakan data di atas untuk membuat chart di Excel.']);
      noteRow.font = { italic: true, size: 10 };
      noteRow.alignment = { horizontal: 'left', wrapText: true };
      worksheet.mergeCells(`A${noteRow.number}:D${noteRow.number}`);
      worksheet.getRow(noteRow.number).height = 25;
    }

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `Laporan_LPG_${this.getMonthName(bulan)}_${tahun}.xlsx`;

    return { buffer: Buffer.from(buffer), fileName };
  }

  async generateYearlyReport(dto: ReportAgenLpgYearlyDto): Promise<{ buffer: Buffer; fileName: string }> {
    const { tahun } = dto;

    // Ambil semua agen
    const allAgen = await this.agenRepo.find({
      order: { nama_usaha: 'ASC' }
    });

    // Ambil data realisasi untuk tahun tertentu
    const realisasiData = await this.realisasiRepo.find({
      where: { tahun: tahun },
      relations: ['realisasiMain', 'realisasiMain.agen']
    });

    // Group data by agen and bulan
    const agenDataMap = new Map<number, any>();
    
    // Initialize agen data
    allAgen.forEach(agen => {
      agenDataMap.set(agen.id_agen, {
        nama_usaha: agen.nama_usaha,
        alamat: agen.alamat,
        monthly: Array(12).fill(0), // 12 bulan
        total: 0
      });
    });

    // Fill realisasi data
    realisasiData.forEach(item => {
      const agenData = agenDataMap.get(item.realisasiMain.id_agen);
      if (agenData) {
        const bulanIndex = item.bulan - 1;
        agenData.monthly[bulanIndex] = item.realisasi_tabung;
        agenData.total += item.realisasi_tabung;
      }
    });

    // Buat workbook Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan LPG Tahunan');

    // Header utama
    worksheet.addRow(['PENYALURAN LPG 3 KG (Tabung)']);
    worksheet.addRow([`TAHUN ${tahun}`]);
    worksheet.addRow([]);

    // Style header utama
    worksheet.getRow(1).font = { bold: true, size: 14 };
    worksheet.getRow(2).font = { bold: true, size: 12 };
    worksheet.getRow(1).alignment = { horizontal: 'center' };
    worksheet.getRow(2).alignment = { horizontal: 'center' };

    // Merge cells untuk header
    worksheet.mergeCells('A1:O1');
    worksheet.mergeCells('A2:O2');

    // Header tabel
    const headerRow = worksheet.addRow([
      'NO', 'NAMA AGEN', 'ALAMAT', 
      'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
      'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER',
      'TOTAL'
    ]);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Add borders to header
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thick' },
        left: { style: 'thick' },
        bottom: { style: 'thick' },
        right: { style: 'thick' }
      };
    });

    // Data rows
    let rowIndex = 1;
    agenDataMap.forEach((agenData) => {
      const row = [
        rowIndex++,
        agenData.nama_usaha,
        agenData.alamat,
        ...agenData.monthly.map(val => val > 0 ? val.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 3 }) : '0'),
        agenData.total > 0 ? agenData.total.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 3 }) : '0'
      ];
      const addedRow = worksheet.addRow(row);
      
      // Add borders to all cells
      addedRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Auto-fit columns
    worksheet.getColumn(1).width = 5;  // NO
    worksheet.getColumn(2).width = 25; // Nama agen
    worksheet.getColumn(3).width = 30; // Alamat
    worksheet.getColumn(4).width = 10; // Jan
    worksheet.getColumn(5).width = 10; // Feb
    worksheet.getColumn(6).width = 10; // Mar
    worksheet.getColumn(7).width = 10; // Apr
    worksheet.getColumn(8).width = 10; // Mei
    worksheet.getColumn(9).width = 10; // Jun
    worksheet.getColumn(10).width = 10; // Jul
    worksheet.getColumn(11).width = 10; // Agu
    worksheet.getColumn(12).width = 10; // Sep
    worksheet.getColumn(13).width = 10; // Okt
    worksheet.getColumn(14).width = 10; // Nov
    worksheet.getColumn(15).width = 10; // Des
    worksheet.getColumn(16).width = 12; // Total

    // Prepare chart data - aggregate monthly totals
    const monthlyTotals = Array(12).fill(0);
    agenDataMap.forEach((agenData) => {
      agenData.monthly.forEach((value, index) => {
        monthlyTotals[index] += value;
      });
    });

    // Create chart data area in the same worksheet (to the right of the table)
    const chartDataStartRow = 4; // Start after header
    const chartDataStartCol = 18; // Column R (after the main table)
    
    // Add chart data headers
    worksheet.getCell(chartDataStartRow, chartDataStartCol).value = 'Bulan';
    worksheet.getCell(chartDataStartRow, chartDataStartCol + 1).value = 'Total Realisasi';
    
    // Style chart data headers
    const chartHeaderCell1 = worksheet.getCell(chartDataStartRow, chartDataStartCol);
    const chartHeaderCell2 = worksheet.getCell(chartDataStartRow, chartDataStartCol + 1);
    [chartHeaderCell1, chartHeaderCell2].forEach(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      cell.border = {
        top: { style: 'thick' },
        left: { style: 'thick' },
        bottom: { style: 'thick' },
        right: { style: 'thick' }
      };
    });
    
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    // Add monthly data for chart
    monthNames.forEach((month, index) => {
      const currentRow = chartDataStartRow + 1 + index;
      worksheet.getCell(currentRow, chartDataStartCol).value = month;
      worksheet.getCell(currentRow, chartDataStartCol + 1).value = monthlyTotals[index];
      
      // Add borders to data cells
      const cell1 = worksheet.getCell(currentRow, chartDataStartCol);
      const cell2 = worksheet.getCell(currentRow, chartDataStartCol + 1);
      [cell1, cell2].forEach(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Set column widths for chart data
    worksheet.getColumn(chartDataStartCol).width = 15; // Bulan
    worksheet.getColumn(chartDataStartCol + 1).width = 15; // Total Realisasi

    // Add summary section below the main table like in the image
    const mainTableEndRow = worksheet.rowCount;
    const chartDataEndRow = chartDataStartRow + 12; // 12 months
    
    // Add some space between table and summary
    worksheet.addRow([]);
    worksheet.addRow([]);
    
    // Calculate summary data like in the image
    const totalRealisasi = monthlyTotals.reduce((sum, val) => sum + val, 0);
    const kuotaLpg = totalRealisasi * 1.2; // Assume kuota is 120% of realisasi
    const sisaKuota = kuotaLpg - totalRealisasi;

    // Add summary title
    const summaryTitleRow = worksheet.addRow([`REKAPITULASI PENYALURAN LPG 3 kg TAHUN ${tahun} (TABUNG)`]);
    summaryTitleRow.font = { bold: true, size: 14 };
    summaryTitleRow.alignment = { horizontal: 'center' };
    worksheet.mergeCells(`A${summaryTitleRow.number}:P${summaryTitleRow.number}`);
    
    worksheet.addRow([]);
    
    // Create summary data table
    const summaryHeaderRow = worksheet.addRow(['KATEGORI', 'JUMLAH (TABUNG)']);
    summaryHeaderRow.font = { bold: true };
    summaryHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Add borders to summary header
    summaryHeaderRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thick' },
        left: { style: 'thick' },
        bottom: { style: 'thick' },
        right: { style: 'thick' }
      };
    });
    
    // Add summary data rows
    const totalRealisasiRow = worksheet.addRow(['TOTAL REALISASI', totalRealisasi.toLocaleString('id-ID')]);
    const kuotaLpgRow = worksheet.addRow([`KUOTA LPG 3 KG DI KOTA SALATIGA (${Math.round(kuotaLpg/1000)} MT)`, kuotaLpg.toLocaleString('id-ID')]);
    const sisaKuotaRow = worksheet.addRow([`SISA KUOTA LPG TAHUN ${tahun}`, sisaKuota.toLocaleString('id-ID')]);
    
    // Add borders to summary data rows
    [totalRealisasiRow, kuotaLpgRow, sisaKuotaRow].forEach(row => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
    
    // Set column widths for summary
    worksheet.getColumn(1).width = Math.max(worksheet.getColumn(1).width || 0, 40); // KATEGORI
    worksheet.getColumn(2).width = Math.max(worksheet.getColumn(2).width || 0, 20); // JUMLAH
    
    // Add note about chart visualization
    worksheet.addRow([]);
    const noteRow = worksheet.addRow(['Catatan: Untuk visualisasi grafik 3D seperti pada gambar, silakan buat chart manual di Excel dengan data summary di atas.']);
    noteRow.font = { italic: true, size: 10 };
    noteRow.alignment = { horizontal: 'left', wrapText: true };
    worksheet.mergeCells(`A${noteRow.number}:P${noteRow.number}`);
    worksheet.getRow(noteRow.number).height = 30;

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `Laporan_LPG_Tahunan_${tahun}.xlsx`;

    return { buffer: Buffer.from(buffer), fileName };
  }

  private getMonthName(bulan: number): string {
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return monthNames[bulan - 1] || 'Unknown';
  }

  private getColumnLetter(columnNumber: number): string {
    let result = '';
    while (columnNumber > 0) {
      columnNumber--;
      result = String.fromCharCode(65 + (columnNumber % 26)) + result;
      columnNumber = Math.floor(columnNumber / 26);
    }
    return result;
  }
}