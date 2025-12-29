import * as React from "react";
import type { GeoPoint } from "@/pages/Profile/domain/entities/profile";

interface CurrentLocationFetcherProps {
  onChange: (point: GeoPoint, placeName: string) => void;
}

export function CurrentLocationFetcher({ onChange }: CurrentLocationFetcherProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [place, setPlace] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

      const point: GeoPoint = {
  type: "Point",
  coordinates: [position.coords.longitude, position.coords.latitude],
  accuracy: position.coords.accuracy, // meters
};

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();

          const address = data.address || {};

          // ✅ Only place name (NO pincode, NO full address)
          const placeName =
            address.city ||
            address.town ||
            address.village ||
            address.suburb ||
            address.county ||
            address.state ||
            "Current Location";

          setPlace(placeName);

          onChange(point, placeName);
        } catch {
          setError("Failed to fetch location name");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, [onChange]);

  if (loading)
    return <span className="text-gray-500">Fetching current location...</span>;

  if (error)
    return <span className="text-red-500">{error}</span>;

  if (place)
    return (
      <span className="text-green-600 text-sm">
        📍 {place}
      </span>
    );

  return null;
}
