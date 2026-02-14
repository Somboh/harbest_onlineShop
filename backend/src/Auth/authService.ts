// import { InjectModel } from "@nestjs/mongoose";
// import { Model } from "mongoose";
// import { Farmer } from "src/Farmer/FarmerSchema";
// import { FarmerDTO } from "src/Farmer/FarmerDTO";
// import { UserDTO } from "src/User/UserDTO";
// import { User } from "src/User/UserSchema";
// import bcrypt from 'bcryptjs';
// import { JwtService } from "@nestjs/jwt";

// export class AuthService {
//     constructor(
//         //injectar el modelo de farmer y usuario para poder hacer operaciones en la base de datos
//         @InjectModel(Farmer.name) private farmerModel:Model<Farmer>,
//         @InjectModel(User.name) private userModel:Model<User>,
//         private jwtService: JwtService,
//     ) {}

//     async loginUser(user:any): Promise<{accessToken: string}> {
//         //Comprobar que existe el usuario con el email y password proporcionados
//         //Si existe, generar un token de autenticación y devolverlo al cliente
//         //Si no existe, devolver un error de autenticación

//         const existingUser = await this.userModel.findOne({ email: user.email }).exec();
//         if (!existingUser) {
//             throw new Error('Invalid email or password');
//         }

//         const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
//         if (!isPasswordValid) {
//             throw new Error('Invalid email or password');
//         }

//         //crear el payload del token
//         const payload = { email: existingUser.email, id: existingUser._id };

//         //se firma el token y lo devuelvo
//         return { accessToken: this.jwtService.sign(payload) };
//     }

//     async registerUser(user:UserDTO): Promise<User> {
//         //Se crea un nuevo usuario con los datos proporcionados
//         //Si el email ya existe, se devuelve un error automatico
//         //Por la carácteristica de unique:true en el esquema de usuario

//         //creo el objeto del modelo con los datos del agricultor
//         const createdUser = new this.userModel(user);
        
//         const salt = await bcrypt.genSalt(10);

//         //encriptar la contraseña antes de guardarla en la base de datos
//         createdUser.password = await bcrypt.hash(createdUser.password, salt);
//         return await createdUser.save();
//     }

//     async loginFarmer(farmer:any): Promise<{accessToken: string}> {
//         //Comprobar que existe el agricultor con el email y password proporcionados
//         //Si existe, generar un token de autenticación y devolverlo al cliente
//         //Si no existe, devolver un error de autenticación

//         const existingFarmer = await this.farmerModel.findOne({ email: farmer.email }).exec();
//         if (!existingFarmer) {
//             throw new Error('Invalid email or password');
//         }

//         const isPasswordValid = await bcrypt.compare(farmer.password, existingFarmer.password);
//         if (!isPasswordValid) {
//             throw new Error('Invalid email or password');
//         }

//         //crear el payload del token
//         const payload = { email: existingFarmer.email, id: existingFarmer._id };

//         //se firma el token y lo devuelvo
//         return { accessToken: this.jwtService.sign(payload) };
//     }

//     async registerFarmer(farmer:FarmerDTO): Promise<Farmer>{
//         //Se crea un nuevo agricultor con los datos proporcionados
//         //Si el email ya existe, se devuelve un error automatico
//         //Por la carácteristica de unique:true en el esquema de agricultor

//         //creo el objeto del modelo con los datos del agricultor
//         const createdFarmer = new this.farmerModel(farmer);
        
//         const salt = await bcrypt.genSalt(10);

//         //encriptar la contraseña antes de guardarla en la base de datos
//         createdFarmer.password = await bcrypt.hash(createdFarmer.password, salt);
//         return await createdFarmer.save();
//     }
// }