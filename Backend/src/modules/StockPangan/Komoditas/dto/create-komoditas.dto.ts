import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateKomoditasDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  komoditas: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  satuan: string;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsOptional()
  @IsString()
  gambar?: string;
}