import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KomoditasStockPanganController } from './komoditas.controller';
import { KomoditasStockPanganService } from './komoditas.service';
import { KomoditasStockPangan } from './komoditas.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([KomoditasStockPangan]), 
  ],
  controllers: [KomoditasStockPanganController],
  providers: [KomoditasStockPanganService],
})
export class KomoditasStockPanganModule {}