import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mysql from 'mysql2/promise';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); 

  await app.listen(3000);
}
bootstrap();

//Pool para la conexion remota

/*export const pool = mysql.createPool({
  host: process.env.DB_HOSTNAME,
  port:process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})*/

//Pool para la conexion local

export const pool = mysql.createPool({
  host: 'localhost',
  port:3306,
  user:'root',
  password:'',
  database:'harbest',
})
