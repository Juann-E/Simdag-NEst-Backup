import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('komoditas_stock_pangan')
export class KomoditasStockPangan {
  @PrimaryGeneratedColumn({ name: 'id_komoditas' })
  id: number;

  @Column({ name: 'komoditas', type: 'varchar', length: 100 })
  komoditas: string;

  @Column({ type: 'varchar', length: 50, name: 'satuan' })
  satuan: string;

  @Column({ type: 'text', nullable: true })
  keterangan?: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) 
  gambar?: string;

  @CreateDateColumn({ name: 'time_stamp' })
  createdAt: Date;
}