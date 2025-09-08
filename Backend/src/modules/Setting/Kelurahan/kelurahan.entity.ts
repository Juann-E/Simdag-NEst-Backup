import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, RelationId } from 'typeorm';
import { Kecamatan } from '../Kecamatan/kecamatan.entity';

@Entity('kelurahan')
export class Kelurahan {
  @PrimaryGeneratedColumn()
  id_kelurahan: number;

  @Column({ length: 100 })
  nama_kelurahan: string;

  @Column({ type: 'text', nullable: true })
  keterangan?: string;

  @ManyToOne(() => Kecamatan, (kecamatan) => kecamatan.kelurahan, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_kecamatan' })   // pakai id_kecamatan sebagai FK di DB
  kecamatan: Kecamatan;

  // otomatis expose id_kecamatan di JSON, tanpa bikin kolom ganda
  @RelationId((kelurahan: Kelurahan) => kelurahan.kecamatan)
  id_kecamatan: number;
}
