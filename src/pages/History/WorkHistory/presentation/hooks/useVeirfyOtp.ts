"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VerifyOtpCompleteImpl } from "../../data/repositories/VerifyWorkRepoImpl";
import { VerifyWorkUsecase } from "../../domain/usecase/VerifyWorkUsecase";
import type { verifyotp } from "../../domain/entities/verifyotp";
import type { Work } from "../../domain/entities/workhistory";
import { toast } from "react-toastify";

export function useVerifyOtp() {
  const queryClient = useQueryClient();

  const repo = new VerifyOtpCompleteImpl();
  const usecase = new VerifyWorkUsecase(repo);

  return useMutation<Work, Error, verifyotp>({
    mutationKey: ["verify-otp"],

    mutationFn: (data: verifyotp) => usecase.execute(data),

    onSuccess: (updatedWork) => {
      // ✅ Update work-history cache
      queryClient.setQueryData<Work[]>(
        ["work-history"],
        (oldData) => {
          if (!oldData) return [updatedWork];

          return oldData.map((work) =>
            work._id === updatedWork._id ? updatedWork : work
          );
        }
      );

      toast.success("OTP verified successfully");
    },

    onError: (error) => {
      toast.error(error.message || "OTP verification failed");
    },
  });
}