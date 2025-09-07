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
    const { bulan, tahun } = dto;

    // 1. Fetch data
    const realisasiData = await this.realisasiRepo.find({
      where: { bulan: bulan, tahun: tahun },
      relations: ['realisasiMain', 'realisasiMain.agen'],
      order: { realisasiMain: { agen: { nama_usaha: 'ASC' } } },
    });

    // 2. Build Excel using the utility
    return this.excelBuilder.buildMonthlyReport(realisasiData, dto);
  }

  async generateYearlyReport(dto: ReportAgenLpgYearlyDto): Promise<{ buffer: Buffer; fileName: string }> {
    const { tahun } = dto;

    // 1. Fetch data
    const allAgen = await this.agenRepo.find({ order: { nama_usaha: 'ASC' } });
    const realisasiData = await this.realisasiRepo.find({
      where: { tahun: tahun },
      relations: ['realisasiMain', 'realisasiMain.agen'],
    });

    // 2. Process and map data
    const agenDataMap = new Map<number, any>();
    allAgen.forEach(agen => {
      agenDataMap.set(agen.id_agen, {
        nama_usaha: agen.nama_usaha,
        alamat: agen.alamat,
        monthly: Array(12).fill(0),
        total: 0,
      });
    });

    realisasiData.forEach(item => {
      const agenData = agenDataMap.get(item.realisasiMain.id_agen);
      if (agenData) {
        const bulanIndex = item.bulan - 1;
        agenData.monthly[bulanIndex] = item.realisasi_tabung;
        agenData.total += item.realisasi_tabung;
      }
    });

    // 3. Build Excel using the utility
    return this.excelBuilder.buildYearlyReport(agenDataMap, dto);
  }
}