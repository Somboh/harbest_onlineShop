import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  create(@Body() body: Partial<User>) {
    return this.usersService.createUser(body);
  }

  @Get(":userId")
  getUser(@Param('userId') userId: string) {
    return this.usersService.getUser(userId);
  }

}
