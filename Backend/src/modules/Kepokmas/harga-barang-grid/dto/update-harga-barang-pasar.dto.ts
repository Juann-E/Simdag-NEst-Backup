import { PartialType } from '@nestjs/mapped-types';
import { CreateHargaBarangPasarDto } from './create-harga-barang-pasar.dto';
import { IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateHargaBarangPasarDto extends PartialType(CreateHargaBarangPasarDto) {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id_harga?: number;

  @IsOptional()
  @IsDateString({}, { message: 'Format tanggal_harga harus YYYY-MM-DD' })
  tanggal_harga?: string;
}
