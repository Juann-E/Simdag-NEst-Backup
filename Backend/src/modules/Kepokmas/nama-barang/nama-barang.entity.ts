import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany ,JoinColumn, CreateDateColumn } from 'typeorm';
import { SatuanBarang } from '../satuan-barang/satuan-barang.entity';
import { BarangPasarGrid } from '../barang-pasar-grid/barang-pasar-grid.entity';

@Entity('nama_barang')
export class NamaBarang {
  @PrimaryGeneratedColumn({ name: 'id_barang' })
  id: number;

  @Column({ name: 'nama_barang', type: 'varchar', length: 100 })
  namaBarang: string;

  @ManyToOne(() => SatuanBarang, { eager: true })
  @JoinColumn({ name: 'id_satuan' })
  satuan: SatuanBarang;

  @Column({ type: 'text', nullable: true })
  keterangan?: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) 
  gambar?: string;

  @CreateDateColumn({ name: 'time_stamp' })
  createdAt: Date;

  @OneToMany(() => BarangPasarGrid, (grid) => grid.barang)
  barangPasarGrid: BarangPasarGrid[];
}
