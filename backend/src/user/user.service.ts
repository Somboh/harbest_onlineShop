import { Injectable } from '@nestjs/common';
import { randomString } from 'src/Global';
import { DatabaseService } from 'src/database/database.service';
import { User } from './user.dto';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  // CREATE
  async createUser(data) {
    const id = randomString();

    const { error } = await this.db.getClient()
      .from('usuario')
      .insert({ id, nombre: data.nombre, email: data.email, contra: data.contra });

    if (error) throw error;
    return { message: 'Usuario creado', id };
  }

  // READ ALL
  async getUsers() {
    const { data, error } = await this.db.getClient()
      .from('usuario')
      .select('*');

    if (error) throw error;
    return data;
  }

  // READ ONE
  async getUser(userId: string) {
    const { data, error } = await this.db.getClient()
      .from('usuario')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return data;
  }

  // UPDATE
  async updateUser(userId: string, user: User) {
    const { error } = await this.db.getClient()
      .from('usuario')
      .update({ nombre: user.nombre, email: user.email, contra: user.contra })
      .eq('id', userId);

    if (error) throw error;
    return { message: 'Usuario actualizado' };
  }

  // DELETE
  async deleteUser(userId: string) {
    const { error } = await this.db.getClient()
      .from('usuario')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    return { message: 'Usuario eliminado' };
  }
}
