import type { SendOtpEmail } from "../entities/sendotp";
import type { SendOtpEmailRepo } from "../repositories/SendOtpEmailRepo";

export class SendOtpEmailUsecase{
    private sendotpemail:SendOtpEmailRepo;
    constructor(sendotpemail:SendOtpEmailRepo){
        this.sendotpemail=sendotpemail;

    }
    async execute(data:SendOtpEmail):Promise<any>{
        return this.sendotpemail.sendOtp(data);
    }
}