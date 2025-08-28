import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateNamaPasarDto {
  @IsNotEmpty()
  @IsString()
  nama_pasar: string;

  @IsOptional()
  @IsString()
  alamat?: string;

  @IsOptional()
  @IsString()
  gambar?: string; // path file setelah upload

  @IsOptional()
  @IsString()
  koordinat?: string;

}
