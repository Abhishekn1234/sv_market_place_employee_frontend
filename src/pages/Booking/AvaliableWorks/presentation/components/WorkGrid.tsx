"use client";

import { Button } from "@/components/ui/button";
import { CommonCard } from "@/components/common/CommonCard";
import { reverseGeocode } from "@/components/common/CommonMap";
import { MapPin, MessageCircle, Timer } from "lucide-react";
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
import { useChatMessages } from "@/ChatCustomer/presentation/hooks/useChatMessages";

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
  const normalizedWorkList = useMemo(() => {
    return normalizeAssignedWorks(workList).filter(
      (work) => work.status !== "UNKNOWN"
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

              <p className="text-xs font-medium">Status: {work.status}</p>

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
                      `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
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
                                    <div className="relative">
                  {/* UNREAD COUNT BADGE */}
                  {(() => {
                 const { data: messages } = useChatMessages(
                              work.bookingId,
                              1,
                              100
                            );
                
                    const bookingMessages: any[] =
                      messages?.data?.filter(
                        (msg: any) =>
                          String(msg.bookingId) ===
                            String(work.bookingId) &&
                          !msg?.isRead
                      ) || []; 
                      console.log(bookingMessages);

                    return bookingMessages.length > 0 ? (
                      <span className="absolute -top-2 -right-2 z-10 min-w-[20px] h-[20px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                        {bookingMessages.length}
                      </span>
                    ) : null;
                  })()}

                  <Button
                    onClick={() =>
                      navigate(`/chat/${work.bookingId}`)
                    }
                  >
                    <MessageCircle size={16} />
                    {t("common.chat")}
                  </Button>
                </div>
                  </>
                )}
               

                {work.status === "WORK_COMPLETED_PENDING" && (
                  <Button className="w-full" onClick={() => onVerify(work)}>
                    {t("availableWork.verifyOtp")}
                  </Button>
                )}

                {/* ✅ COMPLETE FIX */}
                {isActiveWork(work) && (
                  <Button
                    className="w-full"
                    onClick={() =>
                      onComplete({
                        ...work,
                        elapsedTime: timers[id] || "00:00:00",
                      })
                    }
                  >
                    {t("common.complete")}
                  </Button>
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