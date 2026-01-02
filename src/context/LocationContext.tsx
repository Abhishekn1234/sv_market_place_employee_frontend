import { createContext, useContext, useState, type ReactNode } from "react";

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
