// update-nama-barang.dto.ts

import { IsOptional, IsString, MaxLength, IsNumber } from 'class-validator';
import { Type } from 'class-transformer'; // 1. Import 'Type'

export class UpdateNamaBarangDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  namaBarang?: string;

  @IsOptional()
  @Type(() => Number) // 2. Tambahkan dekorator ini
  @IsNumber()
  idSatuan?: number;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsOptional()
  @IsString()
  gambar?: string; 
}