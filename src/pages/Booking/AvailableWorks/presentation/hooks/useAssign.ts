import { useQuery } from "@tanstack/react-query";
import { AssignedWorkImpl } from "../../domain/repositories/AssignedImpl";
import { GetAssignedWorkUsecase } from "../../domain/usecase/GetAssignedWorkUsecase";
import { usePreferredLanguage } from "@/core/store/auth";

export const ASSIGNED_WORKS_KEY = ["assigned-works"];

export function useAssign(open: boolean = true) {
  const language = usePreferredLanguage();
  const repo = new AssignedWorkImpl();
  const usecase = new GetAssignedWorkUsecase(repo);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...ASSIGNED_WORKS_KEY, language],
    queryFn: async () => {
      const res = await usecase.execute();
      // Ensure we always return an array
      return Array.isArray(res) ? res : res ? [res] : [];
    },
    enabled: open,
    
    staleTime: 30_000,
    refetchOnWindowFocus: true, // Enable refetch on window focus for real-time updates
      refetchOnReconnect: true,
  
  });

  return {
    assignedWorks: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}


