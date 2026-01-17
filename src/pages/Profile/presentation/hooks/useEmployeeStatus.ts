import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/core/store/auth";

export type EmployeeStatus = "ONLINE" | "OFFLINE";
const EVENT_NAME = "employee-status-changed";

const normalizeStatus = (status: string | undefined | null): EmployeeStatus => {
  return status?.toUpperCase() === "ONLINE" ? "ONLINE" : "OFFLINE";
};

export function useEmployeeStatus() {
  const { employeeData, updateUserStatus } = useAuthStore();
  const queryClient = useQueryClient();

  const [status, setStatusState] = useState<EmployeeStatus>(
    () => normalizeStatus(employeeData?.user?.status)
  );

  const writeStatus = (newStatus: EmployeeStatus) => {
    // 1️⃣ Update Zustand store (only pass the status)
    updateUserStatus(newStatus);

    // 2️⃣ Update local state
    setStatusState(newStatus);

    // 3️⃣ Update React Query cache
    queryClient.setQueryData(["employeeStatus"], newStatus);

    // 4️⃣ Notify same-tab listeners
    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, { detail: newStatus })
    );
  };

  // Same-tab updates
  useEffect(() => {
    const handler = (e: Event) => {
      const evt = e as CustomEvent<EmployeeStatus>;
      setStatusState(evt.detail);
      queryClient.setQueryData(["employeeStatus"], evt.detail);
    };

    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, [queryClient]);

  // Cross-tab updates
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
