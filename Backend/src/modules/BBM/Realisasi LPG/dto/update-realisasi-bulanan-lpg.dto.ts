import { PartialType } from '@nestjs/mapped-types';
import { CreateRealisasiBulananLpgDto } from './create-realisasi-bulanan-lpg.dto';

export class UpdateRealisasiBulananLpgDto extends PartialType(CreateRealisasiBulananLpgDto) {}