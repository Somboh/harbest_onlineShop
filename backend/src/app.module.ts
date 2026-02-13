import { Module } from '@nestjs/common';

import { UserController } from './controller/UserController';
import { UserService } from './service/UserService';

import { ConfigModule, ConfigService } from '@nestjs/config';
import config from 'config';
import { MongooseModule } from '@nestjs/mongoose';

import { FarmerService } from './service/FarmerService';
import { FarmerController } from './controller/FarmerController';
import { Farmer, FarmerSchema } from './schemas/FarmerSchema';

@Module({
  imports: [
    ConfigModule.forRoot({
      //importa las variables de entorno desde el archivo config.ts
      isGlobal: true,
      load: [config]
    }),
    MongooseModule.forRootAsync({
      /*
        hay que configurar de forma asincrona la conexion porque
        necesitamos que ConfigModule cargue las variables de entorno
        que es donde está la URI para conectar a MongoDB
      */
      imports: [ConfigModule],

      //Una vez que carga usamos el configService para obtener la URI de la base de datos
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      })
    }),

    //Se importa el módulo de Mongoose para el esquema de Farmer
    MongooseModule.forFeature([{ name: Farmer.name, schema: FarmerSchema }]),
  ],
  controllers: [UserController,FarmerController],
  providers: [UserService,FarmerService],
})
export class AppModule {}
