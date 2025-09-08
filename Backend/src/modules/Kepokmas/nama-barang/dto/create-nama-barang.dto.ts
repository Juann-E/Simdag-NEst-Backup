import { IsNotEmpty, IsString, MaxLength, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNamaBarangDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  namaBarang: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idSatuan: number;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsOptional()
  @IsString()
  gambar?: string;
}
