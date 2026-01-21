
import type { VerifyOtp, VerifyOtpPayload } from "../entites/verify";
import type { VerifyOtpRepo } from "../repositories/verifyrepo";
import { validateVerifyOTP } from "../validations/otp.validation";

export class VerifyOtpUsecase {
  private verifyRepo: VerifyOtpRepo;

  constructor(verifyRepo: VerifyOtpRepo) {
    this.verifyRepo = verifyRepo;
  }

  async execute(payload: VerifyOtpPayload): Promise<VerifyOtp> {
    validateVerifyOTP(payload);
    return await this.verifyRepo.verifyotp(payload);
  }
}
