import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportStockPanganController } from './report.controller';
import { ReportStockPanganService } from './report.service';
import { TransaksiStockPangan } from '../../StockPangan/TransaksiStockPangan/transaksi-stock-pangan.entity';
import { KomoditasStockPangan } from '../../StockPangan/Komoditas/komoditas.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransaksiStockPangan,
      KomoditasStockPangan,
    ]),
  ],
  controllers: [ReportStockPanganController],
  providers: [ReportStockPanganService],
  exports: [ReportStockPanganService],
})
export class ReportStockPanganModule {}