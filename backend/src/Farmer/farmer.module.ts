import { Module } from '@nestjs/common';
import { FarmerService } from './farmer.service';
import { FarmerController } from './farmer.controller';

@Module({
  imports: [], 
  controllers: [FarmerController],
  providers: [FarmerService],
})
export class FarmerModule {}