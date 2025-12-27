import * as React from "react";
import type { GeoPoint } from "@/pages/Profile/domain/entities/profile";

interface CurrentLocationFetcherProps {
  onChange: (point: GeoPoint, placeName: string) => void; // now sends two args
}


export function CurrentLocationFetcher({ onChange }: CurrentLocationFetcherProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [coords, setCoords] = React.useState<[number, number] | null>(null);

  React.useEffect(() => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point: GeoPoint = {
          type: "Point",
          coordinates: [position.coords.longitude, position.coords.latitude],
        };
        setCoords(point.coordinates);

        // ✅ Pass both point and placeName
        onChange(point, "Current Location");

        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, [onChange]);

  if (loading) return <span className="text-gray-500">Fetching current location...</span>;
  if (error) return <span className="text-red-500">{error}</span>;
  if (coords)
    return (
      <span className="text-green-600 text-sm">
        Lat: {coords[1].toFixed(5)}, Lng: {coords[0].toFixed(5)}
      </span>
    );

  return null;
}

