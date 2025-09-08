import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PangkalanLpg } from './pangkalan-lpg.entity';
import { PangkalanLpgService } from './pangkalan-lpg.service';
import { PangkalanLpgController } from './pangkalan-lpg.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PangkalanLpg])],
  controllers: [PangkalanLpgController],
  providers: [PangkalanLpgService],
  exports: [PangkalanLpgService],
})
export class PangkalanLpgModule {}