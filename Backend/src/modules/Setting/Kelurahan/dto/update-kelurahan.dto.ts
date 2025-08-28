import { PartialType } from '@nestjs/mapped-types';
import { CreateKelurahanDto } from './create-kelurahan.dto';

export class UpdateKelurahanDto extends PartialType(CreateKelurahanDto) {}
