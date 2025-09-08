// backend/src/modules/public/public.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { NamaPasar } from '../../modules/Kepokmas/nama-pasar/nama-pasar.entity';
import { HargaBarangPasar } from '../../modules/Kepokmas/harga-barang-grid/harga-barang-pasar.entity';
import { BarangPasarGrid } from '../../modules/Kepokmas/barang-pasar-grid/barang-pasar-grid.entity';
import { Spbu } from '../../modules/SPBU_LPG/SPBU/spbu.entity';
import { Agen } from '../../modules/SPBU_LPG/Agen/agen.entity';
import { PangkalanLpg } from '../../modules/SPBU_LPG/PangkalanLpg/pangkalan-lpg.entity';
import { Spbe } from '../../modules/SPBU_LPG/Spbe/spbe.entity';
import { Distributor } from '../../modules/StockPangan/Distributor/distributor.entity';
import { NamaBarang } from '../../modules/Kepokmas/nama-barang/nama-barang.entity';
import { KomoditasStockPangan } from '../../modules/StockPangan/Komoditas/komoditas.entity';
import { TransaksiStockPangan } from '../../modules/StockPangan/TransaksiStockPangan/transaksi-stock-pangan.entity';
import { RealisasiBulananLpg, RealisasiBulananLpgMain } from '../../modules/BBM/Realisasi LPG/realisasi-bulanan-lpg.entity';
import { RealisasiBulananBbm, RealisasiBulananBbmDetail } from '../../modules/BBM/Realisasi BBM/realisasi-bulanan-bbm.entity';
import { JenisBbm } from '../../modules/BBM/JenisBbm/jenis-bbm.entity';
import { ReportAgenLpgModule } from '../../modules/BBM/Report Agen LPG/report-agen-lpg.module';
import { ReportAgenLpgController } from '../../modules/BBM/Report Agen LPG/report-agen-lpg.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([NamaPasar, HargaBarangPasar, BarangPasarGrid, Spbu, Agen, PangkalanLpg, Spbe, Distributor, NamaBarang, KomoditasStockPangan, TransaksiStockPangan, RealisasiBulananLpg, RealisasiBulananLpgMain, RealisasiBulananBbm, RealisasiBulananBbmDetail, JenisBbm]),
    ReportAgenLpgModule,
  ],
  controllers: [PublicController, ReportAgenLpgController],
  providers: [PublicService],
})
export class PublicModule {}