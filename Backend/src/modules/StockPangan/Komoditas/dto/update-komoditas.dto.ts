import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateKomoditasDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  komoditas?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  satuan?: string;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsOptional()
  @IsString()
  gambar?: string;
}