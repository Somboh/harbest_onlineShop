import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService, private configService:ConfigService){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();

        //se obtiene el token del header
        const token = this.extractTokenFromHeader(request);

        if(!token){
            throw new UnauthorizedException("No se proporcionó un token de autenticación válido");
        }

        try {
            //Se verifica el token con el secreto que tenemos en .env
            const payload = this.jwtService.verifyAsync(token,{
                secret: this.configService.get<string>('jwt_secret'),
            })

            //Se guarda el payload en el request para que esté disponible en los controladores protegidos
            request['user'] = payload;

        } catch (error) {
            throw new UnauthorizedException("Token inválido o expirado");
        }
        return true;
    }

    private extractTokenFromHeader(request:any): string | undefined{
        //Obtener el token de autenticación del encabezado Authorization
        const [token] = request.headers.authorization?.split(' ') ?? [];
        console.log(token);
        return token;
    }
}