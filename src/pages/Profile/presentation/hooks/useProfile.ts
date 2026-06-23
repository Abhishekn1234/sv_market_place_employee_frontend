import { useQuery } from "@tanstack/react-query";
import { ProfileRepoImplementation } from "../../data/repositories/ProfileImpl";
import { ListProfileUsecase } from "../../domain/usecase/ListProfileusecase";

const repo = new ProfileRepoImplementation();
const usecase = new ListProfileUsecase(repo);

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      // console.log("PROFILE API CALLED");
      return await usecase.execute();
    },

    staleTime: 0,
    gcTime: 1000 * 60 * 30,

    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,

    retry: 1,
  });
}