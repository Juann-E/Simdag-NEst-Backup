import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class CreateSpbeDto {
  @IsString()
  @IsNotEmpty()
  nama_usaha: string;

  @IsNumber()
  @IsNotEmpty()
  id_kecamatan: number;

  @IsNumber()
  @IsNotEmpty()
  id_kelurahan: number;

  @IsString()
  @IsNotEmpty()
  alamat: string;

  @IsString()
  @IsOptional()
  koordinat?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  telepon?: string;

  @IsString()
  @IsOptional()
  penanggung_jawab?: string;

  @IsString()
  @IsOptional()
  nomor_hp_penanggung_jawab?: string;

  @IsEnum(['Aktif', 'Tidak Aktif'])
  @IsOptional()
  status?: string;
}