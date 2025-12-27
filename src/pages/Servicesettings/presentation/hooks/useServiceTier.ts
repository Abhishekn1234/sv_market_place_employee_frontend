import { useQuery } from "@tanstack/react-query";
import { ServiceTierImpl } from "../../data/repositories/servicetierImpl";
import { ServiceTierUsecase } from "../../domain/usecase/servicetierusecase";
import type { ServiceTier } from "../../domain/entities/servicetier";

// ✅ Create once
const repo = new ServiceTierImpl();
const usecase = new ServiceTierUsecase(repo);

export function useServiceTier() {
  return useQuery<ServiceTier[], Error>({
    queryKey: ["service-tiers"], // 🔴 plural + consistent
    queryFn: () => usecase.execute(),

    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
