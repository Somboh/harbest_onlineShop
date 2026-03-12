import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  // CREATE
  @Post()
  create(@Body() body: Partial<User>) {
    return this.usersService.createUser(body);
  }

  // READ ALL
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  // READ ONE
  @Get(':userId')
  getUser(@Param('userId') userId: string) {
    return this.usersService.getUser(userId);
  }

  // UPDATE
  @Put(':userId')
  updateUser(
    @Param('userId') userId: string,
    @Body() body: Partial<User>,
  ) {
    return this.usersService.updateUser(userId, body);
  }

  // DELETE
  @Delete(':userId')
  deleteUser(@Param('userId') userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
