import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Spbu } from '../../SPBU_LPG/SPBU/spbu.entity';
import { JenisBbm } from '../JenisBbm/jenis-bbm.entity';

@Entity('realisasi_bulanan_bbm')
export class RealisasiBulananBbm {
  @PrimaryGeneratedColumn({ name: 'id_realisasi_bbm' })
  id_realisasi_bbm: number;

  @Column({ name: 'id_spbu' })
  id_spbu: number;

  @Column({ type: 'varchar', length: 20 })
  bulan: string;

  @Column({ type: 'varchar', length: 4 })
  tahun: string;

  @Column({ name: 'id_jenis_bbm' })
  id_jenis_bbm: number;

  @Column({ name: 'realisasi_liter', type: 'decimal', precision: 12, scale: 2 })
  realisasi_liter: number;

  // Relations
  @ManyToOne(() => Spbu)
  @JoinColumn({ name: 'id_spbu' })
  spbu: Spbu;

  @ManyToOne(() => JenisBbm)
  @JoinColumn({ name: 'id_jenis_bbm' })
  jenisBbm: JenisBbm;


}

@Entity('realisasi_bulanan_bbm_detail')
export class RealisasiBulananBbmDetail {
  @PrimaryGeneratedColumn({ name: 'id_detail' })
  id_detail: number;

  @Column({ name: 'id_realisasi_bbm' })
  id_realisasi_bbm: number;

  @Column({ type: 'int' })
  bulan: number;

  @Column({ type: 'int' })
  tahun: number;

  @Column({ name: 'id_jenis_bbm' })
  id_jenis_bbm: number;

  @Column({ name: 'realisasi_liter', type: 'decimal', precision: 15, scale: 2 })
  realisasi_liter: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // Relations
  @ManyToOne(() => RealisasiBulananBbm)
  @JoinColumn({ name: 'id_realisasi_bbm' })
  realisasiMain: RealisasiBulananBbm;

  @ManyToOne(() => JenisBbm)
  @JoinColumn({ name: 'id_jenis_bbm' })
  jenisBbm: JenisBbm;
}