"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VerifyOtpCompleteImpl } from "../../data/repositories/VerifyWorkRepoImpl";
import { VerifyWorkUsecase } from "../../domain/usecase/VerifyWorkUsecase";

import type { verifyotp } from "../../domain/entities/verifyotp";

import { toast } from "react-toastify";

import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
import { ASSIGNED_WORKS_KEY } from "./useAssign";

export function useVerifyOtp() {
  const queryClient = useQueryClient();

  const repo = new VerifyOtpCompleteImpl();
  const usecase = new VerifyWorkUsecase(repo);

  return useMutation({
    mutationFn: (data: verifyotp) => usecase.execute(data),

    onSuccess: (response: any, variables) => {
      // ✅ booking id from mutation payload
      const bookingId =
        variables.bookingId ||
        variables.id ||
        variables.workId;

      if (!bookingId) {
        console.error("No bookingId found in variables", variables);
        return;
      }

      // ✅ UPDATE CACHE
      queryClient.setQueryData(
        ASSIGNED_WORKS_KEY,
        (old: any[] = []) =>
          old.map((work) => {
            const id =
              work._id ||
              work.bookingId ||
              work.id;

            if (id !== bookingId) return work;

            return {
              ...work,

              // ✅ update status
              status: "INVOICE_GENERATED",

              // ✅ attach invoice details
              invoice: response?.invoice,

              // optional
              completedAt: new Date().toISOString(),
            };
          })
      );

      // ✅ Zustand sync
      useBookingSocketStore
        .getState()
        .removeAssigned(bookingId);

      // ✅ optional refetch
      queryClient.invalidateQueries({
        queryKey: ASSIGNED_WORKS_KEY,
      });

      toast.success(
        response?.message ||
          "OTP verified successfully"
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "OTP verification failed"
      );
    },
  });
}