import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

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
      className={cn(
        "h-8 w-full justify-center gap-2 rounded-md border-blue-200 bg-blue-50/70 text-xs font-semibold text-blue-700 shadow-none transition-colors hover:border-blue-300 hover:bg-blue-100 hover:text-blue-800 active:scale-[0.98] dark:border-blue-900/70 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:bg-blue-950/50",
        className,
      )}
    >
      <MapPin size={13} className="shrink-0" />
      <span className="truncate">{label}</span>
    </Button>
  );
}