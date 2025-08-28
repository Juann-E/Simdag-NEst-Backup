import { PartialType } from '@nestjs/mapped-types';
import { CreateNamaKomoditasDto } from './create-nama-komoditas.dto';

export class UpdateNamaKomoditasDto extends PartialType(CreateNamaKomoditasDto) {}