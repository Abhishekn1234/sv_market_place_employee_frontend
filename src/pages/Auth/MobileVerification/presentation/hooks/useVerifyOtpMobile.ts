import { useMutation } from "@tanstack/react-query";
import { VerifyOtpMobileImpl } from "../../data/repositories/VerifyMobileImpl";
import { VerifyOtpMobileUsecase } from "../../domain/usecase/VerifyOtpMobileUsecase";
import type { VerifyOtpMobile } from "../../domain/entities/verifyotpmobile";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function useVerifyOtpMobile() {
  const repo = new VerifyOtpMobileImpl();
  const usecase = new VerifyOtpMobileUsecase(repo);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: VerifyOtpMobile) => usecase.execute(data),
    mutationKey: ["verify-otp-mobile"],
    onSuccess: (_res) => {
        // console.log(res);
      toast.success("Mobile OTP verified successfully");
      navigate("/login");
    },
 onError: (err: any) => {
  toast.error(
    err?.response?.data?.message ||
    err?.message ||
    "OTP Verification Failed"
  );
},
  });
}