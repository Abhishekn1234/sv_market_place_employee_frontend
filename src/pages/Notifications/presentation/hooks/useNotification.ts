import { useEffect } from "react";
import { useForegroundNotifications } from "./useForegroundNotifications";
import { useGetNotifications } from "./useGetNotifications";
import { useAuthStore } from "@/core/store/auth";


export const useNotifications = (params?: any) => {
  const query = useGetNotifications(params);

  const setNotifications = useAuthStore(
    (s) => s.setNotifications
  );

  useEffect(() => {
    if (!query.data) return;

    const data = Array.isArray(query.data)
      ? query.data
      : query.data?.data || [];

    setNotifications(data);
  }, [query.data, setNotifications]);

  useForegroundNotifications(query.data);

  return query;
};