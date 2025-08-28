import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHargaBarangPasarDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  id_barang_pasar: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  harga: number;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'Format tanggal_harga harus YYYY-MM-DD' })
  tanggal_harga: string;
}
