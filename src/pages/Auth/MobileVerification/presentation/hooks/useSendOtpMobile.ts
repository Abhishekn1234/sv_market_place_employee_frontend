
import { useMutation } from "@tanstack/react-query";
import { SendOtpMobileImpl } from "../../data/repositories/SendOtpMobileImpl";
import { SendOtpMobileUsecase } from "../../domain/usecase/SendOtpMobileUsecase";
import type { SendOtpMobile } from "../../domain/entities/sendotpmobile";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function useSendOtpMobile() {
  const repo = new SendOtpMobileImpl();
  const usecase = new SendOtpMobileUsecase(repo);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: SendOtpMobile) => usecase.execute(data),
    mutationKey: ["send-otp-mobile"],
    onSuccess: (res) => {
      const hash = res?.hash; 
      if (hash) {
        toast.success("OTP sent to mobile successfully");
        navigate("/verify-otp-mobile", { state: { hash } });
      } else {
        toast.error("Failed to get OTP hash from server");
      }
    },
  onError: (err: any) => {
  console.error("OTP ERROR:", err);

  toast.error(
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong"
  );
},
  });
}