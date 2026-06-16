import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DisputesRepoImpl } from "../../data/repositories/DisputesRepoImpl";
import { RespondDisputesUsecase } from "../../domain/usecase/RespondDisputesUsecase";
import type { DisputesRespond } from "../../domain/entities/disputesrespond";
import { toast } from "react-toastify";

export function useRespondDisputes() {
  const queryClient = useQueryClient();

  const repo = new DisputesRepoImpl();
  const usecase = new RespondDisputesUsecase(repo);

  return useMutation({
    mutationFn: (payload: DisputesRespond) =>
      usecase.execute(payload),

    onSuccess: (res: any, variables) => {
      // support multiple API shapes
      const updated = res?.dispute ?? res;

      queryClient.setQueryData(["disputes"], (old: any[] = []) => {
        if (!Array.isArray(old)) return old;

        return old.map((d) =>
          d._id === (updated?._id || variables.disputeId)
            ? {
                ...d,
                workerResponse: variables.response, // 🔥 guaranteed instant UI update
                status: "RESOLVED",
              }
            : d
        );
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