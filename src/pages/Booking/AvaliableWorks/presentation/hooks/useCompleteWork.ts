import { useMutation } from "@tanstack/react-query";
import { CompleteWorkRepoImpl } from "../../data/repositories/CompleteWorkRepoImpl";
import { CompleteWorkUsecase } from "../../domain/usecase/CompleteWorkUsecase";
import { toast } from "react-toastify";

import type { CompleteWork } from "../../domain/entities/completework";
import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";

type UseCompleteWorkOptions = {
  onSuccess?: (data: Booking) => void;
  onError?: (error: unknown) => void;
};

export function useCompleteWork(
  { onSuccess, onError }: UseCompleteWorkOptions = {}
) {
  const repo = new CompleteWorkRepoImpl();
  const usecase = new CompleteWorkUsecase(repo);

  return useMutation<Booking, any, CompleteWork>({
    mutationFn: (data: CompleteWork) => usecase.execute(data),
    mutationKey: ["complete-work"],

    onSuccess: (data) => {
      console.log("Work completed successfully:", data);
      toast.success("Work completed successfully");

      if (onSuccess) onSuccess(data);
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