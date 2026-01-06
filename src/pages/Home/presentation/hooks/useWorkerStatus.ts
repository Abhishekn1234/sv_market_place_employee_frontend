import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import type { Worker } from "@/pages/Profile/domain/entities/profile";
import { useServiceSettings } from "@/pages/Servicesettings/presentation/hooks/useServicesettings";
import type { WorkerPayload } from "@/pages/Servicesettings/domain/entities/servicesettings";

export function useWorkerStatus() {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Safely initialize the mutation
  const serviceSettingsMutation = useServiceSettings();

  // 🔹 Load initial status from localStorage once
  useEffect(() => {
    const stored = localStorage.getItem("employeeData");
    if (!stored) return;

    try {
      const data = JSON.parse(stored);
      if (data?.user?.status) {
        setWorker({ status: data.user.status } as Worker);
      }
    } catch (err) {
      console.error("Failed to parse employeeData from localStorage", err);
    }
  }, []);

  // 🔹 Update worker status
  const updateStatus = useCallback(
  (isOnline: boolean) => {
    setLoading(true);

    const payload: WorkerPayload = {
      status: isOnline ? "ONLINE" : "OFFLINE",
    };

    serviceSettingsMutation.mutate(payload, {
      onSuccess: () => {
        // Update local state safely
       setWorker(prev =>
  prev
    ? { ...prev, status: payload.status }
    : {
        status: payload.status!,
        categoryIds: [],
        serviceTierIds: [],
      }
);

        // Update localStorage
        const stored = localStorage.getItem("employeeData");
        if (stored) {
          const data = JSON.parse(stored);
          if (data?.user) {
            data.user.status = payload.status;
            localStorage.setItem("employeeData", JSON.stringify(data));
          }
        }

        toast.success(`Status updated to ${payload.status}`);
        setLoading(false);
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to update status");
        setLoading(false);
      },
    });
  },
  [serviceSettingsMutation]
);


  return { worker, loading, updateStatus };
}
