import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('jenis_bbm')
export class JenisBbm {
  @PrimaryGeneratedColumn({ name: 'id_jenis_bbm' })
  id_jenis_bbm: number;

  @Column({ name: 'jenis_bbm', type: 'varchar', length: 100 })
  jenis_bbm: string;

  @Column({ type: 'text', nullable: true })
  keterangan: string;

  // @OneToMany('RealisasiBulananBbmDetail', 'jenisBbm')
  // realisasiBulananBbmDetails: any[];
}