// domain/usecase/VerifyOtpUsecase.ts
import type { VerifyOtp, VerifyOtpPayload } from "../entites/verify";
import type { VerifyOtpRepo } from "../repositories/verifyrepo";

export class VerifyOtpUsecase {
  private verifyRepo: VerifyOtpRepo;

  constructor(verifyRepo: VerifyOtpRepo) {
    this.verifyRepo = verifyRepo;
  }

  async execute(payload: VerifyOtpPayload): Promise<VerifyOtp> {
    return await this.verifyRepo.verifyotp(payload);
  }
}
