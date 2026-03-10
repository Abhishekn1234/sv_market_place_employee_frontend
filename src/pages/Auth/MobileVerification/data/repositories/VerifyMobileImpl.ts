import api from "@/api/api";
import type { VerifyOtpMobile } from "../../domain/entities/verifyotpmobile";
import type { VerifyOtpMobileRepo } from "../../domain/repositories/VerifyOtpMobileRepo";

export class VerifyOtpMobileImpl implements VerifyOtpMobileRepo {
  async verifyOtpMobile(data: VerifyOtpMobile): Promise<any> {
    const response = await api.post("/auth/verify-otp-mobile", data);
    return response.data;
  }
}