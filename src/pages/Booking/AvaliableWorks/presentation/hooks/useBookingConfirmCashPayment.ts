import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { BookingConfirmCashPaymentRepoImpl } from "../../data/repositories/BookingConfirmCashPaymentRepoImpl";
import { BookingConfirmCashPaymentUsecase } from "../../domain/usecase/BookingConfirmCashPaymentUsecase";
import type { BookingConfirmCashPayment } from "../../domain/entities/bookingconfirmcashpayment";
import type { BookingConfirmCashPaymentResponse } from "../../domain/entities/bookingconfirmcashpaymentresponse";

export function useBookingConfirmCashPayment() {
  const repo = new BookingConfirmCashPaymentRepoImpl();
  const usecase = new BookingConfirmCashPaymentUsecase(repo);

  return useMutation<
    BookingConfirmCashPaymentResponse,
    any,
    BookingConfirmCashPayment
  >({
    mutationKey: ["booking-confirm-cash-payment"],

    mutationFn: (data) => usecase.execute(data),

    onSuccess: (response) => {
      toast.success(
        response.message || "Cash payment confirmed successfully"
      );

      console.log(response.payment);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to confirm cash payment"
      );
    },
  });
}