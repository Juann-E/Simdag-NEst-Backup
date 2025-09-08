import { Module } from '@nestjs/common';
import { JenisBbmModule } from './JenisBbm/jenis-bbm.module';
import { RealisasiBulananLpgModule } from './Realisasi LPG/realisasi-bulanan-lpg.module';
import { RealisasiBulananBbmModule } from './Realisasi BBM/realisasi-bulanan-bbm.module';
import { ReportAgenLpgModule } from './Report Agen LPG/report-agen-lpg.module';
import { ReportBbmModule } from './Report BBM/report-bbm.module';

@Module({
  imports: [
    JenisBbmModule,
    RealisasiBulananLpgModule,
    RealisasiBulananBbmModule,
    ReportAgenLpgModule,
    ReportBbmModule,
  ],
  exports: [
    JenisBbmModule,
    RealisasiBulananLpgModule,
    RealisasiBulananBbmModule,
    ReportAgenLpgModule,
    ReportBbmModule,
  ],
})
export class BbmModule {}