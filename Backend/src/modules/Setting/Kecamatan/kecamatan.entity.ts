import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Kelurahan } from '../Kelurahan/kelurahan.entity';

@Entity('kecamatan')
export class Kecamatan {
  @PrimaryGeneratedColumn()
  id_kecamatan: number;

  @Column({ length: 100 })
  nama_kecamatan: string;

  @Column({ type: 'text', nullable: true })
  keterangan?: string;

  @OneToMany(() => Kelurahan, (kelurahan) => kelurahan.kecamatan)
  kelurahan: Kelurahan[];
}