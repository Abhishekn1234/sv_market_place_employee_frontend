import { useQuery } from "@tanstack/react-query";
import { DisputesRepoImpl } from "../../data/repositories/DisputesRepoImpl";
import { GetDisputesUsecase } from "../../domain/usecase/GetDisputesUsecase";

export function useGetDisputes() {
  const repo = new DisputesRepoImpl();
  const usecase = new GetDisputesUsecase(repo);

  return useQuery({
    queryKey: ["disputes"],
    queryFn: () => usecase.execute(),
  });
}