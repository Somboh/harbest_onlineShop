import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { DatabaseModule } from 'src/database/database.module';
import { CloudinaryModule } from 'src/Cloudinary/cloudinary.module';

@Module({
  imports: [DatabaseModule,CloudinaryModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
