import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StartWorkRepoImpl } from "../../data/repositories/StartWorkRepoImpl";
import { StartWorkUsecase } from "../../domain/usecase/StartWorkUsecase";
import type { Startworkrequest } from "../../domain/entities/startwork";
import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import { toast } from "react-toastify";
import { ASSIGNED_WORKS_KEY } from "./useAssign";

export const useStartWork = () => {
  const queryClient = useQueryClient();
  const repo = new StartWorkRepoImpl();
  const usecase = new StartWorkUsecase(repo);

  return useMutation<Booking, any, Startworkrequest>({
    mutationKey: ["startWork"],

    mutationFn: (request) => usecase.execute(request),

    onSuccess: (startedBooking) => {
      // Update the assigned works cache to reflect the status change
      queryClient.setQueryData<Booking[]>(
        ASSIGNED_WORKS_KEY,
        (old) => {
          const safeOld = Array.isArray(old) ? old : [];
          return safeOld.map((booking) =>
            booking._id === startedBooking._id
              ? { ...booking, ...startedBooking, status: startedBooking.status || booking.status }
              : booking
          );
        }
      );

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