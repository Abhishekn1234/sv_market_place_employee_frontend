import { Button } from "@/components/ui/button";
import type { Work } from "../../../domain/entities/work";
import { useLanguage } from "@/context/presentation/components/LanguageContext";

type ActionButtonsProps = {
  work: Work;
  dark: boolean;
  navigate: (path: string) => void;
  onCancel?: (bookingId?: string) => void;
  isCancelling?: boolean;
  cancelingWorkId?: string | null;
};

export const ActionButtons = ({
  work,
  onCancel,
  isCancelling,
  cancelingWorkId,
}: ActionButtonsProps) => {
  const { t } = useLanguage();
  /* ---------------- SAFE LOCATION HANDLING ---------------- */
  let lat: number | null = null;
  let lng: number | null = null;

  const loc = work.booking?.location;

  if (typeof loc === "string") {
    const parts = loc.split(",");
    if (parts.length === 2) {
      const parsedLat = Number(parts[0]);
      const parsedLng = Number(parts[1]);

      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        lat = parsedLat;
        lng = parsedLng;
      }
    }
  } else if (loc?.type === "Point" && Array.isArray(loc.coordinates)) {
    const [lngVal, latVal] = loc.coordinates;

    if (!isNaN(lngVal) && !isNaN(latVal)) {
      lng = lngVal;
      lat = latVal;
    }
  }

  const handleDirections = () => {
    if (lat == null || lng == null) return;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const bookingId = work.booking?._id;

  return (
    <div className="flex justify-end gap-3 flex-wrap">

      {/* 📍 GET DIRECTIONS */}
      {lat != null && lng != null && (
        <Button variant="outline" onClick={handleDirections}>
          {t("availableWork.getDirections")}
        </Button>
      )}

      {/* ❌ CANCEL BUTTON (OPTIONAL SAFE) */}
      {onCancel && bookingId && (
        <Button
          onClick={() => onCancel(bookingId)}
          disabled={isCancelling && cancelingWorkId === bookingId}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          {isCancelling && cancelingWorkId === bookingId
            ? t("common.loading")
            : t("cancelBooking.confirmCancel")}
        </Button>
      )}

    </div>
  );
};