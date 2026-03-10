import api from "@/api/api";
import type { SendOtpMobile } from "../../domain/entities/sendotpmobile";
import type { SendOtpMobileRepo } from "../../domain/repositories/SendOtpMobileRepo";

export class SendOtpMobileImpl implements SendOtpMobileRepo{
    async sendotpMobile(data: SendOtpMobile): Promise<any> {
        const response=await api.post('/auth/send-otp-mobile',data);
        return response.data;
    }
}