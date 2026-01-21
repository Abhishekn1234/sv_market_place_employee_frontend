import { validateEmail,  } from "@/pages/Auth/Register/domain/validations/registervalidation";
import type { ForgotPasswordRepo } from "../../data/repositories/forgotRepoImpl";
import type { ForgotPassword } from "../entities/forgot";

export class ForgotPasswordUsecase {
  private forgotPasswordRepo: ForgotPasswordRepo;

  constructor(forgotPasswordRepo: ForgotPasswordRepo) {
    this.forgotPasswordRepo = forgotPasswordRepo;
  }

  async execute(email: string): Promise<ForgotPassword> {
    validateEmail(email);
   
    return await this.forgotPasswordRepo.postPassword(email);
  }
}
