import { BadRequestException, ConflictException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";

export class UserService {

    async getHello(): Promise<string> 
    {
       return "hola";
    }
}
    