import { Module } from '@nestjs/common';
import { DistributorModule } from '../StockPangan/Distributor/distributor.module';
import { KomoditasStockPanganModule } from '../StockPangan/Komoditas/komoditas.module';
import { SatuanBarangStockPanganModule } from '../StockPangan/SatuanBarang/satuan-barang.module';
import { NamaKomoditasModule } from '../../nama-komoditas/nama-komoditas.module';
import { TransaksiStockPanganModule } from '../StockPangan/TransaksiStockPangan/transaksi-stock-pangan.module';
import { ReportStockPanganModule } from './report/report.module';

@Module({
  imports: [
    DistributorModule,
    KomoditasStockPanganModule,
    SatuanBarangStockPanganModule,
    NamaKomoditasModule,
    TransaksiStockPanganModule,
    ReportStockPanganModule,
  ],
  exports: [
    DistributorModule,
    KomoditasStockPanganModule,
    SatuanBarangStockPanganModule,
    NamaKomoditasModule,
    TransaksiStockPanganModule,
    ReportStockPanganModule,
  ],
})
export class StockPanganModule {}