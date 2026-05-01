import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DisputesRepoImpl } from "../../data/repositories/DisputesRepoImpl";
import { RespondDisputesUsecase } from "../../domain/usecase/RespondDisputesUsecase";
import type { DisputesRespond } from "../../domain/entities/disputesrespond";
import { upsertDisputeInCache } from "../utils/upsertDisputes";


export function useRespondDisputes() {
  const queryClient = useQueryClient();

  const repo = new DisputesRepoImpl();
  const usecase = new RespondDisputesUsecase(repo);

  return useMutation({
    mutationFn: (payload: DisputesRespond) =>
      usecase.execute(payload),

    onSuccess: (updatedDispute) => {
     
      upsertDisputeInCache(queryClient, updatedDispute);
    },
  });
}