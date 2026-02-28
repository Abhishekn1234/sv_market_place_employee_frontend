
import type { LoginResponse } from "../entities/loginresponse";

export interface LoginRepo{
    login(email:string,password:string):Promise<LoginResponse>;
}