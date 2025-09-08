import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateTransaksiStockPanganDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(2000)
  @Max(2100)
  tahun: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(12)
  bulan: number;

  @IsNotEmpty()
  @IsNumber()
  idDistributor: number;

  @IsNotEmpty()
  @IsNumber()
  idKomoditas: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stockAwal: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  pengadaan: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  penyaluran: number;

  @IsOptional()
  @IsString()
  keterangan?: string;
}