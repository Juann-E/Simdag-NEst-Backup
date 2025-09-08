import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistributorService } from './distributor.service';
import { DistributorController } from './distributor.controller';
import { Distributor } from './distributor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Distributor])],
  providers: [DistributorService],
  controllers: [DistributorController],
  exports: [DistributorService]
})
export class DistributorModule {}