import type { SendOtpMobile } from "../entities/sendotpmobile";

export interface SendOtpMobileRepo{
    sendotpMobile(data:SendOtpMobile):Promise<any>;
}