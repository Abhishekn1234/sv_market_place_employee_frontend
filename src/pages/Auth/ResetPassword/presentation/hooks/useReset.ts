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
        toast.success(result.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(result.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || 'Something went wrong', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return { resetPassword, loading };
};
