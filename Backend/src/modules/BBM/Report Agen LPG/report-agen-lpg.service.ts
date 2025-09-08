// Backend/src/modules/BBM/Report Agen LPG/report-agen-lpg.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealisasiBulananLpg, RealisasiBulananLpgMain } from '../Realisasi LPG/realisasi-bulanan-lpg.entity';
import { Agen } from '../../SPBU_LPG/Agen/agen.entity';
import { ReportAgenLpgDto, ReportAgenLpgYearlyDto, ReportAgenLpgStatisticsDto, ReportAgenLpgYearlyStatisticsDto, StatisticsData } from './dto/report-agen-lpg.dto';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { ChartService } from '../../../common/services/chart.service';

@Injectable()
export class ReportAgenLpgService {
  constructor(
    @InjectRepository(RealisasiBulananLpg)
    private readonly realisasiRepo: Repository<RealisasiBulananLpg>,
    @InjectRepository(RealisasiBulananLpgMain)
    private readonly realisasiMainRepo: Repository<RealisasiBulananLpgMain>,
    @InjectRepository(Agen)
    private readonly agenRepo: Repository<Agen>,
    private readonly chartService: ChartService,
  ) {}

  async generateMonthlyReport(dto: ReportAgenLpgDto): Promise<{ buffer: Buffer; fileName: string }> {
    const realisasiData = await this.realisasiRepo.find({
      where: { bulan: dto.bulan, tahun: dto.tahun },
      relations: ['realisasiMain', 'realisasiMain.agen'],
      order: { realisasiMain: { agen: { nama_usaha: 'ASC' } } },
    });
    return this.excelBuilder.buildMonthlyReport(realisasiData, dto);
  }

