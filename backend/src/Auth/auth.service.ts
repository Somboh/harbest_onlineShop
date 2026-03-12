import { FarmerDTO } from "src/Farmer/farmer.dto";
import { User } from "src/user/user.dto";
import { randomString } from 'src/Global';
import { DatabaseService } from 'src/database/database.service';

import bcrypt from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private db: DatabaseService,
    ) {}

    async loginUser(user: any) {
        if (!user.email || !user.contra) {
            return { status: 'ERROR', message: 'Por favor, ingrese email y contraseña' };
        }

        const { data, error } = await this.db.getClient()
            .from('usuario')
            .select('*')
            .eq('email', user.email)
            .single();

        if (error || !data) {
            return { status: 'ERROR', message: 'Credenciales inválidas, por favor intente de nuevo' };
        }

        const isPasswordValid = await bcrypt.compare(user.contra, data.contra);
        if (!isPasswordValid) {
            return { status: 'ERROR', message: 'Credenciales inválidas, por favor intente de nuevo' };
        }

        const payload = { email: data.email, role: 'user', id: data.id };
        return { accessToken: this.jwtService.sign(payload) };
    }

    async registerUser(user: User) {
        const salt = await bcrypt.genSalt(10);
        user.contra = await bcrypt.hash(user.contra, salt);

        const id = randomString();
        const { error } = await this.db.getClient()
            .from('usuario')
            .insert({ id, nombre: user.nombre, email: user.email, contra: user.contra });

        if (error) throw error;
        return { status: 'OK', message: 'Usuario registrado exitosamente' };
    }

    async loginFarmer(farmer: any) {
        if (!farmer.email || !farmer.contra) {
            return { status: 'ERROR', message: 'Por favor, ingrese email y contraseña' };
        }

        const { data, error } = await this.db.getClient()
            .from('agricultor')
            .select('*')
            .eq('email', farmer.email)
            .single();

        if (error || !data) {
            return { status: 'ERROR', message: 'Credenciales inválidas, por favor intente de nuevo' };
        }

        const isPasswordValid = await bcrypt.compare(farmer.contra, data.contra);
        if (!isPasswordValid) {
            return { status: 'ERROR', message: 'Credenciales inválidas, por favor intente de nuevo' };
        }

        const payload = { email: data.email, role: 'farmer', id: data.id };
        return { accessToken: this.jwtService.sign(payload) };
    }

    async registerFarmer(farmer: FarmerDTO) {
        const id = randomString();
        const salt = await bcrypt.genSalt(10);
        farmer.contra = await bcrypt.hash(farmer.contra, salt);

        const { error } = await this.db.getClient()
            .from('agricultor')
            .insert({ id, nombre: farmer.nombre, email: farmer.email, contra: farmer.contra, direccion: farmer.direccion, telefono: farmer.telefono });

        if (error) throw error;
        return { status: 'OK', message: 'Agricultor registrado exitosamente' };
    }
}
