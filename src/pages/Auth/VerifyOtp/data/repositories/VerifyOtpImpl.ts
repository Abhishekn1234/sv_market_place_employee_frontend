// data/repositories/VerifyOtpImpl.ts

import type { VerifyOtp, VerifyOtpPayload } from "../../domain/entites/verify";
import type { VerifyOtpRepo } from "../../domain/repositories/verifyrepo";
import api from "@/api/api";

export class VerifyOtpImpl implements VerifyOtpRepo {
  async verifyotp(payload: VerifyOtpPayload): Promise<VerifyOtp> {
    const response = await api.post("auth/verify-otp", payload);
    return response.data;
  }
}
