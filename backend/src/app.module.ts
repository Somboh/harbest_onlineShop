// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       //importa las variables de entorno desde el archivo config.ts
//       isGlobal: true,
//       load: [config]
//     }),
//     MongooseModule.forRootAsync({
//       /*
//         hay que configurar de forma asincrona la conexion porque
//         necesitamos que ConfigModule cargue las variables de entorno
//         que es donde está la URI para conectar a MongoDB
//       */
//       imports: [ConfigModule],

//       //Una vez que carga usamos el configService para obtener la URI de la base de datos
//       inject: [ConfigService],
//       useFactory: async (configService: ConfigService) => ({
//         uri: configService.get<string>('database.uri'),
//       })
//     }),

//     //Se importa el módulo de Mongoose para el esquema de Farmer
//     MongooseModule.forFeature([{ name: Farmer.name, schema: FarmerSchema },{ name: User.name, schema: UserSchema }]),
    
//     //importar el módulo de JWT para la autenticación
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: async (configService: ConfigService) => ({
//         secret: configService.get<string>('jwt_secret'),
//       })
//     })
//   ],
//   controllers: [UserController,FarmerController,AuthController],
//   providers: [UserService,FarmerService,AuthService],
//   // exports: [AuthService]
// })
// export class AppModule {}



import { Module } from '@nestjs/common';
import { UsersModule } from './user/user.module';
import { FarmerModule } from './Farmer/farmer.module';
import { AuthModule } from './Auth/auth.module';

@Module({
  imports: [
    //Modulos de cada clase
    UsersModule,
    FarmerModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
