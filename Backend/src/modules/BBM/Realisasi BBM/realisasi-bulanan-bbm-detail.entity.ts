import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RealisasiBulananBbm } from './realisasi-bulanan-bbm.entity';

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

  @ManyToOne(() => RealisasiBulananBbm, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_realisasi_bbm' })
  realisasi_bbm: RealisasiBulananBbm;
}