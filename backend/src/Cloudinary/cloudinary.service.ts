import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2,UploadApiErrorResponse,UploadApiResponse } from "cloudinary";

@Injectable()
export class CloudinaryService {
    constructor(private configService: ConfigService){
        v2.config({
            cloud_name: this.configService.get<string>('cloudinary.cloudName'),
            api_key: this.configService.get<string>('cloudinary.apiKey'),
            api_secret: this.configService.get<string>('cloudinary.apiSecret'),
        });
    }
    async uploadImage(filePath: string): Promise<UploadApiResponse | UploadApiErrorResponse | undefined>{
        return new Promise((resolve,reject)=>{
            v2.uploader.upload(filePath,{folder:"products"},(error,result)=>{
                if(error)
                    return reject(error);
                resolve(result);
            })
        })
    }

    //eliminar imagen de cloudinary por su id
    async deleteImage(imgId: string): Promise<UploadApiErrorResponse | UploadApiResponse | undefined>{
        return new Promise((resolve,reject)=>{
            v2.uploader.destroy(imgId,(error,result)=>{
                if(error)
                    return reject(error);
                resolve(result);
            })
        })
    }

    //obtener URL de imagen de cloudinary por su id
    async getImageUrl(imgId: string): Promise<string>{
        return new Promise((resolve,rejects)=>{
            v2.url(imgId,(error,result)=>{
                if(error)
                    return rejects(error);
                resolve(result);
            })
        })
    }
}