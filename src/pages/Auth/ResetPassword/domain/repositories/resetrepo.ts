import type { ResetPassword } from "../entities/resetpassword";

export interface IResetPasswordRepo {
  resetPassword(data: ResetPassword): Promise<void>;
}