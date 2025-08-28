import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { KomoditasStockPangan } from '../Komoditas/komoditas.entity';
import { Distributor } from '../Distributor/distributor.entity';

@Entity('transaksi_stock_pangan')
export class TransaksiStockPangan {
  @PrimaryGeneratedColumn({ name: 'id_transaksi' })
  idTransaksi: number;

  @Column({ type: 'int' })
  tahun: number;

  @Column({ type: 'int' })
  bulan: number;

  @Column({ name: 'id_distributor' })
  idDistributor: number;

  @ManyToOne(() => Distributor)
  @JoinColumn({ name: 'id_distributor' })
  distributor: Distributor;

  @Column({ name: 'id_komoditas' })
  idKomoditas: number;

  @ManyToOne(() => KomoditasStockPangan)
  @JoinColumn({ name: 'id_komoditas' })
  komoditas: KomoditasStockPangan;

  @Column({ name: 'stock_awal', type: 'decimal', precision: 10, scale: 2 })
  stockAwal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pengadaan: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  penyaluran: number;

  @Column({ type: 'text', nullable: true })
  keterangan?: string;

  @CreateDateColumn({ name: 'time_stamp' })
  timeStamp: Date;
}