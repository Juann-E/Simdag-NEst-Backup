import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../modules/user/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  role?: UserRole; // enum 
}
