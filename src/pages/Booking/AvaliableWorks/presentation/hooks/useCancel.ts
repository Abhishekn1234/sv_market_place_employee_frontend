import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CancelImpl } from "../../data/repositories/CancelImpl";
import { CancelWorkUsecase } from "../../domain/usecase/CancelWorkUsecase";
import type { GetBooking } from "@/core/Websocket/domain/entities/getrepo";
import { toast } from "react-toastify";
import type { CancelWork } from "../../domain/entities/cancelwork";

export function useCancel(_addBooking?: (booking: GetBooking) => void) {
  const queryClient = useQueryClient();

  const repo = new CancelImpl();
  const usecase = new CancelWorkUsecase(repo);

  return useMutation({
    mutationFn: (data:CancelWork) => usecase.execute(data),

    onSuccess: (cancelledBooking) => {
  queryClient.setQueryData<GetBooking[]>(
    ["assigned-works"],
    (old = []) =>
      old.filter((b) => b._id !== cancelledBooking._id) // ✅ REMOVE
  );

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