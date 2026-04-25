import { useQuery } from "@tanstack/react-query";
import { ProfileRepoImplementation } from "../../data/repositories/ProfileImpl";
import { ListProfileUsecase } from "../../domain/usecase/ListProfileusecase";


const repo = new ProfileRepoImplementation();
const usecase = new ListProfileUsecase(repo);

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => usecase.execute(),

    staleTime: 0, // 🔥 important
    gcTime: 1000 * 60 * 30,

    refetchOnMount: "always", // 🔥 MUST
    refetchOnWindowFocus: true, // optional but good

    retry: 1,
  });
}
