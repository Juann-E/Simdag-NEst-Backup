import { PartialType } from '@nestjs/mapped-types';
import { CreateJenisBbmDto } from './create-jenis-bbm.dto';

export class UpdateJenisBbmDto extends PartialType(CreateJenisBbmDto) {}