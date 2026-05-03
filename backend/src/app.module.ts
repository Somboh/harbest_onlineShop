import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { DatabaseModule } from './database/database.module';
import { UsersModule } from './user/user.module';
import { FarmerModule } from './Farmer/farmer.module';
import { AuthModule } from './Auth/auth.module';
import { ProductModule } from './product/product.module';
import { CloudinaryService } from './Cloudinary/cloudinary.service';
import config from 'config';
import { ValoracionModule } from './valoracion/valoracion.module';
import { PedidoModule } from './pedido/pedido.module';
import { FavoritoModule } from './favorito/favorito.module';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true, load: [config] }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    DatabaseModule,
    UsersModule,
    FarmerModule,
    AuthModule,
    ProductModule,
    ValoracionModule,
    PedidoModule,
    FavoritoModule,
  ],
  controllers: [],
  providers: [CloudinaryService],
})
export class AppModule {}
