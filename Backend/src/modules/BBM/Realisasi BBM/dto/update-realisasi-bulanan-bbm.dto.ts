import { PartialType } from '@nestjs/mapped-types';
import { CreateRealisasiBulananBbmDto } from './create-realisasi-bulanan-bbm.dto';

export class UpdateRealisasiBulananBbmDto extends PartialType(CreateRealisasiBulananBbmDto) {}