import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Kecamatan } from '../../Setting/Kecamatan/kecamatan.entity';
import { Kelurahan } from '../../Setting/Kelurahan/kelurahan.entity';

@Entity('pangkalan_lpg')
export class PangkalanLpg {
  @PrimaryGeneratedColumn({ name: 'id_pangkalan_lpg' })
  id_pangkalan_lpg: number;

  @Column({ name: 'nama_usaha', type: 'varchar', length: 100 })
  nama_usaha: string;

  @Column({ name: 'id_kecamatan' })
  id_kecamatan: number;

  @Column({ name: 'id_kelurahan' })
  id_kelurahan: number;

  @Column({ type: 'text' })
  alamat: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telepon: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  penanggung_jawab: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  nomor_hp_penanggung_jawab: string;

  @Column({ type: 'enum', enum: ['Aktif', 'Tidak Aktif'], default: 'Aktif' })
  status: string;

  // Relations
  @ManyToOne(() => Kecamatan)
  @JoinColumn({ name: 'id_kecamatan' })
  kecamatan: Kecamatan;

  @ManyToOne(() => Kelurahan)
  @JoinColumn({ name: 'id_kelurahan' })
  kelurahan: Kelurahan;
}