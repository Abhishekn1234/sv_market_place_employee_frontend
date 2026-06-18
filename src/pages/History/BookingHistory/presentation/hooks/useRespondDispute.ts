import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DisputesRepoImpl } from "../../data/repositories/DisputesRepoImpl";
import { RespondDisputesUsecase } from "../../domain/usecase/RespondDisputesUsecase";
import type { DisputesRespond } from "../../domain/entities/disputesrespond";
import { toast } from "react-toastify";
import { initializeSocket } from "@/core/Websocket/presentation/components/socket";
import { BookingEvents } from "@/components/common/BookingEvents";

export function useRespondDisputes() {
  const queryClient = useQueryClient();

  const repo = new DisputesRepoImpl();
  const usecase = new RespondDisputesUsecase(repo);

  return useMutation({
    mutationFn: (payload: DisputesRespond) =>
      usecase.execute(payload),

    onSuccess: (res: any, variables) => {
      const updated = res?.dispute ?? res;
      //  console.log(updated);
      // Update cache instantly
      queryClient.setQueryData(["disputes"], (old: any[] = []) => {
        if (!Array.isArray(old)) return old;

        return old.map((d) =>
          d._id === (updated?._id || variables.disputeId)
            ? {
                ...d,
                ...updated,
                workerResponse:
                  updated?.workerResponse ??
                  variables.response,
              }
            : d
        );
      });

      
      const socket = initializeSocket("/workers/assigned-updates");

      // Choose event based on dispute status
      const event =
        updated?.status === "RESOLVED"
          ? BookingEvents.DISPUTE_RESOLVED
          : BookingEvents.DISPUTE_RESPONDED;
 
      socket.emit(event, {
        disputeId: updated?._id ?? variables.disputeId,
        status: updated?.status,
        response: variables.response,
        dispute: updated,
      });

      toast.success("Response submitted successfully");
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Failed to submit response"
      );
    },
  });
}