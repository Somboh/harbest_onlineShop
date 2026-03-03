import { FarmerDTO } from "src/Farmer/farmer.dto";
import { User} from "src/user/user.dto";
import { randomString } from 'src/Global';
import { pool } from 'src/main';

import bcrypt from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { CloudinaryService } from "src/Cloudinary/cloudinary.service";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private cloudinaryService: CloudinaryService
    ) {}

    async loginUser(user:any){
        //Comprobar que existe el usuario con el email y password proporcionados
        //Si existe, generar un token de autenticación y devolverlo al cliente
        //Si no existe, devolver un error de autenticación
        if(!user.email || !user.contra){
            return {status:'ERROR', message: 'Por favor, ingrese email y contraseña'};
        }

        const [result]: any[] = await pool.query(
            "select * from usuario where email = ?",
            [user.email]
        )

        //como lo que devuelve es un array me guardo el primer elemento
        if (result.length === 0) {
            return {status:'ERROR', message: 'Credenciales inválidas, por favor intente de nuevo'};
        }

        const userResult = result[0];
        const isPasswordValid = await bcrypt.compare(user.contra, userResult.contra);
        if (!isPasswordValid) {
            return {status:'ERROR', message: 'Credenciales inválidas, por favor intente de nuevo'};
        }

        //crear el payload del token
        const payload = { email: userResult.email, role:'user', id: userResult.id };
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
            const [resFotoBD] = await pool.query("insert into fotos (path,id) values (?,?)", [resFoto.secure_url,resFoto.public_id]);

            //subo el usuario a la base de datos, con la url de la foto como clave ajena
            const salt = await bcrypt.genSalt(10);
    
            //encriptar la contraseña antes de guardarla en la base de datos
            user.contra = await bcrypt.hash(user.contra, salt);
    
            let id = randomString();
            const [result] = await pool.query(
                "insert into usuario (id,nombre, email, contra,foto) values (?, ?, ?, ?, ?)",
                [id, user.nombre, user.email, user.contra,resFoto.public_id]
            )
            return await {status:'OK', message:'Usuario registrado exitosamente'};
        }
        catch(error){
            return await {status:'ERROR', message:'Error al registrar usuario'};
        }

    }

    async loginFarmer(farmer:any){
        //Comprobar que existe el agricultor con el email y password proporcionados
        //Si existe, generar un token de autenticación y devolverlo al cliente
        //Si no existe, devolver un error de autenticación

        if(!farmer.email || !farmer.contra){
            return {status:'ERROR', message: 'Por favor, ingrese email y contraseña'};
        }

        const [result]: any[] = await pool.query(
            "select * from agricultor where email = ?",
            [farmer.email]
        )

        //como lo que devuelve es un array me guardo el primer elemento
        if (result.length === 0) {
            return {status:'ERROR', message: 'Credenciales inválidas, por favor intente de nuevo'};
        }

        const farmerResult = result[0];

        const isPasswordValid = await bcrypt.compare(farmer.contra, farmerResult.contra);
        if (!isPasswordValid) {
            return {status:'ERROR', message: 'Credenciales inválidas, por favor intente de nuevo'};
        }

        //crear el payload del token
        const payload = { email: farmerResult.email,role:'farmer', id: farmerResult.id };

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
            const [resFotoBD] = await pool.query("insert into fotos (path,id) values (?,?)", [resFoto.secure_url,resFoto.public_id]);

            let id = randomString();
            const salt = await bcrypt.genSalt(10);
    
            //encriptar la contraseña antes de guardarla en la base de datos
            farmer.contra = await bcrypt.hash(farmer.contra, salt);
            
            const [result] = await pool.query(
                'insert into agricultor (id,nombre,email, contra, direccion, telefono, foto) values (?, ?, ?, ?, ?, ?, ?)',
                [id,farmer.nombre, farmer.email, farmer.contra, farmer.direccion, farmer.telefono,resFoto.public_id]
            )
            return await {status:'OK', message:'Agricultor registrado exitosamente'};
        } catch (error) {
            throw new Error("Error al registrar agricultor");
        }
    }
}