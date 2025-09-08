import { PartialType } from '@nestjs/mapped-types';
import { CreateSatuanBarangDto } from './create-satuan-barang.dto';

export class UpdateSatuanBarangDto extends PartialType(CreateSatuanBarangDto) {}