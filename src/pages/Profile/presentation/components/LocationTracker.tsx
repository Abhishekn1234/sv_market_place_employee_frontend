// components/LocationTracker.tsx
import { useDynamicLocation } from "@/utils/useNotification";

export function LocationTracker() {
  useDynamicLocation();
  return null; // This component doesn't render anything
}