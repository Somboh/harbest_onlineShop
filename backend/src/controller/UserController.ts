import { Controller, Get } from '@nestjs/common';
import { UserService } from 'src/service/UserService';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/hola")
  async getHello(): Promise<string> {
    return await this.userService.getHello();
  }
}
