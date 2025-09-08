import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JenisBbm } from './jenis-bbm.entity';
import { JenisBbmService } from './jenis-bbm.service';
import { JenisBbmController } from './jenis-bbm.controller';

@Module({
  imports: [TypeOrmModule.forFeature([JenisBbm])],
  controllers: [JenisBbmController],
  providers: [JenisBbmService],
  exports: [JenisBbmService],
})
export class JenisBbmModule {}