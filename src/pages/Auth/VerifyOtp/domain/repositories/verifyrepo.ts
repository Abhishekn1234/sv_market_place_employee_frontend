import type { VerifyOtp, VerifyOtpPayload } from "../entites/verify";

export interface VerifyOtpRepo{
    verifyotp(data:VerifyOtpPayload):Promise<VerifyOtp>
}
