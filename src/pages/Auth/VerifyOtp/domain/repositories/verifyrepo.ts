import type { VerifyOtp, VerifyOtpPayload } from "../entities/verify";

export interface VerifyOtpRepo{
    verifyotp(data:VerifyOtpPayload):Promise<VerifyOtp>
}
