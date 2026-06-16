"use client";

import { Button } from "@/components/ui/button";
import { CommonCard } from "@/components/common/CommonCard";
import { reverseGeocode } from "@/components/common/CommonMap";
import { MapPin,  Timer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getBookingId,
  getWorkCoordinates,
  getWorkLocation,
  getWorkerAmount,
  normalizeAssignedWorks,
} from "../helpers/workPresentation.helpers";
import type { DisplayWork, WorkGridProps } from "../types/workPresentation.types";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
// import { useChatMessages } from "@/ChatCustomer/presentation/hooks/useChatMessages";
import { ChatBadge } from "./ChatBadge/ChatBadge";

export default function WorkGrid({
  workList,
  categories = [],
  timers,
  onStart,
  onComplete,
  onVerify,
  onCancel,
}: WorkGridProps) {
  const [locations, setLocations] = useState<Record<string, string>>({});
  const { t } = useLanguage();
const navigate = useNavigate();
  // ✅ Normalize
  const HIDDEN_STATUSES = [
  "UNKNOWN",
  "CUSTOMER_CANCELLED",
  "WORKER_CANCELLED",
  "COMPLETED",
];

const normalizedWorkList = useMemo(() => {
  return normalizeAssignedWorks(workList).filter(
    (work) => !HIDDEN_STATUSES.includes(work.status)
  );
}, [workList]);


  // ✅ Fetch location (FIXED with bookingId)
  useEffect(() => {
    if (!normalizedWorkList.length) return;

    normalizedWorkList.forEach((work) => {
      const id = getBookingId(work); // ✅ ALWAYS USE THIS

      if (!id || locations[id]) return;

      const coordinates = getWorkCoordinates(getWorkLocation(work));
      if (!coordinates) return;

      reverseGeocode(coordinates.lat, coordinates.lng)
        .then((address) =>
          setLocations((prev) => ({
            ...prev,
            [id]: address,
          }))
        )
        .catch(() =>
          setLocations((prev) => ({
            ...prev,
            [id]: `${coordinates.lat}, ${coordinates.lng}`,
          }))
        );
    });
  }, [normalizedWorkList, locations]);

  if (!normalizedWorkList.length) {
    return (
      <div className="text-center py-16 text-gray-500 text-sm">
        {t("availableWork.noWorks")}
      </div>
    );
  }

  const renderedIds = new Set<string>();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {normalizedWorkList.map((work: any) => {
        const id = getBookingId(work); // ✅ SINGLE SOURCE OF TRUTH

        if (renderedIds.has(id)) return null;
        renderedIds.add(id);

        const categoryName =
          categories.find((c) => c._id === work.service?.category)?.name ||
          t("common.na");

        const coordinates = getWorkCoordinates(getWorkLocation(work));

        return (
          <CommonCard
            key={id} // ✅ FIXED
            className="flex flex-col justify-between p-4 rounded-2xl shadow-sm hover:shadow-md transition"
          >
            <div className="space-y-2 text-sm">
              <h3 className="font-semibold text-base truncate">
                {work.service?.name || t("common.na")}
              </h3>

              <p className="text-gray-600 truncate">
                {t("availableWork.customer")}: {work.customer?.fullName || t("common.na")}
              </p>

              <p className="text-gray-500 text-xs line-clamp-2">
                {t("availableWork.location")}: {locations[id] || t("common.fetchingLocation")} {/* ✅ FIX */}
              </p>

              <p className="text-xs text-gray-500">
                {t("availableWork.category")}: {categoryName}
              </p>

              <p className="text-xs font-medium text-green-600">
                {t("availableWork.workerPoolAmount")}: {getWorkerAmount(work)}{" "}
                {work.booking?.currency}
              </p>

              <p className="text-xs text-gray-500">
                {t("availableWork.priceMode")}:{" "}
                {String(
                  work.pricingMode ?? work.booking?.pricingMode ?? t("common.na")
                )}
              </p>

              <p className="text-xs font-medium">{t("HomePage.bookingStatus")}: {work.status}</p>

              {/* ✅ TIMER FIX */}
              {isActiveWork(work) && timers[id] && (
                <p className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                  <Timer size={14} />
                  {timers[id]}
                </p>
              )}
            </div>

            <div className="mt-4 space-y-2">
              {coordinates && (
                <Button
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`,
                        "_blank"
                      )
                    }
                    className="w-full"
                  >
                  <MapPin size={16} />
                  {t("availableWork.getDirections")}
                </Button>
              )}

              <div className="flex gap-2">
                {canStartOrCancel(work) && (
                  <>
                    <Button className="flex-1" onClick={() => onStart(work)}>
                      {t("common.start")}
                    </Button>

                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => onCancel(work)}
                    >
                      {t("common.cancel")}
                    </Button>
                     <ChatBadge
                                bookingId={work.bookingId}
                                t={t}
                                work={work}
                                navigate={navigate}
                              />
                  </>
                )}
               

                {work.status === "WORK_COMPLETED_PENDING" && (
                  <>
                  <div className="flex items-center gap-3 w-full">
                  <Button className="flex-1" onClick={() => onVerify(work)}>
                    {t("availableWork.verifyOtp")}
                  </Button>
                   <ChatBadge
                                bookingId={work.bookingId}
                                t={t}
                                work={work}
                                navigate={navigate}
                              />
                              </div>
                  </>
                  
                  
                )}

                {/* ✅ COMPLETE FIX */}
               {isActiveWork(work) && (
                    <div className="flex items-center gap-3 w-full">
                      <Button
                        className="flex-1"
                        onClick={() =>
                          onComplete({
                            ...work,
                            elapsedTime: timers[id] || "00:00:00",
                          })
                        }
                      >
                        {t("common.complete")}
                      </Button>

                      <ChatBadge
                        bookingId={work.bookingId}
                        t={t}
                        work={work}
                        navigate={navigate}
                      />
                    </div>
                  )}
              </div>
            </div>
          </CommonCard>
        );
      })}
    </div>
  );
}

// ✅ unchanged
function canStartOrCancel(work: DisplayWork) {
  return ["ASSIGNED", "WORKER_ACCEPTED"].includes(work.status);
}

// ✅ unchanged
function isActiveWork(work: DisplayWork) {
  return ["STARTED", "IN_PROGRESS"].includes(work.status);
}