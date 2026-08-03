import api from "@/api/api";
import type { verifyotp } from "../../domain/entities/verifyotp";
import type { VerifyWorkOtpRepo } from "../../domain/repositories/VerifyWorkRepo";
import type { Work } from "../../domain/entities/work";

export class VerifyOtpCompleteImpl implements VerifyWorkOtpRepo{
    async verifyCompleteOtp(data: verifyotp):Promise<Work> {
     const response=await api.post('/booking/verify-completion-otp',data);
     return response.data   
    }
}