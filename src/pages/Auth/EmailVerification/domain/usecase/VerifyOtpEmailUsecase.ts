import type { VerifyOtpEmail } from "../entities/verifyotp";
import type { VerifyOtpEmailRepo } from "../repositroies/VerifyOtpEmailRepo";

export class VerifyOtpEmailUsecase{
    private verifyotp:VerifyOtpEmailRepo;
    constructor(verifyotp:VerifyOtpEmailRepo){
        this.verifyotp=verifyotp
    }
    async execute(data:VerifyOtpEmail):Promise<any>{
        return await this.verifyotp.verifyotpemail(data)
    }
}