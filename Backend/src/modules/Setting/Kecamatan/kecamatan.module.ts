import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kecamatan } from './kecamatan.entity';
import { KecamatanService } from './kecamatan.service';
import { KecamatanController } from './kecamatan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Kecamatan])],
  controllers: [KecamatanController],
  providers: [KecamatanService],
  exports: [KecamatanService],
})
export class KecamatanModule {}
