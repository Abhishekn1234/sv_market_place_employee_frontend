import type { VerifyOtpMobile } from "../entities/verifyotpmobile";
import type { VerifyOtpMobileRepo } from "../repositories/VerifyOtpMobileRepo";

export class VerifyOtpMobileUsecase {
  private repo: VerifyOtpMobileRepo;

  constructor(repo: VerifyOtpMobileRepo) {
    this.repo = repo;
  }

  async execute(data: VerifyOtpMobile) {
    return this.repo.verifyOtpMobile(data);
  }
}