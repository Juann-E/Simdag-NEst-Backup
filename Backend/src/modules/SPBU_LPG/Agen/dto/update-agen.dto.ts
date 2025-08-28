import { PartialType } from '@nestjs/mapped-types';
import { CreateAgenDto } from './create-agen.dto';

export class UpdateAgenDto extends PartialType(CreateAgenDto) {}