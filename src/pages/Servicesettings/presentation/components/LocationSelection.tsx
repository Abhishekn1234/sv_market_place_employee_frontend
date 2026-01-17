import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { GeoPoint } from "@/pages/Profile/domain/entities/profile";
import LocationPage from "@/pages/LocationSettings/presentation/location.settings.page";
import { CurrentLocationFetcher } from "@/pages/LocationSettings/presentation/components/CurrentLocation";
import { reverseGeocode } from "@/components/common/CommonMap";

/* ================== TYPES ================== */
type Props = {
  locationMode: "current" | "manual";
  setLocationMode: (v: "current" | "manual") => void;
  location: GeoPoint | null;
  setLocation: (l: GeoPoint | null) => void;
  currentPlace: string;
  setCurrentPlace: (p: string) => void;
  serviceRadius: number; // meters
  setServiceRadius: (r: number) => void;
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
}: Props) {
  return (
    <>
      {/* TITLE */}
      <Label className="text-sm font-medium mb-1 block">
        Select Location Mode
      </Label>

      {/* RADIO OPTIONS */}
      <div className="flex items-center gap-6 mb-3">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <Input
            type="radio"
            checked={locationMode === "current"}
            onChange={() => setLocationMode("current")}
            className="h-4 w-4"
          />
          <span>Current Location</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <Input
            type="radio"
            checked={locationMode === "manual"}
            onChange={() => setLocationMode("manual")}
            className="h-4 w-4"
          />
          <span>Choose Location</span>
        </label>
      </div>

      {/* CURRENT LOCATION */}
      {locationMode === "current" && (
        <CurrentLocationFetcher
          onChange={(point, place) => {
            setLocation(point);
            setCurrentPlace(place);
          }}
        />
      )}

      {/* MANUAL LOCATION */}
      {locationMode === "manual" && (
        <div className="h-[500px] rounded-md border mt-2">
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
        <div className="mt-3 text-sm text-muted-foreground space-y-1">
          <p>
            <strong>Lat:</strong>{" "}
            {formatCoord(location.coordinates[0])},{" "}
            <strong>Lng:</strong>{" "}
            {formatCoord(location.coordinates[1])}
          </p>

          <p>
            <strong>Radius:</strong> {formatRadius(serviceRadius)} km
          </p>

          {currentPlace && (
            <p className="italic">📍 {currentPlace}</p>
          )}
        </div>
      )}
    </>
  );
}
