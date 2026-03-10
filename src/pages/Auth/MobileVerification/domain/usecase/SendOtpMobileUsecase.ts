import type { SendOtpMobile } from "../entities/sendotpmobile";
import type { SendOtpMobileRepo } from "../repositories/SendOtpMobileRepo";

export class SendOtpMobileUsecase {
  private repo: SendOtpMobileRepo;

  constructor(repo: SendOtpMobileRepo) {
    this.repo = repo;
  }

  async execute(data: SendOtpMobile) {
    return this.repo.sendotpMobile(data);
  }
}