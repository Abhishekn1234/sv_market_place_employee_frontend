import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CompleteWorkRepoImpl } from "../../data/repositories/CompleteWorkRepoImpl";
import { CompleteWorkUsecase } from "../../domain/usecase/CompleteWorkUsecase";
import { toast } from "react-toastify";

import type { CompleteWork } from "../../domain/entities/completework";
import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import { ASSIGNED_WORKS_KEY } from "./useAssign";

type UseCompleteWorkOptions = {
  onSuccess?: (data: Booking) => void;
  onError?: (error: unknown) => void;
};

export function useCompleteWork(
  { onSuccess, onError }: UseCompleteWorkOptions = {}
) {
  const queryClient = useQueryClient();
  const repo = new CompleteWorkRepoImpl();
  const usecase = new CompleteWorkUsecase(repo);

  return useMutation<Booking, any, CompleteWork>({
    mutationFn: (data: CompleteWork) => usecase.execute(data),
    mutationKey: ["complete-work"],

    onSuccess: (completedBooking) => {
      const completedId =
        completedBooking?._id ||
        (completedBooking as Booking & { bookingId?: string })?.bookingId ||
        completedBooking?.id;

      // Update the assigned works cache to reflect the status change
      queryClient.setQueryData<Booking[]>(
        ASSIGNED_WORKS_KEY,
        (old) => {
          const safeOld = Array.isArray(old) ? old : [];
          return safeOld.map((booking) => {
            const bookingId =
              booking._id ||
              (booking as Booking & { bookingId?: string })?.bookingId ||
              booking.id;

            return bookingId === completedId
              ? {
                  ...booking,
                  ...completedBooking,
                  status: "WORK_COMPLETED_PENDING",
                  workStartedAt: undefined,
                }
              : booking;
          });
        }
      );

      console.log("Work completed successfully:", completedBooking);
      toast.success("Work completed successfully");

      if (onSuccess) onSuccess(completedBooking);
    },

    onError: (error: any) => {
      console.error("Error completing work:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Error completing work";

      toast.error(message);

      if (onError) onError(error);
    },
  });
}
