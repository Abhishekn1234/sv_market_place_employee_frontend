import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface Coords {
  lat: number;
  lng: number;
}

interface Props {
  coordinates: Coords | null;
  label: string;
  className?: string;
}

export default function BookingMapButton({
  coordinates,
  label,
  className,
}: Props) {
  if (
    !coordinates ||
    typeof coordinates.lat !== "number" ||
    typeof coordinates.lng !== "number"
  ) {
    return null;
  }

  const handleOpenMap = () => {
    const { lat, lng } = coordinates;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleOpenMap}
      className={`w-full h-7 text-[11px] font-medium flex items-center justify-center gap-1
        border-dashed text-muted-foreground
        hover:text-foreground hover:border-solid
        transition-all ${className ?? ""}`}
    >
      <MapPin size={12} className="shrink-0" />
      {label}
    </Button>
  );
}