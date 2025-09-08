import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateJenisBbmDto {
  @IsString()
  @IsNotEmpty()
  jenis_bbm: string;

  @IsString()
  @IsOptional()
  keterangan?: string;
}