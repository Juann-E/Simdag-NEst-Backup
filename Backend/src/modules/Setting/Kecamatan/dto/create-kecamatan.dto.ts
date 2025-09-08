import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateKecamatanDto {
  @IsNotEmpty()
  @IsString()
  nama_kecamatan: string;

  @IsOptional()
  @IsString()
  keterangan?: string;
}
