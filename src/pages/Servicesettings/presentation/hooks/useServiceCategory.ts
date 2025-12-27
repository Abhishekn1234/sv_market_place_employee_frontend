import { useQuery } from "@tanstack/react-query";
import { ServiceCategoryImpl } from "../../data/repositories/servicecategoryImpl";
import { ServiceCategoryUsecase } from "../../domain/usecase/servicecategoryusecase";
import type { ServiceCategory } from "../../domain/entities/servicecategory";

// ✅ Create once (singleton-like)
const repo = new ServiceCategoryImpl();
const usecase = new ServiceCategoryUsecase(repo);

export function useServiceCategory() {
  return useQuery<ServiceCategory[], Error>({
    queryKey: ["service-categories"],
    queryFn: () => usecase.getServiceCategories(),

    // ✅ caching controls
    staleTime: 1000 * 60 * 10,     // 10 minutes
    gcTime: 1000 * 60 * 30,     // 30 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
