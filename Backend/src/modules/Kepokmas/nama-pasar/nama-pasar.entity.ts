import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { BarangPasarGrid } from '../barang-pasar-grid/barang-pasar-grid.entity';

@Entity('nama_pasar')
export class NamaPasar {
  @PrimaryGeneratedColumn({ name: 'id_pasar' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nama_pasar: string;

  @Column({ type: 'text', nullable: true })
  alamat: string;

  @CreateDateColumn({ name: 'time_stamp' })
  time_stamp: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gambar: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  // Tambahan relasi
  @OneToMany(() => BarangPasarGrid, (grid) => grid.pasar)
  barangPasarGrid: BarangPasarGrid[];
}
