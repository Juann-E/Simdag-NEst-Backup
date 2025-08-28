import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spbu } from './spbu.entity';
import { SpbuService } from './spbu.service';
import { SpbuController } from './spbu.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Spbu])],
  controllers: [SpbuController],
  providers: [SpbuService],
  exports: [SpbuService],
})
export class SpbuModule {}
