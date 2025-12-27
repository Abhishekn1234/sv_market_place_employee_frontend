import type { IResetPasswordRepo } from '../../domain/repositories/resetrepo';
import type { ResetPassword } from '../../domain/entities/resetpassword';
import { baseURL } from '@/api/apiConfig';
import axios from 'axios';

export class ResetPasswordRepoImpl implements IResetPasswordRepo {
  private baseUrl = baseURL;

  async resetPassword(data: ResetPassword): Promise<void> {
    // Validate passwords match
    if (data.newPassword !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Get token from sessionStorage
    const token = sessionStorage.getItem('resetPasswordToken');
    if (!token) {
      throw new Error("Reset token not found in session storage");
    }

    // Make API request with token in headers
    await axios.post(
      `${this.baseUrl}auth/reset-password`,
      {
        password: data.newPassword
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

   
    sessionStorage.removeItem('resetPasswordToken');
  }
}
