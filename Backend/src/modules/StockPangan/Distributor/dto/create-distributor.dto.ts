import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDistributorDto {
  @IsString()
  @IsNotEmpty()
  nama_distributor: string;

  @IsNumber()
  @Type(() => Number)
  id_kecamatan: number;

  @IsNumber()
  @Type(() => Number)
  id_kelurahan: number;

  @IsString()
  @IsNotEmpty()
  alamat: string;

  @IsOptional()
  @IsString()
  koordinat?: string;

  @IsOptional()
  @IsString()
  keterangan?: string;
}