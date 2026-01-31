import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { GeoPoint } from "@/pages/Profile/domain/entities/location";
import LocationPage from "@/pages/LocationSettings/presentation/location.settings.page";
import { CurrentLocationFetcher } from "@/pages/LocationSettings/presentation/components/CurrentLocation";
import { reverseGeocode } from "@/components/common/CommonMap";

type Props = {
  locationMode: "current" | "manual";
  setLocationMode: (v: "current" | "manual") => void;
  location: GeoPoint | null;
  setLocation: (l: GeoPoint | null) => void;
  currentPlace: string;
  setCurrentPlace: (p: string) => void;
  serviceRadius: number; // meters
  setServiceRadius: (r: number) => void;
  className?: string;
};

/* ================== HELPERS ================== */
const formatCoord = (v: number) => v.toFixed(5);
const formatRadius = (v: number) => (v / 1000).toFixed(2);

/* ================== COMPONENT ================== */
export function LocationSelection({
  locationMode,
  setLocationMode,
  location,
  setLocation,
  currentPlace,
  setCurrentPlace,
  serviceRadius,
  setServiceRadius,
  className = "",
}: Props) {
  return (
    <div
      className={`flex flex-col ${className} space-y-3 sm:space-y-4 w-full`}
    >
      {/* TITLE */}
      <Label className="text-sm sm:text-base font-medium mb-1 block">
        Select Location Mode
      </Label>

      {/* RADIO OPTIONS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
          <Input
            type="radio"
            checked={locationMode === "current"}
            onChange={() => setLocationMode("current")}
            className="h-4 w-4 sm:h-5 sm:w-5"
          />
          <span>Current Location</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
          <Input
            type="radio"
            checked={locationMode === "manual"}
            onChange={() => setLocationMode("manual")}
            className="h-4 w-4 sm:h-5 sm:w-5"
          />
          <span>Choose Location</span>
        </label>
      </div>

      {/* CURRENT LOCATION */}
      {locationMode === "current" && (
        <div className="w-full">
          <CurrentLocationFetcher
            onChange={(point, place) => {
              setLocation(point);
              setCurrentPlace(place);
            }}
          />
        </div>
      )}

      {/* MANUAL LOCATION */}
      {locationMode === "manual" && (
        <div className="w-full h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 rounded-md border overflow-hidden">
          <LocationPage
            onChange={async (loc) => {
              if (!loc) {
                setLocation(null);
                setCurrentPlace("");
                return;
              }

              const [lat, lng] = loc;

              setLocation({
                type: "Point",
                coordinates: [lat, lng],
              });

              const place = await reverseGeocode(lat, lng);
              setCurrentPlace(place);
            }}
            radius={serviceRadius}
            onRadiusChange={setServiceRadius}
          />
        </div>
      )}

      {/* LOCATION INFO (BOTH MODES) */}
      {location && (
        <div className="mt-2 text-xs sm:text-sm md:text-base text-muted-foreground space-y-1">
          <p>
            <strong>Lat:</strong> {formatCoord(location.coordinates[0])},{" "}
            <strong>Lng:</strong> {formatCoord(location.coordinates[1])}
          </p>

          <p>
            <strong>Radius:</strong> {formatRadius(serviceRadius)} km
          </p>

          {currentPlace && <p className="italic">📍 {currentPlace}</p>}
        </div>
      )}
    </div>
  );
}

