import { useMutation } from "@tanstack/react-query";
import { VerifyOtpEmailImpl } from "../../data/repositories/VerifyOtpEmailImpl";
import { VerifyOtpEmailUsecase } from "../../domain/usecase/VerifyOtpEmailUsecase";
import type { VerifyOtpEmail } from "../../domain/entities/verifyotp";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function useVerifyOtpEmail() {
  const repo = new VerifyOtpEmailImpl();
  const usecase = new VerifyOtpEmailUsecase(repo);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: VerifyOtpEmail) => usecase.execute(data),
    mutationKey: ["verify-otp-email"],
    onSuccess: () => {
      toast.success("OTP verified successfully");
      navigate("/login"); 
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        toast.error(`OTP Verification Error: ${err.message}`);
      } else {
        toast.error(`OTP Verification Error: ${String(err)}`);
      }
    },
  });
}