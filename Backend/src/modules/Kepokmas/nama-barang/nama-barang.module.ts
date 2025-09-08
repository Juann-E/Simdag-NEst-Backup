import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NamaBarangController } from './nama-barang.controller';
import { NamaBarangService } from './nama-barang.service';
import { NamaBarang } from './nama-barang.entity';
import { SatuanBarang } from '../satuan-barang/satuan-barang.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NamaBarang, SatuanBarang]), 
  ],
  controllers: [NamaBarangController],
  providers: [NamaBarangService],
})
export class NamaBarangModule {}
