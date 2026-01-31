import { CommonMap, type LocationMode } from "@/components/common/CommonMap";

interface MapPickerProps {
  tempLocation: [number, number];
  locationMode: LocationMode;
  setTempLocation: (loc: [number, number]) => void;
  setLocationName: (name: string) => void;
  radius: number;
}

export default function MapPicker({
  tempLocation,
  locationMode,
  setTempLocation,
  setLocationName,
  radius,
}: MapPickerProps) {
  return (
    <div className="h-64 w-full">
      <CommonMap
        location={tempLocation}
        setLocation={setTempLocation}
        locationMode={locationMode}
        radius={radius}
        onLocationNameChange={setLocationName}
        draggableMarker={true} 
        height={240}
      />
    </div>
  );
}
