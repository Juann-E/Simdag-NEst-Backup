// backend/src/modules/public/public.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { NamaPasar } from '../../modules/Kepokmas/nama-pasar/nama-pasar.entity';
import { HargaBarangPasar } from '../../modules/Kepokmas/harga-barang-grid/harga-barang-pasar.entity';
import { Spbu } from '../../modules/SPBU_LPG/SPBU/spbu.entity';
import { Agen } from '../../modules/SPBU_LPG/Agen/agen.entity';
import { PangkalanLpg } from '../../modules/SPBU_LPG/PangkalanLpg/pangkalan-lpg.entity';
import { Spbe } from '../../modules/SPBU_LPG/Spbe/spbe.entity';
import { Distributor } from '../../modules/StockPangan/Distributor/distributor.entity';
import { NamaBarang } from '../../modules/Kepokmas/nama-barang/nama-barang.entity';
import { KomoditasStockPangan } from '../../modules/StockPangan/Komoditas/komoditas.entity';
import { TransaksiStockPangan } from '../../modules/StockPangan/TransaksiStockPangan/transaksi-stock-pangan.entity';

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(NamaPasar)
    private readonly pasarRepo: Repository<NamaPasar>,
    @InjectRepository(HargaBarangPasar)
    private readonly hargaRepo: Repository<HargaBarangPasar>,
    @InjectRepository(Spbu)
    private readonly spbuRepo: Repository<Spbu>,
    @InjectRepository(Agen)
    private readonly agenRepo: Repository<Agen>,
    @InjectRepository(PangkalanLpg)
    private readonly pangkalanLpgRepo: Repository<PangkalanLpg>,
    @InjectRepository(Spbe)
    private readonly spbeRepo: Repository<Spbe>,
    @InjectRepository(Distributor)
    private readonly distributorRepo: Repository<Distributor>,
    @InjectRepository(NamaBarang)
    private readonly namaBarangRepo: Repository<NamaBarang>,
    @InjectRepository(KomoditasStockPangan)
    private readonly komoditasStockPanganRepo: Repository<KomoditasStockPangan>,
    @InjectRepository(TransaksiStockPangan)
    private readonly transaksiStockPanganRepo: Repository<TransaksiStockPangan>,
  ) {}

  /**
   * Mengambil semua data harga dengan relasi yang dibutuhkan oleh chart di frontend.
   */
  async findAllPrices(): Promise<HargaBarangPasar[]> {
    return this.hargaRepo.find({
      relations: ['barangPasar', 'barangPasar.pasar', 'barangPasar.barang'],
      order: { time_stamp: 'DESC' }, // Mengurutkan untuk performa query yang lebih baik
    });
  }

  /**
   * Mengambil semua daftar pasar.
   */
  async findAllMarkets(): Promise<NamaPasar[]> {
    return this.pasarRepo.find();
  }

  /**
   * Mengambil data harga hari ini dan kemarin untuk pasar tertentu.
   */
  async findPricesForMarket(marketId: number) {
    const allPrices = await this.hargaRepo.find({
      where: { barangPasar: { pasar: { id: marketId } } },
      relations: ['barangPasar', 'barangPasar.barang', 'barangPasar.barang.satuan', 'barangPasar.pasar'],
      order: { tanggal_harga: 'DESC' },
    });
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const commodityMap = new Map<string, any>();
    allPrices.forEach(p => {
      const itemName = p.barangPasar.barang.namaBarang;
      const priceDate = new Date(p.tanggal_harga).toISOString().split('T')[0];
      if (!commodityMap.has(itemName)) {
        commodityMap.set(itemName, {
          name: itemName,
          unit: p.barangPasar.barang.satuan?.satuanBarang || 'N/A',
          gambar: p.barangPasar.barang.gambar,
          priceToday: 0,
          priceYesterday: 0,
        });
      }
      const commodity = commodityMap.get(itemName)!;
      if (priceDate === today && commodity.priceToday === 0) commodity.priceToday = p.harga;
      if (priceDate === yesterday && commodity.priceYesterday === 0) commodity.priceYesterday = p.harga;
    });
    commodityMap.forEach(commodity => {
      if (commodity.priceToday === 0) commodity.priceToday = commodity.priceYesterday;
    });
    return Array.from(commodityMap.values());
  }

  /**
   * Mengambil data yang sudah diproses untuk chart global (tanpa filter pasar).
   */
  async getChartData() {
    const allPrices = await this.hargaRepo.find({
      relations: ['barangPasar', 'barangPasar.pasar', 'barangPasar.barang'],
      order: { time_stamp: 'DESC' }
    });

    if (allPrices.length === 0) {
      return { chartData: [], chartLines: [] };
    }

    const recentDates = [...new Set(allPrices.map(p => p.tanggal_harga.toString().split('T')[0]))]
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        .slice(0, 7).reverse();

    const recentPrices = allPrices.filter(p => recentDates.includes(p.tanggal_harga.toString().split('T')[0]));
    
    const itemFrequency = new Map<string, number>();
    recentPrices.forEach(p => {
        const itemName = p.barangPasar?.barang?.namaBarang;
        if (itemName) {
            itemFrequency.set(itemName, (itemFrequency.get(itemName) || 0) + 1);
        }
    });

    const topItems = [...itemFrequency.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => entry[0]);

    const groupedByDate: { [key: string]: any } = {};
    recentDates.forEach(date => {
      groupedByDate[date] = { day: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) };
    });

    recentPrices.forEach(p => {
      const date = p.tanggal_harga.toString().split('T')[0];
      const itemName = p.barangPasar?.barang?.namaBarang;
      if (groupedByDate[date] && topItems.includes(itemName)) {
        if (!groupedByDate[date][itemName]) {
            groupedByDate[date][itemName] = p.harga;
        }
      }
    });
    
    const formattedChartData = Object.values(groupedByDate);
    
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];
    const chartLines = topItems.map((key, index) => ({ key, color: colors[index % colors.length] }));

    return { chartData: formattedChartData, chartLines };
  }

  /**
   * Mengambil statistik dashboard untuk admin
   */
  async getDashboardStats() {
    const [marketCount, spbuCount, agenCount, pangkalanLpgCount, spbeCount, distributorCount, komoditasKepokmasCount, komoditasStockPanganCount] = await Promise.all([
      this.pasarRepo.count(),
      this.spbuRepo.count(),
      this.agenRepo.count(),
      this.pangkalanLpgRepo.count(),
      this.spbeRepo.count(),
      this.distributorRepo.count(),
      this.namaBarangRepo.count(),
      this.komoditasStockPanganRepo.count(),
    ]);

    return {
      markets: marketCount,
      spbu: spbuCount,
      agen: agenCount,
      pangkalanLpg: pangkalanLpgCount,
      spbe: spbeCount,
      distributors: distributorCount,
      komoditasKepokmas: komoditasKepokmasCount,
      komoditasStockPangan: komoditasStockPanganCount,
    };
  }

  /**
   * Mengambil statistik Stock Pangan untuk dashboard khusus
   */
  async getStockPanganStats() {
    const [distributorCount, komoditasCount, transaksiCount, totalStockAwal, totalPengadaan, totalPenyaluran] = await Promise.all([
      this.distributorRepo.count(),
      this.komoditasStockPanganRepo.count(),
      this.transaksiStockPanganRepo.count(),
      this.transaksiStockPanganRepo
        .createQueryBuilder('transaksi')
        .select('SUM(transaksi.stock_awal)', 'total')
        .getRawOne()
        .then(result => parseInt(result.total) || 0),
      this.transaksiStockPanganRepo
        .createQueryBuilder('transaksi')
        .select('SUM(transaksi.pengadaan)', 'total')
        .getRawOne()
        .then(result => parseInt(result.total) || 0),
      this.transaksiStockPanganRepo
        .createQueryBuilder('transaksi')
        .select('SUM(transaksi.penyaluran)', 'total')
        .getRawOne()
        .then(result => parseInt(result.total) || 0),
    ]);

    const stockAkhir = totalStockAwal + totalPengadaan - totalPenyaluran;

    return {
      distributors: distributorCount,
      komoditas: komoditasCount,
      transaksi: transaksiCount,
      stockAwal: totalStockAwal,
      pengadaan: totalPengadaan,
      penyaluran: totalPenyaluran,
      stockAkhir: stockAkhir,
    };
  }

  /**
   * Mengambil data chart Stock Pangan berdasarkan transaksi bulanan
   */
  async getStockPanganChartData() {
    const allTransaksi = await this.transaksiStockPanganRepo.find({
      relations: ['komoditas', 'distributor'],
      order: { tahun: 'DESC', bulan: 'DESC' }
    });

    if (allTransaksi.length === 0) {
      return { chartData: [], chartLines: [] };
    }

    // Ambil 6 bulan terakhir berdasarkan tahun dan bulan
    const monthlyData = new Map<string, any>();
    allTransaksi.forEach(t => {
      const monthKey = `${t.tahun}-${t.bulan.toString().padStart(2, '0')}`;
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          tahun: t.tahun,
          bulan: t.bulan,
          transaksi: []
        });
      }
      monthlyData.get(monthKey).transaksi.push(t);
    });

    // Ambil 6 bulan terakhir
    const recentMonths = [...monthlyData.keys()]
        .sort((a, b) => b.localeCompare(a))
        .slice(0, 6)
        .reverse();

    const recentTransaksi = recentMonths.flatMap(monthKey => monthlyData.get(monthKey).transaksi);
    
    // Hitung frekuensi komoditas untuk menentukan top 5
    const komoditasFrequency = new Map<string, number>();
    recentTransaksi.forEach(t => {
        const komoditasName = t.komoditas?.komoditas;
        if (komoditasName) {
            komoditasFrequency.set(komoditasName, (komoditasFrequency.get(komoditasName) || 0) + 1);
        }
    });

    const topKomoditas = [...komoditasFrequency.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => entry[0]);

    // Kelompokkan data berdasarkan bulan
    const groupedByMonth: { [key: string]: any } = {};
    const bulanNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    recentMonths.forEach(monthKey => {
      const monthData = monthlyData.get(monthKey);
      const monthLabel = `${bulanNames[monthData.bulan - 1]} ${monthData.tahun}`;
      groupedByMonth[monthKey] = { month: monthLabel };
    });

    // Agregasi data per bulan dan komoditas (total stock akhir)
    recentTransaksi.forEach(t => {
      const monthKey = `${t.tahun}-${t.bulan.toString().padStart(2, '0')}`;
      const komoditasName = t.komoditas?.komoditas;
      if (groupedByMonth[monthKey] && topKomoditas.includes(komoditasName)) {
        const stockAkhir = (t.stock_awal || 0) + (t.pengadaan || 0) - (t.penyaluran || 0);
        if (!groupedByMonth[monthKey][komoditasName]) {
            groupedByMonth[monthKey][komoditasName] = stockAkhir;
        } else {
            groupedByMonth[monthKey][komoditasName] += stockAkhir;
        }
      }
    });
    
    const formattedChartData = recentMonths.map(monthKey => groupedByMonth[monthKey]);
    
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];
    const chartLines = topKomoditas.map((key, index) => ({ key, color: colors[index % colors.length] }));

    return { chartData: formattedChartData, chartLines };
  }

  /**
   * Mengambil semua data lokasi untuk peta dengan koordinat
   */
  async getAllLocations() {
     const [markets, spbu, agen, pangkalanLpg, spbe, distributors] = await Promise.all([
       this.pasarRepo.createQueryBuilder('pasar')
         .where('pasar.latitude IS NOT NULL')
         .andWhere('pasar.longitude IS NOT NULL')
         .getMany(),
       this.spbuRepo.createQueryBuilder('spbu')
         .where('spbu.latitude IS NOT NULL')
         .andWhere('spbu.longitude IS NOT NULL')
         .andWhere('spbu.status = :status', { status: 'Aktif' })
         .getMany(),
       this.agenRepo.createQueryBuilder('agen')
         .where('agen.latitude IS NOT NULL')
         .andWhere('agen.longitude IS NOT NULL')
         .andWhere('agen.status = :status', { status: 'Aktif' })
         .getMany(),
       this.pangkalanLpgRepo.createQueryBuilder('pangkalan')
         .where('pangkalan.latitude IS NOT NULL')
         .andWhere('pangkalan.longitude IS NOT NULL')
         .andWhere('pangkalan.status = :status', { status: 'Aktif' })
         .getMany(),
       this.spbeRepo.createQueryBuilder('spbe')
         .where('spbe.latitude IS NOT NULL')
         .andWhere('spbe.longitude IS NOT NULL')
         .andWhere('spbe.status = :status', { status: 'Aktif' })
         .getMany(),
       this.distributorRepo.createQueryBuilder('distributor')
         .where('distributor.latitude IS NOT NULL')
         .andWhere('distributor.longitude IS NOT NULL')
         .getMany()
     ]);

    return {
      markets: markets.map(item => ({
        id: item.id,
        name: item.nama_pasar,
        address: item.alamat,
        latitude: item.latitude,
        longitude: item.longitude,
        type: 'market'
      })),
      spbu: spbu.map(item => ({
        id: item.id_spbu,
        name: item.nama_usaha,
        address: item.alamat,
        latitude: item.latitude,
        longitude: item.longitude,
        type: 'spbu'
      })),
      agen: agen.map(item => ({
        id: item.id_agen,
        name: item.nama_usaha,
        address: item.alamat,
        latitude: item.latitude,
        longitude: item.longitude,
        type: 'agen'
      })),
      pangkalanLpg: pangkalanLpg.map(item => ({
        id: item.id_pangkalan_lpg,
        name: item.nama_usaha,
        address: item.alamat,
        latitude: item.latitude,
        longitude: item.longitude,
        type: 'pangkalan_lpg'
      })),
      spbe: spbe.map(item => ({
        id: item.id_spbe,
        name: item.nama_usaha,
        address: item.alamat,
        latitude: item.latitude,
        longitude: item.longitude,
        type: 'spbe'
      })),
      distributors: distributors.map(item => ({
        id: item.id,
        name: item.nama_distributor,
        address: item.alamat,
        latitude: item.latitude,
        longitude: item.longitude,
        type: 'distributor'
      }))
    };
  }

  /**
   * Mengambil semua data distributor stock pangan untuk halaman publik.
   */
  async findAllDistributors() {
    const distributors = await this.distributorRepo.find({
      select: ['id', 'nama_distributor', 'alamat', 'latitude', 'longitude']
    });

    return distributors.map(distributor => ({
      id: distributor.id,
      nama_distributor: distributor.nama_distributor,
      alamat: distributor.alamat,
      latitude: distributor.latitude,
      longitude: distributor.longitude,
      status: 'Aktif'
    }));
  }

  /**
   * Mengambil data stock bulanan untuk distributor tertentu.
   */
  async getDistributorStockMonthly(distributorId: number) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    // Ambil data transaksi 6 bulan terakhir
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const transaksi = await this.transaksiStockPanganRepo.find({
      where: {
        distributor: { id: distributorId },
        timeStamp: MoreThanOrEqual(sixMonthsAgo)
      },
      relations: ['distributor', 'komoditas'],
      order: { timeStamp: 'DESC' }
    });

    // Group data by month and komoditas
    const monthlyData = new Map<string, any>();
    
    transaksi.forEach(t => {
      const date = new Date(t.timeStamp);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const komoditasName = t.komoditas.komoditas;
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: monthKey,
          monthName: date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
          komoditas: new Map()
        });
      }
      
      const monthData = monthlyData.get(monthKey);
      if (!monthData.komoditas.has(komoditasName)) {
        monthData.komoditas.set(komoditasName, {
          nama_komoditas: komoditasName,
          total_stock_awal: 0,
          total_pengadaan: 0,
          total_penyaluran: 0,
          stock_akhir: 0
        });
      }
      
      const komoditasData = monthData.komoditas.get(komoditasName);
      komoditasData.total_stock_awal += Number(t.stockAwal) || 0;
      komoditasData.total_pengadaan += Number(t.pengadaan) || 0;
      komoditasData.total_penyaluran += Number(t.penyaluran) || 0;
      komoditasData.stock_akhir = komoditasData.total_stock_awal + komoditasData.total_pengadaan - komoditasData.total_penyaluran;
    });

    // Convert to array format
    const result = Array.from(monthlyData.values()).map(monthData => ({
      ...monthData,
      komoditas: Array.from(monthData.komoditas.values())
    }));

    return result.sort((a, b) => b.month.localeCompare(a.month));
  }
}