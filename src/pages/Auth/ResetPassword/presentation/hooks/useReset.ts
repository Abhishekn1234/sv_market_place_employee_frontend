import { useState } from 'react';
import { ResetPasswordUseCase } from '../../domain/usecase/resetUsecase';
import { ResetPasswordRepoImpl } from '../../data/repositories/resetPasswordImpl';
import type { ResetPassword } from '../../domain/entities/resetpassword';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);

  const useCase = new ResetPasswordUseCase(new ResetPasswordRepoImpl());

  const resetPassword = async (data: ResetPassword) => {
    setLoading(true);

    try {
      const result = await useCase.execute(data);
      setLoading(false);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }

    } catch (err: any) {
      setLoading(false);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      toast.error(message);
    }
  };

  return { resetPassword, loading };
};