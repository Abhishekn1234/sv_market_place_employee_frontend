import api from "@/api/api";
import type { ForgotPassword } from "../../domain/entities/forgot";
import type { ForgotRepo } from "../../domain/repositories/forgotRepo";

export class ForgotPasswordRepo implements ForgotRepo{
   async postPassword(email: string): Promise<ForgotPassword> {
        const response=await api.post('/auth/send-otp-email',{email});
        console.log(response);
        return response.data;
    }
}