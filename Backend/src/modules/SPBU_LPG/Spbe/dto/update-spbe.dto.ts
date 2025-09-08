import { PartialType } from '@nestjs/mapped-types';
import { CreateSpbeDto } from './create-spbe.dto';

export class UpdateSpbeDto extends PartialType(CreateSpbeDto) {}