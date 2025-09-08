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
    const { tahun } = dto;

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

    // 3. Build Excel using the utility
    return this.excelBuilder.buildYearlyReport(agenDataMap, dto);
  }
}