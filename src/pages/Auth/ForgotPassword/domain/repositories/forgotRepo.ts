import type { ForgotPassword } from "../entities/forgot";

export interface ForgotRepo{
    postPassword(email:string):Promise<ForgotPassword>
}