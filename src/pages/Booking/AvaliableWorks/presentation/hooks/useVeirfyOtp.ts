"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VerifyOtpCompleteImpl } from "../../data/repositories/VerifyWorkRepoImpl";
import { VerifyWorkUsecase } from "../../domain/usecase/VerifyWorkUsecase";
import type { verifyotp } from "../../domain/entities/verifyotp";
import type { Work } from "../../domain/entities/work";
import { toast } from "react-toastify";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
import { ASSIGNED_WORKS_KEY } from "./useAssign";
export function useVerifyOtp() {
  const queryClient = useQueryClient();
  const repo = new VerifyOtpCompleteImpl();
  const usecase = new VerifyWorkUsecase(repo);

  return useMutation<Work, any, verifyotp>({
    mutationFn: (data) => usecase.execute(data),

    onSuccess: (updatedWork) => {
      const id = updatedWork._id;

      // React Query
      queryClient.setQueryData(ASSIGNED_WORKS_KEY, (old: any[] = []) =>
        old.filter((w) => w._id !== id)
      );

      // Zustand sync
      useBookingSocketStore.getState().removeAssigned(id);

      toast.success("OTP verified successfully");
    },
  });
}