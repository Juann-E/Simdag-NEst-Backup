import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarangPasarGridController } from './barang-pasar-grid.controller';
import { BarangPasarGridService } from './barang-pasar-grid.service';
import { BarangPasarGrid } from './barang-pasar-grid.entity';
import { NamaPasar } from '../nama-pasar/nama-pasar.entity';
import { NamaBarang } from '../nama-barang/nama-barang.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BarangPasarGrid, NamaPasar, NamaBarang])],
  controllers: [BarangPasarGridController],
  providers: [BarangPasarGridService],
})
export class BarangPasarGridModule {}
