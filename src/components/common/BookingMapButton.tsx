import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface Coords { lat: number; lng: number }

interface Props {
  coordinates: Coords | null;
  label: string;
  className?: string;
}

export default function BookingMapButton({ coordinates, label, className }: Props) {
  if (!coordinates) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() =>
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`,
          "_blank"
        )
      }
      className={`w-full h-6 text-[11px] font-medium flex items-center justify-center gap-1 
        border-dashed text-muted-foreground hover:text-foreground hover:border-solid 
        transition-all ${className ?? ""}`}
    >
      <MapPin size={11} className="shrink-0" />
      {label}
    </Button>
  );
}