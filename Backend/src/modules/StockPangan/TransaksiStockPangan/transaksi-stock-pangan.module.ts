import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransaksiStockPanganService } from './transaksi-stock-pangan.service';
import { TransaksiStockPanganController } from './transaksi-stock-pangan.controller';
import { TransaksiStockPangan } from './transaksi-stock-pangan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransaksiStockPangan])],
  controllers: [TransaksiStockPanganController],
  providers: [TransaksiStockPanganService],
  exports: [TransaksiStockPanganService],
})
export class TransaksiStockPanganModule {}