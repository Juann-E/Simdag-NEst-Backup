import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealisasiBulananBbmService } from './realisasi-bulanan-bbm.service';
import { RealisasiBulananBbmController } from './realisasi-bulanan-bbm.controller';
import { RealisasiBulananBbm } from './realisasi-bulanan-bbm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RealisasiBulananBbm])],
  controllers: [RealisasiBulananBbmController],
  providers: [RealisasiBulananBbmService],
  exports: [RealisasiBulananBbmService],
})
export class RealisasiBulananBbmModule {}