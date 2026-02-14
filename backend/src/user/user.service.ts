import { Injectable } from '@nestjs/common';
import { randomString } from 'src/Global';
import { pool } from 'src/main';

@Injectable()
export class UserService {
  
  async createUser(data) {
    let id = randomString();
    const [result] = await pool.query(
      'INSERT INTO usuario (id, nombre, email, contra) VALUES (?, ?, ?, ?)',
      [id, data.nombre, data.email, data.contra],
    );

    return result;
  }

  async getUser(userId:string) {
    const [result] = await pool.query(
      'SELECT * from usuario WHERE id = ?',
      [userId],
    );

    return result;
  }
}
