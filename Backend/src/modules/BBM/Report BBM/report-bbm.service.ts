import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealisasiBulananBbm } from '../Realisasi BBM/realisasi-bulanan-bbm.entity';
import { Spbu } from '../../SPBU_LPG/SPBU/spbu.entity';
import { JenisBbm } from '../JenisBbm/jenis-bbm.entity';
import { ReportBbmDto, ReportBbmYearlyDto } from './dto/report-bbm.dto';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportBbmService {
  constructor(
    @InjectRepository(RealisasiBulananBbm)
    private readonly realisasiBbmRepo: Repository<RealisasiBulananBbm>,
    @InjectRepository(Spbu)
    private readonly spbuRepo: Repository<Spbu>,
    @InjectRepository(JenisBbm)
    private readonly jenisBbmRepo: Repository<JenisBbm>,
  ) {}

  async generateMonthlyReport(dto: ReportBbmDto): Promise<{ buffer: Buffer; fileName: string }> {
    const { bulan, tahun } = dto;

    // Format bulan dengan leading zero (01, 02, ..., 12)
    const formattedBulan = bulan.toString().padStart(2, '0');

    // Ambil data realisasi BBM untuk bulan dan tahun tertentu
    const realisasiData = await this.realisasiBbmRepo.find({
      where: { 
        bulan: formattedBulan, 
        tahun: tahun.toString() 
      },
      relations: [
        'spbu',
        'spbu.kecamatan',
        'spbu.kelurahan',
        'jenisBbm'
      ],
      order: { 
        spbu: { no_spbu: 'ASC' },
        jenisBbm: { jenis_bbm: 'ASC' }
      }
    });

    // Group data by SPBU
    const spbuDataMap = new Map<number, any>();
    
    realisasiData.forEach(item => {
      const spbuId = item.spbu.id_spbu;
      const spbu = item.spbu;
      
      if (!spbuDataMap.has(spbuId)) {
        spbuDataMap.set(spbuId, {
          no_spbu: spbu.no_spbu,
          nama_usaha: spbu.nama_usaha,
          alamat: spbu.alamat,
          bbmDetails: []
        });
      }
      
      spbuDataMap.get(spbuId).bbmDetails.push({
        jenis_bbm: item.jenisBbm.jenis_bbm,
        realisasi_liter: item.realisasi_liter
      });
    });

    // Buat workbook Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan BBM Bulanan');

    // Header utama
    worksheet.addRow(['PENYALURAN BAHAN BAKAR MINYAK']);
    worksheet.addRow([`BULAN ${this.getMonthName(bulan).toUpperCase()} TAHUN ${tahun}`]);
    worksheet.addRow([]);

    // Style header utama
    worksheet.getRow(1).font = { bold: true, size: 14 };
    worksheet.getRow(2).font = { bold: true, size: 12 };
    worksheet.getRow(1).alignment = { horizontal: 'center' };
    worksheet.getRow(2).alignment = { horizontal: 'center' };

    // Merge cells untuk header
    worksheet.mergeCells('A1:E1');
    worksheet.mergeCells('A2:E2');

    // Header tabel
    const headerRow = worksheet.addRow(['NO', 'NOMOR SPBU', 'ALAMAT', 'JENIS BBM', 'Realisasi Penyaluran (liter)']);
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
    let rowNumber = 1;
    let currentRowIndex = 5; // Starting after header rows
    spbuDataMap.forEach((spbuData) => {
      const startRowForSpbu = currentRowIndex;
      
      spbuData.bbmDetails.forEach((bbmDetail, index) => {
        const row = [
          index === 0 ? rowNumber : '', // Nomor urut hanya di baris pertama
          index === 0 ? spbuData.no_spbu : '', // Nomor SPBU hanya di baris pertama
          index === 0 ? spbuData.alamat : '', // Alamat hanya di baris pertama
          bbmDetail.jenis_bbm,
          bbmDetail.realisasi_liter > 0 ? bbmDetail.realisasi_liter.toLocaleString('id-ID') : '0'
        ];
        const addedRow = worksheet.addRow(row);
        currentRowIndex++;
        
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
      
      // Add thick bottom border for the last row of each SPBU group
      const lastRowOfSpbu = worksheet.getRow(currentRowIndex - 1);
      lastRowOfSpbu.eachCell((cell) => {
        cell.border = {
          ...cell.border,
          bottom: { style: 'thick' }
        };
      });
      
      rowNumber++;
    });

    // Auto-fit columns
    worksheet.getColumn(1).width = 5;  // NO
    worksheet.getColumn(2).width = 15; // NOMOR SPBU
    worksheet.getColumn(3).width = 30; // ALAMAT
    worksheet.getColumn(4).width = 15; // JENIS BBM
    worksheet.getColumn(5).width = 20; // Realisasi

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `Laporan_BBM_${this.getMonthName(bulan)}_${tahun}.xlsx`;

    return { buffer: Buffer.from(buffer), fileName };
  }

  async generateYearlyReport(dto: ReportBbmYearlyDto): Promise<{ buffer: Buffer; fileName: string }> {
    const { tahun } = dto;

    // Ambil semua SPBU
    const allSpbu = await this.spbuRepo.find({
      order: { no_spbu: 'ASC' }
    });

    // Ambil semua jenis BBM
    const allJenisBbm = await this.jenisBbmRepo.find({
      order: { jenis_bbm: 'ASC' }
    });

    // Ambil data realisasi untuk tahun tertentu
    const realisasiData = await this.realisasiBbmRepo.find({
      where: { 
        tahun: tahun.toString() 
      },
      relations: [
        'spbu',
        'jenisBbm'
      ]
    });

    // Group data by SPBU
    const spbuGroupedData = new Map<string, any>();
    
    // Initialize SPBU data without jenis BBM first
    allSpbu.forEach(spbu => {
      spbuGroupedData.set(spbu.id_spbu.toString(), {
        no_spbu: spbu.no_spbu,
        nama_usaha: spbu.nama_usaha,
        alamat: spbu.alamat,
        jenisBbm: new Map<string, any>()
      });
    });

    // Fill realisasi data and create jenis BBM entries only when there's data
    realisasiData.forEach(item => {
      const spbuData = spbuGroupedData.get(item.spbu.id_spbu.toString());
      if (spbuData) {
        const jenisBbmId = item.jenisBbm.id_jenis_bbm.toString();
        let jenisBbmData = spbuData.jenisBbm.get(jenisBbmId);
        
        // Create jenis BBM entry if it doesn't exist
        if (!jenisBbmData) {
          jenisBbmData = {
            jenis_bbm: item.jenisBbm.jenis_bbm,
            monthly: Array(12).fill(0), // 12 bulan
            total: 0
          };
          spbuData.jenisBbm.set(jenisBbmId, jenisBbmData);
        }
        
        const bulanIndex = parseInt(item.bulan) - 1;
        jenisBbmData.monthly[bulanIndex] = parseFloat(item.realisasi_liter.toString());
        jenisBbmData.total += parseFloat(item.realisasi_liter.toString());
      }
    });
    
    // Add all jenis BBM to SPBU that have data, ensuring complete coverage
    spbuGroupedData.forEach((spbuData) => {
      if (spbuData.jenisBbm.size > 0) {
        // For SPBU with data, add missing jenis BBM with zero values
        allJenisBbm.forEach(jenisBbm => {
          const jenisBbmId = jenisBbm.id_jenis_bbm.toString();
          if (!spbuData.jenisBbm.has(jenisBbmId)) {
            spbuData.jenisBbm.set(jenisBbmId, {
              jenis_bbm: jenisBbm.jenis_bbm,
              monthly: Array(12).fill(0),
              total: 0
            });
          }
        });
      }
    });

    // Buat workbook Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan BBM Tahunan');

    // Header utama
    worksheet.addRow(['PENYALURAN BAHAN BAKAR MINYAK (Liter)']);
    worksheet.addRow([`TAHUN ${tahun}`]);
    worksheet.addRow([]);

    // Style header utama
    worksheet.getRow(1).font = { bold: true, size: 14 };
    worksheet.getRow(2).font = { bold: true, size: 12 };
    worksheet.getRow(1).alignment = { horizontal: 'center' };
    worksheet.getRow(2).alignment = { horizontal: 'center' };

    // Merge cells untuk header
    worksheet.mergeCells('A1:Q1');
    worksheet.mergeCells('A2:Q2');

    // Header tabel
    const headerRow = worksheet.addRow([
      'NO', 'NOMOR SPBU', 'ALAMAT', 'JENIS BBM',
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
    let spbuIndex = 1;
    let currentRowIndex = 5; // Starting after header rows
    spbuGroupedData.forEach((spbuData) => {
      // Skip SPBU that have no data
      if (spbuData.jenisBbm.size === 0) return;
      
      let isFirstRowForSpbu = true;
      
      spbuData.jenisBbm.forEach((jenisBbmData) => {
        const row = [
          isFirstRowForSpbu ? spbuIndex : '', // NO hanya di baris pertama SPBU
          isFirstRowForSpbu ? spbuData.no_spbu : '', // NOMOR SPBU hanya di baris pertama
          isFirstRowForSpbu ? spbuData.alamat : '', // ALAMAT hanya di baris pertama
          jenisBbmData.jenis_bbm,
          ...jenisBbmData.monthly.map(val => val > 0 ? val.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 3 }) : '0'),
          jenisBbmData.total > 0 ? jenisBbmData.total.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 3 }) : '0'
        ];
        const addedRow = worksheet.addRow(row);
        currentRowIndex++;
        
        // Add borders to all cells
        addedRow.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
        
        isFirstRowForSpbu = false;
      });
      
      // Add thick bottom border for the last row of each SPBU group
      const lastRowOfSpbu = worksheet.getRow(currentRowIndex - 1);
      lastRowOfSpbu.eachCell((cell) => {
        cell.border = {
          ...cell.border,
          bottom: { style: 'thick' }
        };
      });
      
      spbuIndex++;
    });

    // Auto-fit columns
    worksheet.getColumn(1).width = 5;  // NO
    worksheet.getColumn(2).width = 15; // NOMOR SPBU
    worksheet.getColumn(3).width = 30; // ALAMAT
    worksheet.getColumn(4).width = 15; // JENIS BBM
    // Bulan columns
    for (let i = 5; i <= 16; i++) {
      worksheet.getColumn(i).width = 12;
    }
    worksheet.getColumn(17).width = 15; // TOTAL

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `Laporan_BBM_Tahunan_${tahun}.xlsx`;

    return { buffer: Buffer.from(buffer), fileName };
  }

  private getMonthName(bulan: number): string {
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return monthNames[bulan - 1] || 'Unknown';
  }
}