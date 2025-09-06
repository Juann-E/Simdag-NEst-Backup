import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRealisasiBulananLpgDto {
  @IsNotEmpty()
  @IsNumber()
  id_agen: number;

  @IsNotEmpty()
  @IsNumber()
  bulan: number;

  @IsNotEmpty()
  @IsNumber()
  tahun: number;

  @IsNotEmpty()
  @IsNumber()
  realisasi_tabung: number;
}