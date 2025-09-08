import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSatuanBarangDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  satuanBarang: string;
}