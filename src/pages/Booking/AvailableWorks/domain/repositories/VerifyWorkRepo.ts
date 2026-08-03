import type { verifyotp } from "../entities/verifyotp";
import type { Work } from "../entities/work";

export interface VerifyWorkOtpRepo {
  verifyCompleteOtp(data: verifyotp): Promise<Work>;
}