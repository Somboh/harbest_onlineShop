import { Controller, Get, Post, Body, Param} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.dto';

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

}
