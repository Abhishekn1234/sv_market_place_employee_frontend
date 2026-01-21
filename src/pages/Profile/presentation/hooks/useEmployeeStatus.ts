import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/core/store/auth";
import type { EmployeeStatus } from "../../domain/entities/employeestatus";
const EVENT_NAME = "employee-status-changed";

const normalizeStatus = (status: EmployeeStatus): EmployeeStatus => {
  return status?.toUpperCase() === "ONLINE" ? "ONLINE" : "OFFLINE";
};

export function useEmployeeStatus() {
  const { employeeData, updateUserStatus } = useAuthStore();
  const queryClient = useQueryClient();

  const [status, setStatusState] = useState<EmployeeStatus>(
    () => normalizeStatus(employeeData?.user?.status?.toString() as EmployeeStatus)
  );

  const writeStatus = (newStatus: EmployeeStatus) => {
    
    updateUserStatus(newStatus);

    setStatusState(newStatus);

 
    queryClient.setQueryData(["employeeStatus"], newStatus);

    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, { detail: newStatus })
    );
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const evt = e as CustomEvent<EmployeeStatus>;
      setStatusState(evt.detail);
      queryClient.setQueryData(["employeeStatus"], evt.detail);
    };

    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, [queryClient]);


  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "auth-store" && e.newValue) {
        try {
          const data: any = JSON.parse(e.newValue);
          const newStatus = normalizeStatus(data?.state?.employeeData?.user?.status);
          setStatusState(newStatus);
          queryClient.setQueryData(["employeeStatus"], newStatus);
        } catch {}
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [queryClient]);

  return {
    status,
    isOnline: status === "ONLINE",
    setOnline: () => writeStatus("ONLINE"),
    setOffline: () => writeStatus("OFFLINE"),
    setStatus: writeStatus,
  };
}
