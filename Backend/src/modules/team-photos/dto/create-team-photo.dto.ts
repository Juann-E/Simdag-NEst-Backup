import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTeamPhotoDto {
  @IsString()
  @MaxLength(100)
  member_id: string;

  @IsString()
  @MaxLength(150)
  name: string;

  @IsString()
  @MaxLength(100)
  position: string;

  @IsString()
  @MaxLength(50)
  category: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  nip?: string;

  @IsOptional()
  @IsString()
  photo?: string; // Path akan diisi otomatis dari file upload

  @IsOptional()
  @IsString()
  responsibilities?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  is_active?: boolean;
}