import { useQuery } from "@tanstack/react-query";
import { AssignedWorkImpl } from "../../data/repositories/AssignedImpl";
import { GetAssignedWorkUsecase } from "../../domain/usecase/GetAssignedWorkUsecase";

export function useAssign(open: boolean) {  // <-- accept open here
  const repo = new AssignedWorkImpl();
  const usecase = new GetAssignedWorkUsecase(repo);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["assigned-works"],
    queryFn: () => usecase.execute(),
    enabled: open,              // <-- only fetch when modal is open
    staleTime: 30_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    select: (data) => Array.isArray(data) ? data : data ? [data] : [],
  });

  return {
    assignedWorks: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}



