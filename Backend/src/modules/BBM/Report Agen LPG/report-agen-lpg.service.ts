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
    const { tahun, kuota_mt } = dto;

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

    // Merge cells untuk header utama
    worksheet.mergeCells('A1:P1');
    worksheet.mergeCells('A2:P2');

    // Header tabel dengan struktur sesuai gambar
    // Baris pertama header - kolom utama
    const headerRow1 = worksheet.addRow([
      'NO', 'NAMA AGEN', 'AMAT AGEN', 
      'PENYALURAN (TABUNG)', '', '', '', '', '',
      '', '', '', '', '', '', 'TOTAL'
    ]);
    
    // Baris kedua header - bulan-bulan
    const headerRow2 = worksheet.addRow([
      '', '', '',
      'JAN', 'FEB', 'MAR', 'APRIL', 'MEI', 'JUNI',
      'JULI', 'AGTS', 'SEP', 'OKT', 'NOV', 'DES', ''
    ]);
    
    // Merge cells untuk header utama
    worksheet.mergeCells('A4:A5'); // NO
    worksheet.mergeCells('B4:B5'); // NAMA AGEN
    worksheet.mergeCells('C4:C5'); // AMAT AGEN
    worksheet.mergeCells('D4:O4'); // PENYALURAN (TABUNG)
    worksheet.mergeCells('P4:P5'); // TOTAL
    
    // Style untuk header
    [headerRow1, headerRow2].forEach(row => {
      row.font = { bold: true };
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      
      // Add borders to header
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thick' },
          left: { style: 'thick' },
          bottom: { style: 'thick' },
          right: { style: 'thick' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    });

    // Prepare monthly totals untuk summary rows
    const monthlyTotals = Array(12).fill(0);
    agenDataMap.forEach((agenData) => {
      agenData.monthly.forEach((value, index) => {
        monthlyTotals[index] += value;
      });
    });

    // Data rows
    let rowIndex = 1;
    agenDataMap.forEach((agenData) => {
      const row = [
        rowIndex++,
        agenData.nama_usaha,
        agenData.alamat,
        ...agenData.monthly.map(val => val > 0 ? val.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : ''),
        agenData.total > 0 ? agenData.total.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : ''
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
        // Center align numeric data
        if (typeof cell.col === 'number' && cell.col >= 4) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        }
      });
    });
    
    // Add summary rows sesuai gambar
    const totalRealisasiRow = worksheet.addRow([
      '', 'TOTAL REALISASI', '',
      ...monthlyTotals.map(val => val > 0 ? val.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : ''),
      monthlyTotals.reduce((sum, val) => sum + val, 0).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    ]);
    
    // Add kuota and sisa kuota rows
    const kuotaTabung = (kuota_mt * 1000) / 3; // Rumus: (input_mt * 1000) / 3
    const kuotaLpgRow = worksheet.addRow([
      '', `KUOTA LPG 3 KG DI KOTA SALATIGA (${kuota_mt} MT)`, '',
      '', '', '', '', '', '', '', '', '', '', '', '', 
      kuotaTabung.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    ]);
    
    const sisaKuotaRow = worksheet.addRow([
      '', `SISA KUOTA LPG TAHUN ${tahun}`, '',
      '', '', '', '', '', '', '', '', '', '', '', '',
      (kuotaTabung - monthlyTotals.reduce((sum, val) => sum + val, 0)).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    ]);
    
    // Style summary rows
    [totalRealisasiRow, kuotaLpgRow, sisaKuotaRow].forEach(row => {
      row.font = { bold: true };
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' } // Yellow background
      };
      
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (typeof cell.col === 'number' && cell.col >= 4) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        }
      });
    });

    // Auto-fit columns sesuai dengan format gambar
    worksheet.getColumn(1).width = 5;  // NO
    worksheet.getColumn(2).width = 25; // NAMA AGEN
    worksheet.getColumn(3).width = 15; // AMAT AGEN
    worksheet.getColumn(4).width = 8;  // JAN
    worksheet.getColumn(5).width = 8;  // FEB
    worksheet.getColumn(6).width = 8;  // MAR
    worksheet.getColumn(7).width = 8;  // APRIL
    worksheet.getColumn(8).width = 8;  // MEI
    worksheet.getColumn(9).width = 8;  // JUNI
    worksheet.getColumn(10).width = 8; // JULI
    worksheet.getColumn(11).width = 8; // AGTS
    worksheet.getColumn(12).width = 8; // SEP
    worksheet.getColumn(13).width = 8; // OKT
    worksheet.getColumn(14).width = 8; // NOV
    worksheet.getColumn(15).width = 8; // DES
    worksheet.getColumn(16).width = 12; // TOTAL

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