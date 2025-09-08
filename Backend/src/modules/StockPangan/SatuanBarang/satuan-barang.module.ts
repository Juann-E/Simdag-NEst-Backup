import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SatuanBarangStockPangan } from './satuan-barang.entity';
import { SatuanBarangStockPanganService } from './satuan-barang.service';
import { SatuanBarangStockPanganController } from './satuan-barang.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SatuanBarangStockPangan])],
  controllers: [SatuanBarangStockPanganController],
  providers: [SatuanBarangStockPanganService],
  exports: [SatuanBarangStockPanganService]
})
export class SatuanBarangStockPanganModule {}