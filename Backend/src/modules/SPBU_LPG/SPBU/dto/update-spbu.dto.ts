import { PartialType } from '@nestjs/mapped-types';
import { CreateSpbuDto } from './create-spbu.dto';

export class UpdateSpbuDto extends PartialType(CreateSpbuDto) {}
