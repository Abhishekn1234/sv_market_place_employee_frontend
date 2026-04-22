import { useQuery } from "@tanstack/react-query";
import { AssignedWorkImpl } from "../../domain/repositories/AssignedImpl";
import { GetAssignedWorkUsecase } from "../../domain/usecase/GetAssignedWorkUsecase";

export const ASSIGNED_WORKS_KEY = ["assigned-works"];

export function useAssign(open: boolean = true) {
  const repo = new AssignedWorkImpl();
  const usecase = new GetAssignedWorkUsecase(repo);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ASSIGNED_WORKS_KEY,
    queryFn: async () => {
      const res = await usecase.execute();
      return Array.isArray(res) ? res : res ? [res] : [];
    },
    enabled: open,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  return {
    assignedWorks: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}


