import { useMutation } from "@tanstack/react-query";
import { SendOtpEmailImpl } from "../../data/repositories/SendOtpEmailImpl";
import { SendOtpEmailUsecase } from "../../domain/usecase/SendOtpEmailUsecase";
import type { SendOtpEmail } from "../../domain/entities/sendotp";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function useSendOtpEmail() {
  const repo = new SendOtpEmailImpl();
  const usecase = new SendOtpEmailUsecase(repo);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: SendOtpEmail) => usecase.execute(data),
    mutationKey: ["send-otp-email"],
    onSuccess: (data) => {
      const hash = data?.hash;
      if (hash) {
        toast.success("OTP sent to email successfully");
        navigate("/verify-otp-email", { state: { hash } }); // pass hash to verify page
      } else {
        toast.error("Failed to get OTP hash from server");
      }
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        toast.error(`OTP ERROR: ${err.message}`);
      } else {
        toast.error(`OTP ERROR: ${String(err)}`);
      }
    },
  });
}