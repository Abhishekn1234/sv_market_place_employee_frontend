import type { verifyotp } from "../entities/verifyotp";
import type { Work } from "../entities/work";
import type { VerifyWorkOtpRepo } from "../repositories/VerifyWorkRepo";

export class VerifyWorkUsecase{
    private verifyotp:VerifyWorkOtpRepo;
    constructor(verifyOtp:VerifyWorkOtpRepo){
        this.verifyotp=verifyOtp
    }

    async execute(data:verifyotp):Promise<Work>{
        return this.verifyotp.verifyCompleteOtp(data)
    }

}