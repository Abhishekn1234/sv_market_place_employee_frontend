import { Button } from "@/components/ui/button";
import type { Work } from "../../../domain/entities/work";
import { Loader2 } from "lucide-react";

type ActionButtonsProps = {
  work: Work;
  cancellingId: string | null;
  isCancelling: boolean;
  handleCancel: (id?: string) => void;
  dark: boolean;
  navigate: (path: string) => void;
  onClose: () => void;
};

export const ActionButtons = ({
  work,
  cancellingId,
  isCancelling,
  handleCancel,
  dark,
}: ActionButtonsProps) => {
  const statusLower = work.status?.toLowerCase();
  const bookingId = work.booking?._id;

  const canCancel =
    statusLower !== "completed" &&
    statusLower !== "in_progress" &&
    statusLower !== "started";

  /* ✅ SAFE LOCATION HANDLING */
  let lat: number | null = null;
  let lng: number | null = null;

  const loc = work.booking?.location;

  if (typeof loc === "string") {
    const parts = loc.split(",");
    if (parts.length === 2) {
      lat = Number(parts[0]);
      lng = Number(parts[1]);
    }
  } else if (loc?.type === "Point" && Array.isArray(loc.coordinates)) {
    lng = loc.coordinates[0]; // GeoJSON
    lat = loc.coordinates[1];
  }

  const handleDirections = () => {
    if (!lat || !lng) return;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex justify-end gap-3 flex-wrap">
      {/* 📍 GET DIRECTIONS */}
      {lat && lng && (
        <Button variant="outline" onClick={handleDirections}>
          Get Directions
        </Button>
      )}

      {/* ❌ CANCEL */}
      {canCancel && (
        <Button
          onClick={() => handleCancel(bookingId)}
          disabled={isCancelling && cancellingId === bookingId}
          className={`px-5 py-2 rounded-xl font-medium flex items-center gap-2 ${
            dark ? "bg-red-200 text-black" : "bg-red-900 text-white"
          }`}
        >
          {isCancelling && cancellingId === bookingId && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          Cancel Booking
        </Button>
      )}
    </div>
  );
};