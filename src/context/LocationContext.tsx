import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type LatLng = { lat: number; lng: number };

interface LocationContextType {
  currentLocation: LatLng | null;
  setCurrentLocation: (loc: LatLng) => void;
  isTracking: boolean;
  startTracking: () => void;
  stopTracking: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const LocationProvider = ({ children }: Props) => {
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [isTracking, setIsTracking] = useState(true);

  useEffect(() => {
    let watchId: number;
    if (isTracking && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTracking]);

  const startTracking = () => setIsTracking(true);
  const stopTracking = () => setIsTracking(false);

  return (
    <LocationContext.Provider
      value={{ currentLocation, setCurrentLocation, isTracking, startTracking, stopTracking }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocationContext must be used within LocationProvider");
  return context;
};
