import { useQuery } from "@tanstack/react-query";
import { ProfileRepoImplementation } from "../../data/repositories/ProfileImpl";
import { ListProfileUsecase } from "../../domain/usecase/ListProfileusecase";

// ✅ create once
const repo = new ProfileRepoImplementation();
const usecase = new ListProfileUsecase(repo);

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => usecase.execute(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}
