import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportAgenLpgController } from './report-agen-lpg.controller';
import { ReportAgenLpgService } from './report-agen-lpg.service';
import { RealisasiBulananLpg, RealisasiBulananLpgMain } from '../Realisasi LPG/realisasi-bulanan-lpg.entity';
import { Agen } from '../../SPBU_LPG/Agen/agen.entity';
import { ChartService } from '../../../common/services/chart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RealisasiBulananLpg,
      RealisasiBulananLpgMain,
      Agen,
    ]),
  ],
  controllers: [ReportAgenLpgController],
  providers: [ReportAgenLpgService, ChartService],
  exports: [ReportAgenLpgService],
})
export class ReportAgenLpgModule {}