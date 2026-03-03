import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CloudinaryModule } from 'src/Cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule], 
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}