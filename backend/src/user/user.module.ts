import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.dto';

@Module({
  imports: [], 
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}
