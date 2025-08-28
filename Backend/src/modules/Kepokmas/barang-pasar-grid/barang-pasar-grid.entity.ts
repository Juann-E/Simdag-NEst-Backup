import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn, CreateDateColumn ,OneToMany } from 'typeorm';
import { NamaPasar } from '../nama-pasar/nama-pasar.entity';
import { NamaBarang } from '../nama-barang/nama-barang.entity';
import { HargaBarangPasar } from '../harga-barang-grid/harga-barang-pasar.entity';

@Entity()
export class BarangPasarGrid {
  @PrimaryGeneratedColumn({ name: 'id_barang_pasar' })
  id_barang_pasar: number; // pastikan ini nama property di TS sama dengan column name

  @ManyToOne(() => NamaPasar, (pasar) => pasar.barangPasarGrid)
  @JoinColumn({ name: 'id_pasar' })
  pasar: NamaPasar;

  @ManyToOne(() => NamaBarang, (barang) => barang.barangPasarGrid)
  @JoinColumn({ name: 'id_barang' })
  barang: NamaBarang;

  @Column({ type: 'text', nullable: true })
  keterangan: string;

  @CreateDateColumn({ name: 'time_stamp' })
  time_stamp: Date;

  @OneToMany(() => HargaBarangPasar, (harga) => harga.barangPasar)
  hargaBarang: HargaBarangPasar[];
}
