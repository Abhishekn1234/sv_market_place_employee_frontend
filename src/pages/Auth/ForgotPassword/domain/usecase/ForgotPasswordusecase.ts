import type { ForgotPasswordRepo } from "../../data/repositories/forgotRepoImpl";
import type { ForgotPassword } from "../entities/forgot";

export class ForgotPasswordUsecase {
  private forgotPasswordRepo: ForgotPasswordRepo;

  constructor(forgotPasswordRepo: ForgotPasswordRepo) {
    this.forgotPasswordRepo = forgotPasswordRepo;
  }

  async execute(email: string): Promise<ForgotPassword> {
    return await this.forgotPasswordRepo.postPassword(email);
  }
}
