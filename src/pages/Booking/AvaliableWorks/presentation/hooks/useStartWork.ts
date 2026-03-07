import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StartWorkRepoImpl } from "../../data/repositories/StartWorkRepoImpl";
import { StartWorkUsecase } from "../../domain/usecase/StartWorkUsecase";
import type { Startworkrequest } from "../../domain/entities/startwork";
import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import { toast } from "react-toastify";

export const useStartWork = () => {
  const queryClient = useQueryClient();

  const repo = new StartWorkRepoImpl();
  const usecase = new StartWorkUsecase(repo);

  return useMutation<Booking, any, Startworkrequest>({
    mutationKey: ["startWork"],

    mutationFn: (request: Startworkrequest) =>
      usecase.execute(request),

    onSuccess: (updatedBooking, variables) => {
      toast.success("Work started successfully");
      console.log(updatedBooking);

    
      queryClient.setQueryData(["work-history"], (oldData: any) => {
        if (!oldData) return oldData;

        return oldData.map((work: any) => {
          if (work.booking?._id === variables.bookingId) {
            return {
              ...work,
              status: "STARTED",
              booking: {
                ...work.booking,
                status: "IN_PROGRESS",
              },
            };
          }
          return work;
        });
      });
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