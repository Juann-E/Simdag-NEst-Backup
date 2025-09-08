import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateKelurahanDto {
  @IsNotEmpty()
  @IsInt()
  id_kecamatan: number;

  @IsNotEmpty()
  @IsString()
  nama_kelurahan: string;

  @IsOptional()
  @IsString()
  keterangan?: string;
}
