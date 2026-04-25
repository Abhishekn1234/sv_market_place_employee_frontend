import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AcceptRepoImpl } from "../../data/repositories/AcceptRepoImpl";
import { AcceptUsecase } from "../../domain/usecase/AcceptWorkUsecase";
import type { AcceptWork } from "../../domain/entities/acceptwork";

import { toast } from "react-toastify";

export function useAccept() {
  const repo = new AcceptRepoImpl();
  const usecase = new AcceptUsecase(repo);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AcceptWork) => usecase.execute(data),

            onSuccess(_, variables) {
          toast.success("Work Accepted Successfully");
        console.log("Accepted work ID:", variables);
          
          queryClient.invalidateQueries({
            queryKey: ["assigned-works"],
          });
        },

   onError(err: any) {
  const message =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Failed to accept work";

  toast.error(message);
  console.error(err);
},
  });
}
