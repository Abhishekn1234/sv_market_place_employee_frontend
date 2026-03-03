import type { verifyotp } from "../entities/verifyotp";
import type { Work } from "../entities/workhistory";

export interface VerifyWorkOtpRepo {
  verifyCompleteOtp(data: verifyotp): Promise<Work>;
}