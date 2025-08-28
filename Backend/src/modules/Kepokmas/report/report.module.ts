import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { HargaBarangPasar } from '../harga-barang-grid/harga-barang-pasar.entity';
import { BarangPasarGrid } from '../barang-pasar-grid/barang-pasar-grid.entity';
import { NamaPasar } from '../nama-pasar/nama-pasar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HargaBarangPasar, BarangPasarGrid, NamaPasar])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
