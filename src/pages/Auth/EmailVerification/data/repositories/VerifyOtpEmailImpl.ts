import api from "@/api/api";
import type { VerifyOtpEmail } from "../../domain/entities/verifyotp";
import type { VerifyOtpEmailRepo } from "../../domain/repositroies/VerifyOtpEmailRepo";

export class VerifyOtpEmailImpl implements VerifyOtpEmailRepo{
    async verifyotpemail(data: VerifyOtpEmail): Promise<any> {
        const response=await api.post('/auth/verify-otp',data);
        return response.data;
    }
}