import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { AuthService } from "src/Auth/auth.service";
import { FarmerDTO } from "src/Farmer/farmer.dto";
import { User } from "src/user/user.dto";

@Controller("auth")
export class AuthController {   
    constructor(
        //declaración de los servicios que se usan
        private readonly authService: AuthService,
    ) {}

    @Post("/user/login")
    async loginUser(@Body() userData: any){
        return await this.authService.loginUser(userData);
    }

    @Post("/user/register")
    @UseInterceptors(FileInterceptor('foto',{
        storage: diskStorage({
            destination: './uploads',
            filename:(req,file,cb)=>{
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null,uniqueSuffix+extname(file.originalname));
            }
        })
    }))
    async registerUser(@Body() userData: User, @UploadedFile() foto: Express.Multer.File){
        return await this.authService.registerUser(userData, foto);
    }

    @Post("/farmer/login")
    async loginFarmer(@Body() farmerData: any){
        return await this.authService.loginFarmer(farmerData);
    }
    
    @Post("/farmer/register")
    @UseInterceptors(FileInterceptor('foto',{
        storage: diskStorage({
            destination: './uploads',
            filename:(req,file,cb)=>{
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null,uniqueSuffix+extname(file.originalname));
            }
        })
    }))
    async registerFarmer(@Body() farmerData: FarmerDTO, @UploadedFile() foto: Express.Multer.File){
        return await this.authService.registerFarmer(farmerData,foto);
    }
}