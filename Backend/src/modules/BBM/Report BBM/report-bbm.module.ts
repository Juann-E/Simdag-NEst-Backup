import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportBbmController } from './report-bbm.controller';
import { ReportBbmService } from './report-bbm.service';
import { RealisasiBulananBbm } from '../Realisasi BBM/realisasi-bulanan-bbm.entity';
import { Spbu } from '../../SPBU_LPG/SPBU/spbu.entity';
import { JenisBbm } from '../JenisBbm/jenis-bbm.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RealisasiBulananBbm,
      Spbu,
      JenisBbm,
    ]),
  ],
  controllers: [ReportBbmController],
  providers: [ReportBbmService],
  exports: [ReportBbmService],
})
export class ReportBbmModule {}