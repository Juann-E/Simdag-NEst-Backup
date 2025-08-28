import { PartialType } from '@nestjs/mapped-types';
import { CreateNamaPasarDto } from './create-nama-pasar.dto';

export class UpdateNamaPasarDto extends PartialType(CreateNamaPasarDto) {}
