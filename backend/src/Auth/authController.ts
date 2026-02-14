// import { Body, Controller, Post } from "@nestjs/common";
// import { AuthService } from "src/Auth/authService";
// import { FarmerDTO } from "src/Farmer/FarmerDTO";
// import { UserDTO } from "src/User/UserDTO";
// import { FarmerService } from "src/Farmer/FarmerService";
// import { UserService } from "src/User/UserService";

// @Controller("auth")
// export class AuthController {   
//     constructor(
//         //declaración de los servicios que se usan
//         private readonly authService: AuthService, 
//         private readonly farmerService: FarmerService, 
//         private readonly userService:UserService
//     ) {}

//     @Post("/user/login")
//     async loginUser(@Body() userData: any){
//         return await this.authService.loginUser(userData);
//     }

//     @Post("/user/register")
//     async registerUser(@Body() userData: UserDTO){
//         return await this.authService.registerUser(userData);
//     }

//     @Post("/farmer/login")
//     async loginFarmer(@Body() farmerData: any){
//         return await this.authService.loginFarmer(farmerData);
//     }
    
//     @Post("/farmer/register")
//     async registerFarmer(@Body() farmerData: FarmerDTO){
//         return await this.authService.registerFarmer(farmerData);
//     }
// }