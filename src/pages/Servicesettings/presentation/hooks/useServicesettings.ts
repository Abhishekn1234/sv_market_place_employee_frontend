import { useMutation,  useQueryClient } from "@tanstack/react-query";
import { ServiceSettingsRepoimpl } from "../../data/repositories/servicesettingImpl";
import { ServiceSettingsUseCase } from "../../domain/usecase/servicesettingsusecase";
import type {  WorkerPayload } from "../../domain/entities/servicesettings";
import { toast } from "react-toastify";


export function useServiceSettings() {
  const repo = new ServiceSettingsRepoimpl();
  const usecase = new ServiceSettingsUseCase(repo);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkerPayload) => usecase.execute(data),
    onSuccess(data) {
      toast.success("Service Settings Updated");
      queryClient.setQueryData(["profile"], data);
    },
    onError(err: any) {
      toast.error(err.message);
      console.log(err);
    },
  });
}
