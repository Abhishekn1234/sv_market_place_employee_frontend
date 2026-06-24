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
  const bookingId = variables.bookingId || variables.id || variables.workId;

  if (!bookingId) {
    console.error("No bookingId found in variables", variables);
    return;
  }

  const nextStatusRaw =
    response?.booking?.status ??
    response?.status ??
    response?.bookingStatus;

  // ✅ Update cache in place — no refetch needed
  queryClient.setQueryData(
    ASSIGNED_WORKS_KEY,
    (old: any[] = []) =>
      old.map((work) => {
        const id = work._id || work.bookingId || work.id;
        if (id !== bookingId) return work;
        return {
          ...work,
          status: nextStatusRaw ?? "INVOICE_GENERATED",
          invoice: response?.invoice ?? response?.booking?.invoice,
          completedAt: new Date().toISOString(),
        };
      })
  );

  // ✅ Zustand sync
  useBookingSocketStore.getState().removeAssigned(bookingId);

  // ❌ Remove this — it refetches and causes the flicker
  // queryClient.invalidateQueries({ queryKey: ASSIGNED_WORKS_KEY });

  toast.success(response?.message || "OTP verified successfully");
},

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "OTP verification failed"
      );
    },
  });
}