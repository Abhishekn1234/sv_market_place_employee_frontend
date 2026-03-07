import { useQuery } from "@tanstack/react-query";
import { ProfileRepoImplementation } from "../../data/repositories/ProfileImpl";
import { ListProfileUsecase } from "../../domain/usecase/ListProfileusecase";


const repo = new ProfileRepoImplementation();
const usecase = new ListProfileUsecase(repo);

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => usecase.execute(),

    staleTime: Infinity, 
    gcTime: 1000 * 60 * 30, 
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
