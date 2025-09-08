import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { SatuanBarangStockPangan } from '../modules/StockPangan/SatuanBarang/satuan-barang.entity';

@Entity('nama_komoditas')
export class NamaKomoditas {
  @PrimaryGeneratedColumn()
  id_komoditas: number;

  @Column({ type: 'varchar', length: 255 })
  komoditas: string;

  @Column({ type: 'text', nullable: true })
  keterangan?: string;

  @CreateDateColumn()
  time_stamp: Date;

  @Column()
  id_satuan: number;

  @ManyToOne(() => SatuanBarangStockPangan)
  @JoinColumn({ name: 'id_satuan' })
  satuan: SatuanBarangStockPangan;
}