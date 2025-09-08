import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealisasiBulananLpg, RealisasiBulananLpgMain } from './realisasi-bulanan-lpg.entity';
import { Agen } from '../../SPBU_LPG/Agen/agen.entity';
import { RealisasiBulananLpgService } from './realisasi-bulanan-lpg.service';
import { RealisasiBulananLpgController } from './realisasi-bulanan-lpg.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RealisasiBulananLpg, RealisasiBulananLpgMain, Agen])],
  controllers: [RealisasiBulananLpgController],
  providers: [RealisasiBulananLpgService],
  exports: [RealisasiBulananLpgService],
})
export class RealisasiBulananLpgModule {}