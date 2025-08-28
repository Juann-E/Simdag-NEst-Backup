import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kelurahan } from './kelurahan.entity';
import { Kecamatan } from '../Kecamatan/kecamatan.entity';
import { KelurahanService } from './kelurahan.service';
import { KelurahanController } from './kelurahan.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Kelurahan, Kecamatan]) // <-- Tambahkan Kecamatan di sini
  ],
  controllers: [KelurahanController],
  providers: [KelurahanService],
  exports: [KelurahanService],
})
export class KelurahanModule {}
