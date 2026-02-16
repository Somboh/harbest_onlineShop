import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.dto';
import { AuthGuard } from 'src/Auth/auth.guard';

@Controller('/users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  //este post como el de farmer no haria falta porque se usa el de auth,
  //cuando el de auth funcione se puede borrar
  create(@Body() body: Partial<User>) {
    return this.usersService.createUser(body);
  }

  @UseGuards(AuthGuard) //Aquí se puede usar el AuthGuard para proteger esta ruta y que solo usuarios autenticados puedan acceder
  @Get(":userId")
  getUser(@Param('userId') userId: string) {
    return this.usersService.getUser(userId);
  }

}
