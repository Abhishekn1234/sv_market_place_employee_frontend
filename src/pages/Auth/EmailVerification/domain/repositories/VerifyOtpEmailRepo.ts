import type { VerifyOtpEmail } from "../entities/verifyotp";

export interface VerifyOtpEmailRepo{
    verifyotpemail(data:VerifyOtpEmail):Promise<any>;
}