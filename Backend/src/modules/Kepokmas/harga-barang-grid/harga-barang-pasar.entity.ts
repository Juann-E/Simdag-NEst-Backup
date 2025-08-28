import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BarangPasarGrid } from '../barang-pasar-grid/barang-pasar-grid.entity';

@Entity('harga_barang_pasar')
export class HargaBarangPasar {
  @PrimaryGeneratedColumn()
  id_harga: number;

  @Column()
  id_barang_pasar: number;

  @ManyToOne(() => BarangPasarGrid, (barangPasar) => barangPasar.hargaBarang, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_barang_pasar' })
  barangPasar: BarangPasarGrid;

  @Column('decimal', { precision: 15, scale: 2 })
  harga: number;

  @Column({ type: 'text', nullable: true })
  keterangan: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  time_stamp: Date;

  @Column({ type: 'date' })
  tanggal_harga: Date;
}
