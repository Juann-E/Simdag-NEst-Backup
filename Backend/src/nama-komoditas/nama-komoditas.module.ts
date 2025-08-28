import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NamaKomoditasService } from './nama-komoditas.service';
import { NamaKomoditasController } from './nama-komoditas.controller';
import { NamaKomoditas } from './nama-komoditas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NamaKomoditas])],
  controllers: [NamaKomoditasController],
  providers: [NamaKomoditasService],
  exports: [NamaKomoditasService],
})
export class NamaKomoditasModule {}