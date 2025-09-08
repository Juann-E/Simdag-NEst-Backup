import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { TransaksiStockPangan } from '../../StockPangan/TransaksiStockPangan/transaksi-stock-pangan.entity';
import { KomoditasStockPangan } from '../../StockPangan/Komoditas/komoditas.entity';
import { ExcelBuilderStockPangan } from './utils/excel-builder';
import { ReportStockPanganDto, MonthlyReportDto } from './dto/report.dto';

@Injectable()
export class ReportStockPanganService {
  constructor(
    @InjectRepository(TransaksiStockPangan)
    private readonly transaksiRepo: Repository<TransaksiStockPangan>,
    @InjectRepository(KomoditasStockPangan)
    private readonly komoditasRepo: Repository<KomoditasStockPangan>,
  ) {}

  // Mengatur waktu ke awal hari (00:00:00) berdasarkan timezone server.
  private parseStartDate(date?: string): Date | undefined {
    if (!date) return undefined;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // Mengatur waktu ke akhir hari (23:59:59) berdasarkan timezone server.
  private parseEndDate(date?: string): Date | undefined {
    if (!date) return undefined;
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  async generateJson(dto: ReportStockPanganDto) {
    const { komoditasIds, tahun, bulan, start, end } = dto;

    const where: any = {};

    // Filter berdasarkan rentang tanggal jika ada
    if (start && end) {
      where.timeStamp = Between(this.parseStartDate(start), this.parseEndDate(end));
    }

    // Filter berdasarkan tahun
    if (tahun) {
      where.tahun = tahun;
    }

    // Filter berdasarkan bulan
    if (bulan) {
      where.bulan = bulan;
    }

    // Filter berdasarkan komoditas
    if (komoditasIds.length) {
      where.komoditas = { id: In(komoditasIds) };
    }

    const transaksiList = await this.transaksiRepo.find({
      where,
      relations: ['komoditas', 'distributor'],
      order: { tahun: 'DESC', bulan: 'DESC' },
    });

    return transaksiList.map((t) => ({
      id: t.idTransaksi,
      tahun: t.tahun,
      bulan: t.bulan,
      komoditas: t.komoditas.komoditas,
      distributor: t.distributor.nama_distributor,
      stock_awal: t.stockAwal,
      pengadaan: t.pengadaan,
      penyaluran: t.penyaluran,
      keterangan: t.keterangan,
      created_at: t.timeStamp,
    }));
  }

  async generateExcel(dto: ReportStockPanganDto): Promise<{ buffer: Buffer; fileName: string }> {
    const { komoditasIds, tahun, bulan, start, end } = dto;
    const transaksiList = await this.generateJson(dto);

    // Tentukan nama komoditas untuk judul
    let komoditasName = 'Semua Komoditas';
    if (komoditasIds.length === 1) {
      const komoditas = await this.komoditasRepo.findOne({ where: { id: komoditasIds[0] } });
      if (komoditas) {
        komoditasName = komoditas.komoditas;
      }
    } else if (komoditasIds.length > 1) {
      komoditasName = `Komoditas Terpilih (${komoditasIds.length} item)`;
    }

    // Tentukan periode untuk judul
    let periode = '';
    if (start && end) {
      periode = `${start} - ${end}`;
    } else if (tahun && bulan) {
      periode = `${bulan}/${tahun}`;
    } else if (tahun) {
      periode = `Tahun ${tahun}`;
    } else {
      periode = 'Semua Periode';
    }

    // Nama file
    const komoditasNameForFile = komoditasName.replace(/ /g, '_').toLowerCase();
    const today = new Date().toISOString().split('T')[0];
    const fileName = `laporan_stock_pangan_${komoditasNameForFile}_${today}.xlsx`;

    const buffer = await ExcelBuilderStockPangan.buildExcel(
      komoditasName,
      periode,
      periode,
      transaksiList,
    );

    return { buffer, fileName };
  }

  async generateMonthlyExcel(dto: MonthlyReportDto): Promise<{ buffer: Buffer; fileName: string }> {
    const { tahun, bulan } = dto;
    
    if (!tahun || !bulan) {
      throw new Error('Tahun dan bulan harus diisi');
    }

    // Ambil semua transaksi untuk bulan dan tahun yang diminta
    const transaksiList = await this.transaksiRepo.find({
      where: { tahun, bulan },
      relations: ['komoditas', 'distributor'],
      order: { komoditas: { komoditas: 'ASC' }, distributor: { nama_distributor: 'ASC' } },
    });

    // Group data berdasarkan komoditas
    const groupedData = this.groupByKomoditas(transaksiList);

    // Nama file
    const fileName = `data_stock_pangan_${String(bulan).padStart(2, '0')}_${tahun}.xlsx`;

    const buffer = await ExcelBuilderStockPangan.buildMonthlyExcel(
      bulan,
      tahun,
      groupedData,
    );

    return { buffer, fileName };
  }

  private groupByKomoditas(transaksiList: any[]) {
    const grouped = {};
    
    transaksiList.forEach(transaksi => {
      const komoditasName = transaksi.komoditas.komoditas;
      const satuan = transaksi.komoditas.satuan;
      
      if (!grouped[komoditasName]) {
        grouped[komoditasName] = {
          komoditas: komoditasName,
          satuan: satuan,
          data: [],
          totals: {
            stockAwal: 0,
            pengadaan: 0,
            penyaluran: 0,
            stockAkhir: 0
          }
        };
      }
      
      const stockAwal = Number(transaksi.stockAwal) || 0;
      const pengadaan = Number(transaksi.pengadaan) || 0;
      const penyaluran = Number(transaksi.penyaluran) || 0;
      const stockAkhir = stockAwal + pengadaan - penyaluran;
      
      const dataItem = {
        distributor: transaksi.distributor.nama_distributor,
        stockAwal: stockAwal,
        pengadaan: pengadaan,
        penyaluran: penyaluran,
        stockAkhir: stockAkhir,
        satuan: satuan
      };
      
      grouped[komoditasName].data.push(dataItem);
      
      // Update totals
      grouped[komoditasName].totals.stockAwal += stockAwal;
      grouped[komoditasName].totals.pengadaan += pengadaan;
      grouped[komoditasName].totals.penyaluran += penyaluran;
      grouped[komoditasName].totals.stockAkhir += stockAkhir;
    });
    
    return Object.values(grouped);
  }
}