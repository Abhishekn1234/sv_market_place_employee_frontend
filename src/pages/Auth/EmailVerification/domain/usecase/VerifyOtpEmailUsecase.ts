import type { VerifyOtpEmail } from "../entities/verifyotp";
import type { VerifyOtpEmailRepo } from "../repositories/VerifyOtpEmailRepo";

export class VerifyOtpEmailUsecase{
    private verifyotp:VerifyOtpEmailRepo;
    constructor(verifyotp:VerifyOtpEmailRepo){
        this.verifyotp=verifyotp
    }
    async execute(data:VerifyOtpEmail):Promise<any>{
        return await this.verifyotp.verifyotpemail(data)
    }
}