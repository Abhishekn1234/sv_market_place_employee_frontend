"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { VerifyOtpCompleteImpl } from "../../data/repositories/VerifyWorkRepoImpl";
import { VerifyWorkUsecase } from "../../domain/usecase/VerifyWorkUsecase";
import type { verifyotp } from "../../domain/entities/verifyotp";

import { ASSIGNED_WORKS_KEY } from "./useAssign";

export function useVerifyOtp() {
  const queryClient = useQueryClient();

  const repo = new VerifyOtpCompleteImpl();
  const usecase = new VerifyWorkUsecase(repo);

  return useMutation({
    mutationFn: (data: verifyotp) => usecase.execute(data),

    onSuccess: (response: any, variables) => {
      const bookingId =
        variables.bookingId ||
        variables.id ||
        variables.workId;

      if (!bookingId) {
        console.error("No bookingId found in variables", variables);
        return;
      }

      const updatedBooking = response?.booking ?? {};

      const nextStatus =
        updatedBooking.status ??
        response?.status ??
        response?.bookingStatus ??
        "INVOICE_GENERATED";

              queryClient.setQueryData(
          ASSIGNED_WORKS_KEY,
          (old: any[] = []) =>
            old.flatMap((work) => {
              const id = work._id || work.bookingId || work.id;

              if (id !== bookingId) {
                return [work];
              }

              if (nextStatus === "INVOICE_GENERATED") {
                return [];
              }

              return [
                {
                  ...work,
                  ...updatedBooking,
                  _id: work._id,
                  bookingId: work.bookingId,
                  status: nextStatus,
                  invoice:
                    response?.invoice ??
                    updatedBooking.invoice ??
                    work.invoice,
                  completedAt: new Date().toISOString(),
                },
              ];
            })
        );

      // ❌ Do NOT remove from Zustand
      // useBookingSocketStore.getState().removeAssigned(bookingId);

      // ❌ Do NOT refetch
      // queryClient.invalidateQueries({
      //   queryKey: ASSIGNED_WORKS_KEY,
      // });

      toast.success(
        response?.message ??
          "OTP verified successfully"
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "OTP verification failed"
      );
    },
  });
}