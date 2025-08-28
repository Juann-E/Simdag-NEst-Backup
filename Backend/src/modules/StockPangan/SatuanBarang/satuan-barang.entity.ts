import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('satuan_barang_stock_pangan')
export class SatuanBarangStockPangan {
  @PrimaryGeneratedColumn({ name: 'id_satuan' })
  idSatuan: number;

  @Column({ name: 'satuan_barang', length: 50 })
  satuanBarang: string;

  @CreateDateColumn({ name: 'time_stamp' })
  timeStamp: Date;
}