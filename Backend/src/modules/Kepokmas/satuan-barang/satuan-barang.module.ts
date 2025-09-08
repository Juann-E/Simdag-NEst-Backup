import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SatuanBarang } from './satuan-barang.entity';
import { SatuanBarangService } from './satuan-barang.service';
import { SatuanBarangController } from './satuan-barang.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SatuanBarang])],
  controllers: [SatuanBarangController],
  providers: [SatuanBarangService],
})
export class SatuanBarangModule {}
