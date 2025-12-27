import type { Login } from "../entities/login";

export interface LoginRepo{
    login(email:string,password:string):Promise<Login>;
}