import { Module } from '@nestjs/common';
import { FarmerService } from './farmer.service';
import { FarmerController } from './farmer.controller';
import { CloudinaryModule } from 'src/Cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule], 
  controllers: [FarmerController],
  providers: [FarmerService],
})
export class FarmerModule {}