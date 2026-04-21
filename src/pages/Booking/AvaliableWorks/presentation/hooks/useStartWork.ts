import { useMutation } from "@tanstack/react-query";
import { StartWorkRepoImpl } from "../../data/repositories/StartWorkRepoImpl";
import { StartWorkUsecase } from "../../domain/usecase/StartWorkUsecase";
import type { Startworkrequest } from "../../domain/entities/startwork";
import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import { toast } from "react-toastify";

export const useStartWork = () => {
  const repo = new StartWorkRepoImpl();
  const usecase = new StartWorkUsecase(repo);

  return useMutation<Booking, any, Startworkrequest>({
    mutationKey: ["startWork"],

    mutationFn: (request) => usecase.execute(request),

    onSuccess: () => {
      // ONLY UI feedback
      toast.success("Work started successfully");
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to start work";

      toast.error(message);
    },
  });
};