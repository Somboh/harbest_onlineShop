import { FarmerDTO } from "src/Farmer/farmer.dto";
import { User} from "src/user/user.dto";
import { randomString } from 'src/Global';
import { DatabaseService } from "src/database/database.service";

import bcrypt from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { CloudinaryService } from "src/Cloudinary/cloudinary.service";
import * as fs from 'fs/promises';
import e from "express";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private db: DatabaseService,
        private cloudinaryService: CloudinaryService
    ) {}

    async loginUser(user:any){
        //Comprobar que existe el usuario con el email y password proporcionados
        //Si existe, generar un token de autenticación y devolverlo al cliente
        //Si no existe, devolver un error de autenticación
        if(!user.email || !user.contra){
            return {status:'ERROR', message: 'Por favor, ingrese email y contraseña'};
        }

         const { data, error } = await this.db.getClient()
            .from('usuario')
            .select('*')
            .eq('email', user.email)
            .single();

        //como lo que devuelve es un array me guardo el primer elemento
        if (error || !data) {
            return {status:'ERROR', message: 'Credenciales inválidas, por favor intente de nuevo'};
        }

        const isPasswordValid = await bcrypt.compare(user.contra, data.contra);
        if (!isPasswordValid) {
            return {status:'ERROR', message: 'Credenciales inválidas, por favor intente de nuevo'};
        }

        //crear el payload del token
        const payload = { email: data.email, role:'user', id: data.id };
        //se firma el token y se devuelve
        return { accessToken: this.jwtService.sign(payload) };
    }

    async registerUser(user:User,foto: Express.Multer.File){
        try{
            //Se crea un nuevo usuario con los datos proporcionados
            //Si el email ya existe, se devuelve un error automatico
            //Por la carácteristica de unique en la BD
            
            //subo la foto de perfil a cloudinary y obtengo la URL para guardarla en la base de datos
            const resFoto = await this.cloudinaryService.uploadImage(foto.path);
            if(!resFoto || resFoto.error){
                throw new Error("Error al subir la imagen");
            }
            
            //subo la url a la base da datos en fotos
            const {error} = await this.db.getClient()
            .from('fotos')
            .insert({path: resFoto.secure_url, id: resFoto.public_id})
            
            if(error){
                return {status:'ERROR', message:'Error al registrar usuario: '+error.message};
            }
            
            const salt = await bcrypt.genSalt(10);
            
            //encriptar la contraseña antes de guardarla en la base de datos
            user.contra = await bcrypt.hash(user.contra, salt);
            
            
            let id = randomString();
            //subo el usuario a la base de datos, con la url de la foto como clave ajena
            await this.db.getClient().from('usuario').insert({
                id: id,
                nombre: user.nombre,
                email: user.email,
                contra: user.contra,
                foto: resFoto.public_id
            })

            await fs.unlink(foto.path); //elimino la foto del servidor local una vez subida a cloudinary
        }
        catch(error){
            await fs.unlink(foto.path); //elimino la foto del servidor local una vez subida a cloudinary
            return {status:'ERROR', message:'Error al registrar usuario: ' + error.message};
        }
        return {status:'OK', message:'Usuario registrado exitosamente'};

    }

    async loginFarmer(farmer:any){
        //Comprobar que existe el agricultor con el email y password proporcionados
        //Si existe, generar un token de autenticación y devolverlo al cliente
        //Si no existe, devolver un error de autenticación

        if(!farmer.email || !farmer.contra){
            return {status:'ERROR', message: 'Por favor, ingrese email y contraseña'};
        }

        const { data, error} = await this.db.getClient().from('agricultor').select('*').eq('email', farmer.email).single();

        //como lo que devuelve es un array me guardo el primer elemento
        if (error || !data) {
            return {status:'ERROR', message: 'Credenciales inválidas, por favor intente de nuevo'};
        }

        const isPasswordValid = await bcrypt.compare(farmer.contra, data.contra);
        if (!isPasswordValid) {
            return {status:'ERROR', message: 'Credenciales inválidas, por favor intente de nuevo'};
        }

        //crear el payload del token
        const payload = { email: data.email,role:'farmer', id: data.id };

        //se firma el token y se devuelve
        return { accessToken: this.jwtService.sign(payload) };
    }

    async registerFarmer(farmer:FarmerDTO, foto: Express.Multer.File){
        try {
            //Se crea un nuevo agricultor con los datos proporcionados
            //Si el email ya existe, se devuelve un error automatico
            //Por la carácteristica de unique:true en el esquema de agricultor
            
            //subo la foto de perfil a cloudinary y obtengo la URL para guardarla en la base de datos
            const resFoto = await this.cloudinaryService.uploadImage(foto.path);

            if(!resFoto || resFoto.error){
                throw new Error("Error al subir la imagen");
            }

            //subo la url a la base da datos en fotos
            const { error } = await this.db.getClient().from('fotos').insert({path: resFoto.secure_url, id: resFoto.public_id});
            
            if(error){
                return {status:'ERROR', message:'Error al registrar agricultor: ' + error.message};
             }

            let id = randomString();
            const salt = await bcrypt.genSalt(10);
    
            //encriptar la contraseña antes de guardarla en la base de datos
            farmer.contra = await bcrypt.hash(farmer.contra, salt);
            
           const {error:errorAgricultor} = await this.db.getClient().from('agricultor').insert({
                id: id,
                nombre: farmer.nombre,
                email: farmer.email,
                contra: farmer.contra,
                direccion: farmer.direccion,
                telefono: farmer.telefono,
                foto: resFoto.public_id
            })

            if(errorAgricultor){
                await fs.unlink(foto.path); //elimino la foto del servidor local una vez subida a cloudinary
                return {status:'ERROR', message:'Error al registrar agricultor: ' + errorAgricultor.message};
            }
            await fs.unlink(foto.path); //elimino la foto del servidor local una vez subida a cloudinary
        } catch (error) {
            await fs.unlink(foto.path); //elimino la foto del servidor local una vez subida a cloudinary
            throw new Error("Error al registrar agricultor: " + error.message);
        }
        return {status:'OK', message:'Agricultor registrado exitosamente'};
    }
}