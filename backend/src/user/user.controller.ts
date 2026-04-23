import { Controller, Get, Post, Body, Param, Put, UseInterceptors, UseGuards, Delete, UploadedFile} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from 'src/Auth/auth.guard';

@Controller('/users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get("/id/:userId")
  async getUser(@Param('userId') userId: string) {
    return this.usersService.getUser(userId);
  }
  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }
  @Get("/email/:email")
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  // UPDATE
  @Put(':userId')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('foto',{
          storage: diskStorage({
              destination: './uploads',
              filename: (req,file,cb)=>{
                  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                  cb(null,uniqueSuffix+extname(file.originalname));
              }
          })
      }))
  async updateUser(@Param('userId') userId: string, @Body() body: User,@UploadedFile() foto?:Express.Multer.File) {
    return this.usersService.updateUser(userId, body, foto);
  }

  // DELETE
  @Delete(':userId')
  @UseGuards(AuthGuard)
  async deleteUser(@Param("userId") userId: string){
    return this.usersService.deleteUser(userId);
  }
}
