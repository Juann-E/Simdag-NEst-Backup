import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateNamaKomoditasDto {
  @IsString()
  komoditas: string;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsNumber()
  id_satuan: number;
}