  // Fungsi ini tetap ada untuk melayani tombol "Download Excel" di halaman laporan
  async generateYearlyReport(dto: ReportAgenLpgYearlyDto): Promise<{ buffer: Buffer; fileName: string }> {
    const { tahun, kuota_mt = 100 } = dto;

    // 1. Fetch data
    const allAgen = await this.agenRepo.find({ order: { nama_usaha: 'ASC' } });
    const realisasiData = await this.realisasiRepo.find({
      where: { tahun },
      relations: ['realisasiMain', 'realisasiMain.agen'],
    });

    const agenDataMap = new Map<number, any>();
    allAgen.forEach(agen => {
      agenDataMap.set(agen.id_agen, {
        id_agen: agen.id_agen,
        nama_usaha: agen.nama_usaha,
        alamat: agen.alamat,
        monthly: Array(12).fill(0),
        total: 0,
      });
    });

    realisasiData.forEach(item => {
      // Pastikan relasi ada sebelum diakses
      if (item.realisasiMain && item.realisasiMain.id_agen) {
        const agenData = agenDataMap.get(item.realisasiMain.id_agen);
        if (agenData) {
          const bulanIndex = item.bulan - 1;
          if (bulanIndex >= 0 && bulanIndex < 12) {
            agenData.monthly[bulanIndex] = item.realisasi_tabung;
          }
        }
      }
    });

<<<<<<< HEAD
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

    // Tambahkan chart di bawah tabel
    const totalRealisasi = monthlyTotals.reduce((sum, val) => sum + val, 0);
    await this.addChartToWorksheet(worksheet, totalRealisasi, kuotaTabung, sisaKuotaRow.number + 3);

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

  private async addChartToWorksheet(
    worksheet: ExcelJS.Worksheet, 
    totalRealisasi: number, 
    kuotaTabung: number, 
    startRow: number
  ): Promise<void> {
    // Hitung sisa kuota
    const sisaKuota = kuotaTabung - totalRealisasi;

    // Tambahkan data untuk chart
    const chartDataRow = startRow + 2;
    
    // Header untuk chart data
    worksheet.getCell(`B${startRow}`).value = 'REKAPITULASI PENYALURAN LPG 3 kg TAHUN 2025 (TABUNG)';
    worksheet.getCell(`B${startRow}`).font = { bold: true, size: 14 };
    worksheet.getCell(`B${startRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE67E22' } // Orange background
    };
    worksheet.mergeCells(`B${startRow}:E${startRow}`);
    
    // Data untuk chart
    worksheet.getCell(`B${chartDataRow}`).value = 'TOTAL REALISASI';
    worksheet.getCell(`C${chartDataRow}`).value = Math.round(totalRealisasi);
    
    worksheet.getCell(`B${chartDataRow + 1}`).value = `KUOTA LPG 3 KG DI KOTA SALATIGA (${(kuotaTabung / 1000).toFixed(0)} MT)`;
    worksheet.getCell(`C${chartDataRow + 1}`).value = Math.round(kuotaTabung);
    
    worksheet.getCell(`B${chartDataRow + 2}`).value = 'SISA KUOTA LPG TAHUN 2025';
    worksheet.getCell(`C${chartDataRow + 2}`).value = Math.round(sisaKuota);

    // Style untuk data chart
    for (let i = 0; i < 3; i++) {
      const row = chartDataRow + i;
      worksheet.getCell(`B${row}`).font = { bold: true };
      worksheet.getCell(`C${row}`).font = { bold: true };
      worksheet.getCell(`B${row}`).alignment = { horizontal: 'left', vertical: 'middle' };
      worksheet.getCell(`C${row}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      // Border untuk data
      ['B', 'C'].forEach(col => {
        worksheet.getCell(`${col}${row}`).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }

    // Warna background untuk setiap baris data
    worksheet.getCell(`B${chartDataRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE74C3C' } // Red untuk total realisasi
    };
    worksheet.getCell(`C${chartDataRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE74C3C' }
    };
    
    worksheet.getCell(`B${chartDataRow + 1}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2ECC71' } // Green untuk kuota
    };
    worksheet.getCell(`C${chartDataRow + 1}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2ECC71' }
    };
    
    worksheet.getCell(`B${chartDataRow + 2}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF1C40F' } // Yellow untuk sisa kuota
    };
    worksheet.getCell(`C${chartDataRow + 2}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF1C40F' }
    };

    // Tambahkan visualisasi chart sederhana dengan bar menggunakan karakter
    const chartStartRow = chartDataRow + 4;
    
    // Hitung skala untuk visualisasi
    const maxValue = Math.max(totalRealisasi, kuotaTabung, sisaKuota);
    const scale = 50; // Panjang maksimum bar
    
    // Fungsi untuk membuat bar visual
    const createBar = (value: number, color: string): string => {
      const barLength = Math.round((value / maxValue) * scale);
      return '█'.repeat(barLength);
    };
    
    // Tambahkan visualisasi bar chart
    worksheet.getCell(`F${chartStartRow}`).value = 'VISUALISASI DATA:';
    worksheet.getCell(`F${chartStartRow}`).font = { bold: true, size: 12 };
    
    // Bar untuk Total Realisasi (Merah)
    worksheet.getCell(`F${chartStartRow + 2}`).value = 'Total Realisasi:';
    worksheet.getCell(`G${chartStartRow + 2}`).value = createBar(totalRealisasi, 'red');
    worksheet.getCell(`H${chartStartRow + 2}`).value = Math.round(totalRealisasi).toLocaleString('id-ID');
    worksheet.getCell(`G${chartStartRow + 2}`).font = { color: { argb: 'FFE74C3C' } };
    
    // Bar untuk Kuota (Hijau)
    worksheet.getCell(`F${chartStartRow + 3}`).value = 'Kuota LPG:';
    worksheet.getCell(`G${chartStartRow + 3}`).value = createBar(kuotaTabung, 'green');
    worksheet.getCell(`H${chartStartRow + 3}`).value = Math.round(kuotaTabung).toLocaleString('id-ID');
    worksheet.getCell(`G${chartStartRow + 3}`).font = { color: { argb: 'FF2ECC71' } };
    
    // Bar untuk Sisa Kuota (Kuning)
    worksheet.getCell(`F${chartStartRow + 4}`).value = 'Sisa Kuota:';
    worksheet.getCell(`G${chartStartRow + 4}`).value = createBar(sisaKuota, 'yellow');
    worksheet.getCell(`H${chartStartRow + 4}`).value = Math.round(sisaKuota).toLocaleString('id-ID');
    worksheet.getCell(`G${chartStartRow + 4}`).font = { color: { argb: 'FFF1C40F' } };
    
    // Tambahkan border dan styling untuk area chart
    for (let row = chartStartRow; row <= chartStartRow + 4; row++) {
      for (let col = 6; col <= 8; col++) { // F, G, H
        const colLetter = String.fromCharCode(64 + col);
        worksheet.getCell(`${colLetter}${row}`).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
    }
  }

  // Method untuk generate statistik data
  async generateStatistics(dto: ReportAgenLpgStatisticsDto | ReportAgenLpgYearlyStatisticsDto): Promise<StatisticsData> {
    let realisasiData: RealisasiBulananLpg[];
    
    if ('bulan' in dto && dto.bulan) {
      // Monthly statistics
      realisasiData = await this.realisasiRepo.find({
        where: { bulan: dto.bulan, tahun: dto.tahun },
        relations: ['realisasiMain', 'realisasiMain.agen']
      });
    } else {
      // Yearly statistics
      realisasiData = await this.realisasiRepo.find({
        where: { tahun: dto.tahun },
        relations: ['realisasiMain', 'realisasiMain.agen']
      });
    }

    const totalAgen = await this.agenRepo.count();
    const totalRealisasi = realisasiData.reduce((sum, item) => sum + item.realisasi_tabung, 0);
    const averageRealisasi = realisasiData.length > 0 ? totalRealisasi / realisasiData.length : 0;
    const maxRealisasi = realisasiData.length > 0 ? Math.max(...realisasiData.map(item => item.realisasi_tabung)) : 0;
    const minRealisasi = realisasiData.length > 0 ? Math.min(...realisasiData.map(item => item.realisasi_tabung)) : 0;
    const agenAktif = new Set(realisasiData.map(item => item.realisasiMain.id_agen)).size;

    // Calculate trend analysis (compare with previous period)
    let trendAnalysis = {
      isIncreasing: false,
      percentageChange: 0,
      comparison: 'Tidak ada data pembanding'
    };

    if ('bulan' in dto && dto.bulan) {
      // Compare with previous month
      const prevMonth = dto.bulan === 1 ? 12 : dto.bulan - 1;
      const prevYear = dto.bulan === 1 ? dto.tahun - 1 : dto.tahun;
      
      const prevData = await this.realisasiRepo.find({
        where: { bulan: prevMonth, tahun: prevYear },
        relations: ['realisasiMain', 'realisasiMain.agen']
      });
      
      if (prevData.length > 0) {
        const prevTotal = prevData.reduce((sum, item) => sum + item.realisasi_tabung, 0);
        const change = ((totalRealisasi - prevTotal) / prevTotal) * 100;
        trendAnalysis = {
          isIncreasing: change > 0,
          percentageChange: Math.abs(change),
          comparison: `Dibandingkan ${this.getMonthName(prevMonth)} ${prevYear}`
        };
      }
    } else {
      // Compare with previous year
      const prevYearData = await this.realisasiRepo.find({
        where: { tahun: dto.tahun - 1 },
        relations: ['realisasiMain', 'realisasiMain.agen']
      });
      
      if (prevYearData.length > 0) {
        const prevTotal = prevYearData.reduce((sum, item) => sum + item.realisasi_tabung, 0);
        const change = ((totalRealisasi - prevTotal) / prevTotal) * 100;
        trendAnalysis = {
          isIncreasing: change > 0,
          percentageChange: Math.abs(change),
          comparison: `Dibandingkan tahun ${dto.tahun - 1}`
        };
      }
    }

    // Top performers
    const agenPerformance = new Map<number, { nama_usaha: string; alamat: string; total: number }>();
    
    realisasiData.forEach(item => {
      const agenId = item.realisasiMain.id_agen;
      const existing = agenPerformance.get(agenId) || {
        nama_usaha: item.realisasiMain.agen.nama_usaha,
        alamat: item.realisasiMain.agen.alamat,
        total: 0
      };
      existing.total += item.realisasi_tabung;
      agenPerformance.set(agenId, existing);
    });

    const topPerformers = Array.from(agenPerformance.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map(item => ({
        nama_usaha: item.nama_usaha,
        realisasi_tabung: item.total,
        alamat: item.alamat
      }));

    // Monthly breakdown for yearly reports
    let monthlyBreakdown: { bulan: number; totalRealisasi: number; jumlahAgen: number; }[] | undefined;
    
    if (!('bulan' in dto) || !dto.bulan) {
      monthlyBreakdown = [];
      for (let month = 1; month <= 12; month++) {
        const monthData = realisasiData.filter(item => item.bulan === month);
        const monthTotal = monthData.reduce((sum, item) => sum + item.realisasi_tabung, 0);
        const monthAgen = new Set(monthData.map(item => item.realisasiMain.id_agen)).size;
        
        monthlyBreakdown.push({
          bulan: month,
          totalRealisasi: monthTotal,
          jumlahAgen: monthAgen
        });
      }
    }

    const persentaseRealisasi = 'kuota_mt' in dto ? 
      (totalRealisasi / (dto.kuota_mt * 1000)) * 100 : // Convert MT to tabung (approx)
      (agenAktif / totalAgen) * 100;

    return {
      totalRealisasi,
      averageRealisasi: Math.round(averageRealisasi),
      maxRealisasi,
      minRealisasi,
      totalAgen,
      agenAktif,
      persentaseRealisasi: Math.round(persentaseRealisasi * 100) / 100,
      trendAnalysis,
      topPerformers,
      monthlyBreakdown
    };
  }

  // Method untuk generate PDF report dengan statistik
  async generatePDFReport(dto: ReportAgenLpgStatisticsDto | ReportAgenLpgYearlyStatisticsDto): Promise<{ buffer: Buffer; fileName: string }> {
    const statistics = await this.generateStatistics(dto);
    
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const buffer = Buffer.concat(buffers);
          const fileName = 'bulan' in dto && dto.bulan ? 
            `Statistik_LPG_${this.getMonthName(dto.bulan)}_${dto.tahun}.pdf` :
            `Statistik_LPG_Tahunan_${dto.tahun}.pdf`;
          resolve({ buffer, fileName });
        });

        // Header
        doc.fontSize(18).font('Helvetica-Bold')
           .text('LAPORAN STATISTIK PENYALURAN LPG 3 KG', { align: 'center' });
        
        const title = 'bulan' in dto && dto.bulan ? 
          `BULAN ${this.getMonthName(dto.bulan).toUpperCase()} TAHUN ${dto.tahun}` :
          `TAHUN ${dto.tahun}`;
        
        doc.fontSize(14).text(title, { align: 'center' });
        doc.moveDown(1);
        
        // Judul Grafik Realisasi
        doc.fontSize(14).font('Helvetica-Bold').text('GRAFIK REALISASI', { align: 'center' });
        doc.moveDown(1);

        // Generate dan sisipkan chart
        if (dto.includeCharts) {
          try {
            let chartBuffer: Buffer;
            let chartTitle: string;
            
            if ('bulan' in dto && dto.bulan) {
              // Chart untuk laporan bulanan
              const monthlyData = await this.getMonthlyChartData(dto.tahun, dto.bulan);
              chartTitle = `Grafik Realisasi LPG ${this.getMonthName(dto.bulan)} ${dto.tahun}`;
              chartBuffer = await this.chartService.generateLineChart(
                monthlyData,
                chartTitle,
                'Agen',
                'Realisasi (Tabung)'
              );
            } else {
              // Chart untuk laporan tahunan
              const yearlyData = await this.getYearlyChartData(dto.tahun);
              chartTitle = `Grafik Realisasi LPG Tahunan ${dto.tahun}`;
              chartBuffer = await this.chartService.generateLineChart(
                yearlyData,
                chartTitle,
                'Bulan',
                'Total Realisasi (Tabung)'
              );
            }
            
            // Resize chart untuk PDF
            const chartWidth = 500;
            const chartHeight = 250;
            const x = (doc.page.width - chartWidth) / 2;
            
            doc.image(chartBuffer, x, doc.y, {
              width: chartWidth,
              height: chartHeight
            });
            
            doc.moveDown(2);
          } catch (chartError) {
            console.error('Error generating chart for PDF:', chartError);
            // Lanjutkan tanpa chart jika ada error
            doc.moveDown(2);
          }
        } else {
          doc.moveDown(2);
        }

        // Ringkasan Statistik
        doc.fontSize(14).font('Helvetica-Bold').text('RINGKASAN STATISTIK');
        doc.moveDown();
        
        doc.fontSize(12).font('Helvetica');
        doc.text(`Total Realisasi: ${statistics.totalRealisasi.toLocaleString('id-ID')} tabung`);
        doc.text(`Rata-rata Realisasi: ${statistics.averageRealisasi.toLocaleString('id-ID')} tabung`);
        doc.text(`Realisasi Tertinggi: ${statistics.maxRealisasi.toLocaleString('id-ID')} tabung`);
        doc.text(`Realisasi Terendah: ${statistics.minRealisasi.toLocaleString('id-ID')} tabung`);
        doc.text(`Total Agen: ${statistics.totalAgen} agen`);
        doc.text(`Agen Aktif: ${statistics.agenAktif} agen`);
        doc.text(`Persentase Realisasi: ${statistics.persentaseRealisasi}%`);
        doc.moveDown();

        // Analisis Trend
        doc.fontSize(14).font('Helvetica-Bold').text('ANALISIS TREND');
        doc.moveDown();
        
        doc.fontSize(12).font('Helvetica');
        const trendText = statistics.trendAnalysis.isIncreasing ? 'Meningkat' : 'Menurun';
        doc.text(`Trend: ${trendText} ${statistics.trendAnalysis.percentageChange.toFixed(2)}%`);
        doc.text(`${statistics.trendAnalysis.comparison}`);
        doc.moveDown();

        // Top Performers
        doc.fontSize(14).font('Helvetica-Bold').text('TOP 5 AGEN TERBAIK');
        doc.moveDown();
        
        statistics.topPerformers.forEach((performer, index) => {
          doc.fontSize(12).font('Helvetica');
          doc.text(`${index + 1}. ${performer.nama_usaha}`);
          doc.text(`   Realisasi: ${performer.realisasi_tabung.toLocaleString('id-ID')} tabung`);
          doc.text(`   Alamat: ${performer.alamat}`);
          doc.moveDown(0.5);
        });

        // Monthly Breakdown (untuk laporan tahunan)
        if (statistics.monthlyBreakdown) {
          doc.addPage();
          doc.fontSize(14).font('Helvetica-Bold').text('BREAKDOWN BULANAN');
          doc.moveDown();
          
          statistics.monthlyBreakdown.forEach((month, index) => {
            if (month.totalRealisasi > 0) {
              doc.fontSize(12).font('Helvetica');
              doc.text(`${this.getMonthName(index + 1)}: ${month.totalRealisasi.toLocaleString('id-ID')} tabung (${month.jumlahAgen} agen)`);
            }
          });
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Method untuk generate Word report dengan statistik
  async generateWordReport(dto: ReportAgenLpgStatisticsDto | ReportAgenLpgYearlyStatisticsDto): Promise<{ buffer: Buffer; fileName: string }> {
    const statistics = await this.generateStatistics(dto);
    
    const title = 'bulan' in dto && dto.bulan ? 
      `LAPORAN STATISTIK PENYALURAN LPG 3 KG BULAN ${this.getMonthName(dto.bulan).toUpperCase()} TAHUN ${dto.tahun}` :
      `LAPORAN STATISTIK PENYALURAN LPG 3 KG TAHUN ${dto.tahun}`;

    // Create RTF content that's compatible with Word
    let rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}\n`;
    
    // Title
    rtfContent += `\\f0\\fs28\\b ${title}\\b0\\fs24\\par\\par\n`;
    
    // Ringkasan Statistik
    rtfContent += `\\f0\\fs24\\b RINGKASAN STATISTIK\\b0\\par\n`;
    rtfContent += `Total Realisasi: ${statistics.totalRealisasi.toLocaleString('id-ID')} tabung\\par\n`;
    rtfContent += `Rata-rata Realisasi: ${statistics.averageRealisasi.toLocaleString('id-ID')} tabung\\par\n`;
    rtfContent += `Realisasi Tertinggi: ${statistics.maxRealisasi.toLocaleString('id-ID')} tabung\\par\n`;
    rtfContent += `Realisasi Terendah: ${statistics.minRealisasi.toLocaleString('id-ID')} tabung\\par\n`;
    rtfContent += `Total Agen: ${statistics.totalAgen} agen\\par\n`;
    rtfContent += `Agen Aktif: ${statistics.agenAktif} agen\\par\n`;
    rtfContent += `Persentase Realisasi: ${statistics.persentaseRealisasi}%\\par\\par\n`;
    
    // Analisis Trend
    rtfContent += `\\f0\\fs24\\b ANALISIS TREND\\b0\\par\n`;
    rtfContent += `Trend: ${statistics.trendAnalysis.isIncreasing ? 'Meningkat' : 'Menurun'} ${statistics.trendAnalysis.percentageChange.toFixed(2)}%\\par\n`;
    rtfContent += `${statistics.trendAnalysis.comparison || 'Tidak ada data pembanding'}\\par\\par\n`;
    
    // Top Performers
    rtfContent += `\\f0\\fs24\\b TOP 5 AGEN TERBAIK\\b0\\par\n`;
    statistics.topPerformers.forEach((performer, index) => {
      rtfContent += `${index + 1}. ${performer.nama_usaha}: ${performer.realisasi_tabung.toLocaleString('id-ID')} tabung\\par\n`;
      rtfContent += `   Alamat: ${performer.alamat}\\par\n`;
    });
    
    rtfContent += `}`;
    
    const buffer = Buffer.from(rtfContent, 'utf8');
    
    const fileName = 'bulan' in dto && dto.bulan ? 
      `Statistik_LPG_${this.getMonthName(dto.bulan)}_${dto.tahun}.rtf` :
      `Statistik_LPG_Tahunan_${dto.tahun}.rtf`;
    
    return { buffer, fileName };
  }

  // Helper methods untuk chart data
  private async getMonthlyChartData(tahun: number, bulan: number): Promise<{ label: string; value: number }[]> {
    const data = await this.realisasiRepo
      .createQueryBuilder('realisasi')
      .leftJoinAndSelect('realisasi.agen', 'agen')
      .where('realisasi.tahun = :tahun', { tahun })
      .andWhere('realisasi.bulan = :bulan', { bulan })
      .andWhere('realisasi.realisasi_tabung > 0')
      .orderBy('realisasi.realisasi_tabung', 'DESC')
      .limit(10) // Top 10 agen
      .getMany();

    return data.map(item => ({
      label: item.agen?.nama_usaha || 'Unknown',
      value: item.realisasi_tabung
    }));
  }

  private async getYearlyChartData(tahun: number): Promise<{ label: string; value: number }[]> {
    const data = await this.realisasiRepo
      .createQueryBuilder('realisasi')
      .select('realisasi.bulan', 'bulan')
      .addSelect('SUM(realisasi.realisasi_tabung)', 'total')
      .where('realisasi.tahun = :tahun', { tahun })
      .groupBy('realisasi.bulan')
      .orderBy('realisasi.bulan', 'ASC')
      .getRawMany();

    return data.map(item => ({
      label: this.getMonthName(item.bulan),
      value: parseInt(item.total) || 0
    }));
  }
}