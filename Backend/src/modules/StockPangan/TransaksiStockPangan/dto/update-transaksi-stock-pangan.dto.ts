import { PartialType } from '@nestjs/mapped-types';
import { CreateTransaksiStockPanganDto } from './create-transaksi-stock-pangan.dto';

export class UpdateTransaksiStockPanganDto extends PartialType(CreateTransaksiStockPanganDto) {}