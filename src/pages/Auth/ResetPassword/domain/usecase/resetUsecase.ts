import type { IResetPasswordRepo } from "../repositories/resetrepo";
import type { ResetPassword } from "../entities/resetpassword";

export class ResetPasswordUseCase {
  private repo: IResetPasswordRepo;

  constructor(repo: IResetPasswordRepo) {
    this.repo = repo;
  }

  async execute(data: ResetPassword) {
    try {
      await this.repo.resetPassword(data);
      return { success: true, message: 'Password reset successfully' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to reset password' };
    }
  }
}

