import { useQuery } from "@tanstack/react-query";
import { ProfileRepoImplementation } from "../../data/repositories/ProfileImpl";
import { ListProfileUsecase } from "../../domain/usecase/ListProfileusecase";

const repo = new ProfileRepoImplementation();
const usecase = new ListProfileUsecase(repo);

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => usecase.execute(),

    staleTime: 1000 * 60 * 5, // 5 mins
    gcTime: 1000 * 60 * 30,

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,

    retry: 1,
  });
}