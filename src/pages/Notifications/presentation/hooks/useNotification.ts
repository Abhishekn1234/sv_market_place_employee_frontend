
import { useForegroundNotifications } from "./useForegroundNotifications";
import { useGetNotifications } from "./useGetNotifications";



export const useNotifications = (params?: any) => {
  const query = useGetNotifications(params);

  useForegroundNotifications(query.data);

  return query;
};