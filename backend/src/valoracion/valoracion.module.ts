import { Module } from '@nestjs/common';
import { ValoracionService } from './valoracion.service';
import { ValoracionController } from './valoracion.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule], 
  controllers: [ValoracionController],
  providers: [ValoracionService],
})
export class ValoracionModule {}