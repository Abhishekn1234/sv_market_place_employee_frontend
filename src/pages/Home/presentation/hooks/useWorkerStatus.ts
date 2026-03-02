import { useState, useCallback,  } from "react";
import { toast } from "react-toastify";
import type { Worker } from "@/pages/Profile/domain/entities/workertype";
import { useServiceSettings } from "@/pages/Servicesettings/presentation/hooks/useServicesettings";
import type { WorkerPayload } from "@/pages/Servicesettings/domain/entities/servicesettings";
import { useAuthStore } from "@/core/store/auth";


export function useWorkerStatus() {
  const [loading, setLoading] = useState(false);

  const { user, updateUserStatus } = useAuthStore();

  const serviceSettingsMutation = useServiceSettings();

  // 🔹 Worker derived from Zustand (single source of truth)
  const worker: Worker | null = user?.worker
    ? (user.worker as  any as Worker)
    : null;

  // 🔹 Update worker status
  const updateStatus = useCallback(
  (isOnline: boolean) => {
    if (!worker) return;

    setLoading(true);

    const payload: WorkerPayload = {
      status: isOnline ? "ONLINE" : "OFFLINE",
    };

    serviceSettingsMutation.mutate(payload, {
      onSuccess: () => {
        updateUserStatus(payload.status); // ✅ FIXED
        toast.success(`Status updated to ${payload.status}`);
        setLoading(false);
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to update status");
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

