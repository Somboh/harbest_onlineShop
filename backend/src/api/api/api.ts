export * from './auth.service';
import { AuthService } from './auth.service';
export * from './farmer.service';
import { FarmerService } from './farmer.service';
export * from './product.service';
import { ProductService } from './product.service';
export * from './user.service';
import { UserService } from './user.service';
export const APIS = [AuthService, FarmerService, ProductService, UserService];
