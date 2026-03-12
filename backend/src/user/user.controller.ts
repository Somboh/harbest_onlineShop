import { Controller, Get, Post, Body, Param, Put, UseInterceptors, UseGuards, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from 'src/Auth/auth.guard';

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
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('foto', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + extname(file.originalname));
      }
    })
  }))
  updateUser(@Param('userId') userId: string, @Body() body: User) {
    return this.usersService.updateUser(userId, body);
  }

  // DELETE
  @Delete(':userId')
  @UseGuards(AuthGuard)
  deleteUser(@Param('userId') userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
