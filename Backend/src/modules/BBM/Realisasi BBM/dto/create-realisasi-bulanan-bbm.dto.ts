import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRealisasiBulananBbmDto {
  @IsNotEmpty()
  @IsNumber()
  id_spbu: number;

  @IsNotEmpty()
  @IsNumber()
  id_jenis_bbm: number;

  @IsNotEmpty()
  @IsString()
  bulan: string;

  @IsNotEmpty()
  @IsString()
  tahun: string;

  @IsNotEmpty()
  @IsNumber()
  realisasi_liter: number;
}