import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CloudinaryModule } from 'src/Cloudinary/cloudinary.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [CloudinaryModule,DatabaseModule], 
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}