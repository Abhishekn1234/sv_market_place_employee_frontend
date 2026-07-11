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

   onSuccess: (response: any, _variables) => {
  const invoiceId = response?.invoice?.invoiceId;

  toast.success(response?.message ?? "Success");

  if (!invoiceId) {
    console.error("No invoiceId found", response);
    return;
  }

      queryClient.setQueryData(
        ASSIGNED_WORKS_KEY,
        (old: any[] = []) =>
          old.filter((work) => {
            const workInvoiceId =
              work.invoice?.invoiceId ||
              work.invoiceId ||
              work.booking?.invoice?.invoiceId;

            return workInvoiceId !== invoiceId;
          })
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