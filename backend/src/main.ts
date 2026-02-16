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
  host: 'uya-harbest-db-uya-harbest.k.aivencloud.com',
  port:20535,
  user: 'avnadmin',
  password: 'AVNS_sX1JUa_zAssGAEpA0A4',
  database: 'harbest',
})*/

//Pool para la conexion local

export const pool = mysql.createPool({
  host: 'localhost',
  port:3306,
  user:'root',
  password:'',
  database:'harbest',
})
