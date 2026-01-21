// import { reverseGeocode } from "./reverseGeocode";

import { useAuthStore } from "@/core/store/auth";
import type { GeoPoint } from "@/pages/Profile/domain/entities/location";


/* ---------- Last Saved Location ---------- */
// export const getLastNotifiedLocation = async () => {
//   const stored = localStorage.getItem("lastNotifiedLocation");
//   if (!stored) return null;

//   try {
//     const { lat, lng } = JSON.parse(stored);
//     const placeName = await reverseGeocode(lat, lng);
//     return { lat, lng, placeName };
//   } catch {
//     return null;
//   }
// };


export const getLastNotifiedLocation = () => {
  return useAuthStore.getState().employeeData?.user?.location ?? null;
};

/**
 * Update the last notified location in the auth store
 */
export const setLastNotifiedLocation = (location: GeoPoint) => {
  const state = useAuthStore.getState();
  if (!state.employeeData?.user) return;

  useAuthStore.setState({
    employeeData: {
      ...state.employeeData,
      user: {
        ...state.employeeData.user,
        location,
      },
    },
  });
};
