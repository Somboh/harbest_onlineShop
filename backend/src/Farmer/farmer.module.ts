import { Module } from '@nestjs/common';
import { FarmerService } from './farmer.service';
import { FarmerController } from './farmer.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CloudinaryModule } from 'src/Cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule,DatabaseModule], 
  controllers: [FarmerController],
  providers: [FarmerService],
})
export class FarmerModule {}
