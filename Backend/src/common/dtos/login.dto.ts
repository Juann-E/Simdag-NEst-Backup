import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  username: string; // bisa username atau email (ganti 1 ganti semua)

  @IsNotEmpty()
  @IsString()
  password: string;
}
