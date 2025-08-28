import { PartialType } from '@nestjs/mapped-types';
import { CreateKecamatanDto } from './create-kecamatan.dto';

export class UpdateKecamatanDto extends PartialType(CreateKecamatanDto) {}
