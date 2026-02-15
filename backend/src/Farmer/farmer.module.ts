import { Module } from '@nestjs/common';
import { FarmerService } from './farmer.service';
import { FarmerController } from './farmer.controller';
import { FarmerDTO } from './farmer.dto';

@Module({
  imports: [], 
  controllers: [FarmerController],
  providers: [FarmerService],
})
export class FarmerModule {}