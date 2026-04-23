import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import type { Worker } from "@/pages/Profile/domain/entities/workertype";
import { useServiceSettings } from "@/pages/Servicesettings/presentation/hooks/useServicesettings";
import type { WorkerPayload } from "@/pages/Servicesettings/domain/entities/workerpayload";
import { useAuthStore } from "@/core/store/auth";

export function useWorkerStatus() {
  const [loading, setLoading] = useState(false);

  const { user, updateUserStatus } = useAuthStore();
  const serviceSettingsMutation = useServiceSettings();


  const worker: Worker | null = user?.worker
    ? (user.worker as any as Worker)
    : null;

  const updateStatus = useCallback(
    (isOnline: boolean) => {
      if (!worker) return;

      setLoading(true);

      const payload: WorkerPayload = {
        status: isOnline ? "ONLINE" : "OFFLINE",
      };

      serviceSettingsMutation.mutate(payload, {
        onSuccess: () => {
          updateUserStatus(payload.status); 
          toast.success(`Status updated to ${payload.status}`);
          setLoading(false);
        },

        onError: (err: any) => {
          const message =
            err?.response?.data?.message || 
            err?.message ||                 
            "Failed to update status";

          toast.error(message);
          setLoading(false);
        },
      });
    },
    [serviceSettingsMutation, worker, updateUserStatus]
  );

  return {
    worker,
    loading,
    updateStatus,
  };
}
