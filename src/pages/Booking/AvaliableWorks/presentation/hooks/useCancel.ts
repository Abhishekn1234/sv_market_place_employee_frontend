import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CancelImpl } from "../../data/repositories/CancelImpl";
import { CancelWorkUsecase } from "../../domain/usecase/CancelWorkUsecase";
import type { GetBooking } from "@/core/Websocket/domain/entities/getrepo";
import { toast } from "react-toastify";

export function useCancel(addBooking?: (booking: GetBooking) => void) {
  const queryClient = useQueryClient();

  const repo = new CancelImpl();
  const usecase = new CancelWorkUsecase(repo);

  return useMutation({
    mutationFn: (bookingId: string) => usecase.execute(bookingId),

    onSuccess: (cancelledBooking) => {

      queryClient.setQueryData<GetBooking[] | GetBooking>(
        ["assignedWorks"],
        (oldData) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData)) {
            return oldData.map((booking) =>
              booking._id === cancelledBooking._id
                ? cancelledBooking
                : booking
            );
          }

          if (oldData._id === cancelledBooking._id) {
            return cancelledBooking;
          }

          return oldData;
        }
      );

      if (addBooking) addBooking(cancelledBooking);

      toast.success("Booking cancelled successfully");
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to cancel booking";

      toast.error(message);
    },
  });
}