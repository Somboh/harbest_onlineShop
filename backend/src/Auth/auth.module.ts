import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from 'config';

import {AuthGuard} from './auth.guard';

@Module({
  imports: [//Para cargar las variables de .env en config.ts
    ConfigModule.forRoot({
          //importa las variables de entorno desde el archivo config.ts
          isGlobal: true,
          load: [config]
    }),
    //Para poder usar los tokens jwt
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService:ConfigService)=>({
        secret: configService.get<string>('jwt_secret'),
        expiresIn: '24h',
      }),
    }),
  ], 
  controllers: [AuthController],
  providers: [AuthService,AuthGuard],
  exports: [AuthService, AuthGuard]
})
export class AuthModule {}