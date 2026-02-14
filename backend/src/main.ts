import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mysql from 'mysql2/promise';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); 

  await app.listen(3000);
}
bootstrap();


export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'harbest',
});
