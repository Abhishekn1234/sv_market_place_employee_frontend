import { useAuthStore } from "@/core/store/auth";
import type { WorkerStatus } from "@/pages/Servicesettings/domain/entities/servicesettings";

export const getEmployeeStatus = (): WorkerStatus | null => {
  const { employeeData } = useAuthStore.getState();

  const status = employeeData?.user?.status as WorkerStatus | undefined;

  if (!status) return null;

  return status === "ONLINE" ? "ONLINE" : "OFFLINE";
};