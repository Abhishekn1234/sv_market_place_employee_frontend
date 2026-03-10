import type { VerifyOtpMobile } from "../entities/verifyotpmobile";

export interface VerifyOtpMobileRepo {
  verifyOtpMobile(data: VerifyOtpMobile): Promise<any>;
}