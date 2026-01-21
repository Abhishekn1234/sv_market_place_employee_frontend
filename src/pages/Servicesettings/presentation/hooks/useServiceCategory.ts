import { useQuery } from "@tanstack/react-query";
import { ServiceCategoryImpl } from "../../data/repositories/servicecategoryImpl";
import { ServiceCategoryUsecase } from "../../domain/usecase/servicecategoryusecase";
import type { ServiceCategory } from "../../domain/entities/servicecategory";

const repo = new ServiceCategoryImpl();
const usecase = new ServiceCategoryUsecase(repo);

export function useServiceCategory() {
  return useQuery<ServiceCategory[], Error>({
    queryKey: ["service-categories"],
    queryFn: () => usecase.getServiceCategories(),

    staleTime: 1000 * 60 * 10,    
    gcTime: 1000 * 60 * 30,     
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
