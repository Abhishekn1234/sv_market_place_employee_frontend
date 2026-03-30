"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VerifyOtpCompleteImpl } from "../../data/repositories/VerifyWorkRepoImpl";
import { VerifyWorkUsecase } from "../../domain/usecase/VerifyWorkUsecase";
import type { verifyotp } from "../../domain/entities/verifyotp";
import type { Work } from "../../domain/entities/work";
import { toast } from "react-toastify";
export function useVerifyOtp() {
  const queryClient = useQueryClient();
  const repo = new VerifyOtpCompleteImpl();
  const usecase = new VerifyWorkUsecase(repo);

  return useMutation<Work, any, verifyotp>({
    mutationFn: (data: verifyotp) => usecase.execute(data),

    onSuccess: (updatedWork) => {

      
                queryClient.setQueryData<Work[]>(["assigned-works"], (oldData) => {
            if (!oldData) return [];

            // ✅ FORCE ARRAY SAFETY
            const safeData = Array.isArray(oldData) ? oldData : [oldData];

            return safeData.map((work) =>
              work._id === updatedWork._id ? updatedWork : work
            );
          });

      // // ✅ Optional but recommended
      // queryClient.invalidateQueries({
      //   queryKey: ["assigned-works"],
      //   exact: false,
      // });

      toast.success("OTP verified successfully");
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "OTP verification failed";

      toast.error(message);
    },
  });
}