import { IsOptional, IsNumber, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateBarangPasarGridDto } from './create-barang-pasar.dto';

export class UpdateBarangPasarGridDto extends PartialType(CreateBarangPasarGridDto) {
  @IsOptional()
  @IsNumber()
  idPasar?: number;

  @IsOptional()
  @IsNumber()
  idBarang?: number;

  @IsOptional()
  @IsString()
  keterangan?: string;
}
