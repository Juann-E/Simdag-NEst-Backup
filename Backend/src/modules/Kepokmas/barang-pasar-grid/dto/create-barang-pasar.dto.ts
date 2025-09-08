import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBarangPasarGridDto {
  @IsNotEmpty()
  @IsNumber()
  idPasar: number;

  @IsNotEmpty()
  @IsNumber()
  idBarang: number;

  @IsOptional()
  @IsString()
  keterangan?: string;
}
