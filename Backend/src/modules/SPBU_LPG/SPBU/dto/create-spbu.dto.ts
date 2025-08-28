import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateSpbuDto {
  @IsNotEmpty()
  @IsString()
  nama_usaha: string;

  @IsNotEmpty()
  @IsString()
  no_spbu: string;

  @IsNotEmpty()
  @IsNumber()
  id_kecamatan: number;

  @IsNotEmpty()
  @IsNumber()
  id_kelurahan: number;

  @IsNotEmpty()
  @IsString()
  alamat: string;

  @IsOptional()
  @IsString()
  koordinat?: string;   
  
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  telepon?: string;

  @IsOptional()
  @IsString()
  penanggung_jawab?: string;

  @IsOptional()
  @IsString()
  nomor_hp_penanggung_jawab?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
