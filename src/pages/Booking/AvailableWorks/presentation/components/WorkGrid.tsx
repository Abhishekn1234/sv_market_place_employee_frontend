"use client";

import { useEffect, useMemo, useState } from "react";
import { reverseGeocode } from "@/components/common/CommonMap";
import { CommonCard } from "@/components/common/CommonCard";
import { Button } from "@/components/ui/button";
import { MessageCircle, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getBookingId,
  getWorkCoordinates,
  getWorkLocation,
  getWorkerAmount,
} from "../utils/workPresentation.helpers";
import type { DisplayWork, WorkGridProps } from "../../domain/entities/workPresentation.types";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { isHidden } from "../utils/hiddenstatus";
import BookingCustomerInfo from "@/components/common/BookingCustomerInfo";
import BookingEstimateRow from "@/components/common/BookingEstimateRow";
import BookingMapButton from "@/components/common/BookingMapButton";

function canStartOrCancel(work: DisplayWork) {
  return ["ASSIGNED", "WORKER_ACCEPTED"].includes(work?.booking?.status ?? "");
}


function isActiveWork(work: DisplayWork) {
  // ✅ Check booking.status first, then fall back to the top-level status.
  // Socket assignment payloads carry status at BOTH levels (outer `status`
  // and `booking.status`) and they can briefly disagree during a transition
  // (e.g. outer STARTED while booking hasn't been patched yet), so checking
  // either is what keeps the "active" card (and therefore the timer row)
  // showing continuously through Start -> Complete.
  const status = work.booking?.status ?? (work as any).status;
  return ["STARTED", "IN_PROGRESS"].includes(status);
}

export default function WorkGrid({
  workList,
  categories = [],
  timers,
  onStart,
  onConfirmCashPayment,
  onComplete,
  onVerify,
  onCancel,
  isRTL,
}: WorkGridProps) {
  const [locations, setLocations] = useState<Record<string, string>>({});
  const { t ,localize} = useLanguage();
  const navigate = useNavigate();

  // ✅ workList is already normalized once by the page — do NOT re-normalize here.
  const normalizedWorkList = useMemo(() => {
    return workList.filter((work: DisplayWork) => !isHidden(work));
  }, [workList]);
  // console.log(normalizedWorkList);

  useEffect(() => {
    if (!normalizedWorkList.length) return;

    normalizedWorkList.forEach((work) => {
      const id = getBookingId(work);
      if (!id || locations[id]) return;

      const coordinates = getWorkCoordinates(getWorkLocation(work));
      if (!coordinates) return;

      reverseGeocode(coordinates.lat, coordinates.lng)
        .then((address) => setLocations((prev) => ({ ...prev, [id]: address })))
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
    <div className="mt-8 px-4 lg:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
        {normalizedWorkList.map((work: DisplayWork) => {
          const id = getBookingId(work);
          if (!id || renderedIds.has(id)) return null;
          renderedIds.add(id);

                const service =
  typeof work.service === "object" && work.service
    ? work.service
    : typeof work.booking?.service === "object" && work.booking.service
    ? work.booking.service
    : undefined;

const serviceName = localize(service?.name) ?? t("common.na");

const categoryName =
  localize(
    categories.find((c) => c._id === service?.category)?.name
  ) || t("common.na");
          const coordinates = getWorkCoordinates(getWorkLocation(work));
          const canConfirmCashPayment = Boolean(
              work.workerActions?.canConfirmCashPayment ??
              work.booking?.workerActions?.canConfirmCashPayment ??
              work.booking?.canConfirmCashPayment
            );

          const active = isActiveWork(work);
          const timerValue = timers[id];

          return (
            <CommonCard
              key={id}
              noPadding
              hoverable
              className="relative flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900"
            >
              <div className="border-b bg-slate-50/70 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-900/70">
                <h3 className="line-clamp-1 text-sm font-semibold">
                  {serviceName}
                </h3>

                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {categoryName}
                </p>
              </div>

              <div className="flex flex-1 flex-col gap-2.5 px-3.5 py-3">
                <BookingCustomerInfo
                 customer={work.customer ?? work.booking?.customer}
                  t={t}
                  isRTL={isRTL}
                  showCallButton
                />

                <BookingEstimateRow
                  schedule={work.booking?.schedule}
                  currency={work.booking?.currency}
                  amount={getWorkerAmount(work)}
                  t={t}
                  isRTL={isRTL}
                />

                <BookingMapButton
                  coordinates={coordinates}
                  label={t("availableWork.getDirections")}
                />
              </div>

              {/* Timer — only rendered while the job is active AND a value
                  exists in the timers map for this id. Because the page now
                  resolves startedAt from booking.startedAt / startedAt /
                  workStartedAt (in that priority order), this fires
                  immediately for jobs hydrated from the API or pushed via
                  socket, not just ones started in this browser tab. */}
              {active && timerValue && (
                <div className="mx-3.5 mb-2.5 flex items-center justify-center gap-1.5 rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-300">
                  <Timer size={13} />
                  {timerValue}
                </div>
              )}

              {/* Actions */}
              <div className="mt-auto border-t bg-slate-50/60 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-950/20">
                {canStartOrCancel(work) && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => onStart(work)}
                      className="h-8 min-w-[72px] flex-1 text-xs font-semibold"
                    >
                      {t("common.start")}
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onCancel(work)}
                      className="h-8 min-w-[72px] flex-1 text-xs font-semibold"
                    >
                      {t("common.cancel")}
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => navigate(`/chat/${work.bookingId}`)}
                      className="flex h-8 min-w-[72px] flex-1 items-center justify-center gap-1.5 text-xs font-semibold"
                    >
                      <MessageCircle size={13} />
                      {t("common.chat")}
                    </Button>
                  </div>
                )}

                {active && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="h-8 min-w-[100px] flex-1 text-xs font-semibold"
                      onClick={() =>
                        onComplete({ ...work, elapsedTime: timerValue || "00:00:00" })
                      }
                    >
                      {t("common.complete")}
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => navigate(`/chat/${work.bookingId}`)}
                      className="flex h-8 min-w-[100px] flex-1 items-center justify-center gap-1.5 text-xs font-semibold"
                    >
                      <MessageCircle size={13} />
                      {t("common.chat")}
                    </Button>
                  </div>
                )}

                {work.booking?.status === "WORK_COMPLETED_PENDING" && (
                  <Button
                    size="sm"
                    className="h-8 w-full text-xs font-semibold"
                    onClick={() => onVerify(work)}
                  >
                    {t("availableWork.verifyOtp")}
                  </Button>
                )}

                {canConfirmCashPayment && (
                  <Button
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => onConfirmCashPayment(work)}
                  >
                    {t("availableWork.confirmCashPayment")}
                  </Button>
                )}
              </div>
            </CommonCard>
          );
        })}
      </div>
    </div>
  );
}