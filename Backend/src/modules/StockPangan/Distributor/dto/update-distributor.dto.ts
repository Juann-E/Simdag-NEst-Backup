import { PartialType } from '@nestjs/mapped-types';
import { CreateDistributorDto } from './create-distributor.dto';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDistributorDto extends PartialType(CreateDistributorDto) {
  @IsOptional()
  @IsString()
  nama_distributor?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id_kecamatan?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id_kelurahan?: number;

  @IsOptional()
  @IsString()
  alamat?: string;

  @IsOptional()
  @IsString()
  koordinat?: string;

  @IsOptional()
  @IsString()
  keterangan?: string;
}