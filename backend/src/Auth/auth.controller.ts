import { Body, Controller, Post } from "@nestjs/common";
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
    async registerUser(@Body() userData: User){
        return await this.authService.registerUser(userData);
    }

    @Post("/farmer/login")
    async loginFarmer(@Body() farmerData: any){
        return await this.authService.loginFarmer(farmerData);
    }
    
    @Post("/farmer/register")
    async registerFarmer(@Body() farmerData: FarmerDTO){
        return await this.authService.registerFarmer(farmerData);
    }
}