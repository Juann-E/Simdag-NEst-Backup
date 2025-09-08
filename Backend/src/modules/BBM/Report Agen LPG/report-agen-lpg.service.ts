// Backend/src/modules/BBM/Report Agen LPG/report-agen-lpg.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealisasiBulananLpg, RealisasiBulananLpgMain } from '../Realisasi LPG/realisasi-bulanan-lpg.entity';
import { Agen } from '../../SPBU_LPG/Agen/agen.entity';
import { ReportAgenLpgDto, ReportAgenLpgYearlyDto } from './dto/report-agen-lpg.dto';
import { ReportLpgExcelBuilder } from './utils/report-lpg.excel-builder';

@Injectable()
export class ReportAgenLpgService {
  private readonly excelBuilder: ReportLpgExcelBuilder;

  constructor(
    @InjectRepository(RealisasiBulananLpg)
    private readonly realisasiRepo: Repository<RealisasiBulananLpg>,
    @InjectRepository(RealisasiBulananLpgMain)
    private readonly realisasiMainRepo: Repository<RealisasiBulananLpgMain>,
    @InjectRepository(Agen)
    private readonly agenRepo: Repository<Agen>,
  ) {
    this.excelBuilder = new ReportLpgExcelBuilder();
  }

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
    const agenDataMap = await this.getProcessedYearlyData(dto);
    // Memanggil builder yang sudah stabil (dengan try-catch untuk grafik)
    return this.excelBuilder.buildYearlyReport(agenDataMap, dto);
  }

  // --- [BARU] Fungsi untuk memproses dan mengembalikan data sebagai JSON ---
  async generateYearlyReportData(dto: ReportAgenLpgYearlyDto) {
    const agenDataMap = await this.getProcessedYearlyData(dto);

    // Hitung total untuk summary
    const monthlyTotals = Array(12).fill(0);
    agenDataMap.forEach(data => data.monthly.forEach((val, i) => monthlyTotals[i] += val));
    const grandTotal = monthlyTotals.reduce((a, b) => a + b, 0);
    const kuotaTabung = parseInt(((dto.kuota_mt * 1000) / 3).toString());
    const sisaKuota = kuotaTabung - grandTotal;

    // Kembalikan data dalam format JSON yang rapi
    return {
      tableData: Array.from(agenDataMap.values()),
      summary: {
        monthlyTotals,
        grandTotal,
        kuotaTabung,
        sisaKuota,
      },
      reportInfo: {
        year: dto.tahun,
        kuotaMt: dto.kuota_mt,
      },
    };
  }

  // --- [BARU] Helper function untuk menghindari duplikasi kode ---
  private async getProcessedYearlyData(dto: ReportAgenLpgYearlyDto): Promise<Map<number, any>> {
    const { tahun } = dto;
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

    // Hitung ulang total setelah semua data bulanan diisi
    agenDataMap.forEach(agenData => {
      agenData.total = agenData.monthly.reduce((sum: number, current: number) => sum + current, 0);
    });

    return agenDataMap;
  }
}