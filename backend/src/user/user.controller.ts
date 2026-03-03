import { Controller, Get, Post, Body, Param, Put, UseInterceptors} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('/users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  //este post como el de farmer no haria falta porque se usa el de auth,
  //cuando el de auth funcione se puede borrar
  create(@Body() body: Partial<User>) {
    return this.usersService.createUser(body);
  }

  @Get(":userId")
  getUser(@Param('userId') userId: string) {
    return this.usersService.getUser(userId);
  }


  @Put(":userId")
  @UseInterceptors(FileInterceptor('foto',{
          storage: diskStorage({
              destination: './uploads',
              filename: (req,file,cb)=>{
                  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                  cb(null,uniqueSuffix+extname(file.originalname));
              }
          })
      }))
  updateUser(@Param('userId') userId: string, @Body() body: User,foto?:Express.Multer.File) {
    return this.usersService.updateUser(userId, body, foto);
  }
}
