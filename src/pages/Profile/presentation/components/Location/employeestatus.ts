import { useAuthStore } from "@/core/store/auth";

import type { WorkerStatus } from "@/pages/Servicesettings/domain/entities/workerstatus";

export const getEmployeeStatus = (): WorkerStatus | null => {
  const { user } = useAuthStore.getState();

  const status = user?.worker?.status as WorkerStatus | undefined;

  if (!status) return null;

  return status === "ONLINE" ? "ONLINE" : "OFFLINE";
};