// presentation/hooks/useOtp.ts
import { useMutation } from "@tanstack/react-query";
import { VerifyOtpImpl } from "../../data/repositories/VerifyOtpImpl";
import { VerifyOtpUsecase } from "../../domain/usecase/verifyusecase";
import type { VerifyOtp, VerifyOtpPayload } from "../../domain/entites/verify";

export function useOtp() {
  const repo = new VerifyOtpImpl();
  const usecase = new VerifyOtpUsecase(repo);

  return useMutation<VerifyOtp, Error, VerifyOtpPayload>({
    mutationFn: (payload) => usecase.execute(payload),
  });
}
