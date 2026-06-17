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
// import { ChatBadge } from "./ChatBadge/ChatBadge";
// import { Badge } from "@/components/ui/badge";
import { isHidden } from "../helpers/hiddenstatus";

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

 
const normalizedWorkList = useMemo(() => {
  return normalizeAssignedWorks(workList).filter(
    (work) => !isHidden(work)
  );
}, [workList]);

  useEffect(() => {
    if (!normalizedWorkList.length) return;

    normalizedWorkList.forEach((work) => {
      const id = getBookingId(work);
      if (!id || locations[id]) return;

      const coordinates = getWorkCoordinates(getWorkLocation(work));
      if (!coordinates) return;

      reverseGeocode(coordinates.lat, coordinates.lng)
        .then((address) =>
          setLocations((prev) => ({ ...prev, [id]: address }))
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
    <div className="mt-8 px-4 lg:px-6">
     
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
          {normalizedWorkList.map((work: any) => {
            const id = getBookingId(work);
            if (renderedIds.has(id)) return null;
            renderedIds.add(id);

            const categoryName =
              categories.find((c) => c._id === work.service?.category)
                ?.name || t("common.na");

            const coordinates = getWorkCoordinates(
              getWorkLocation(work)
            );

            return (
                <CommonCard
          key={id}
          className="relative flex flex-col rounded-xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all"
        >

          

          {/* HEADER */}
          <div className="p-2 border-b">
            <h3 className="font-semibold text-sm line-clamp-1">
              {work.service?.name || t("common.na")}
            </h3>
            <p className="text-[13px] text-muted-foreground">
              {categoryName}
            </p>
          </div>

          {/* BODY */}
          <div className="p-2 space-y-2 text-[13px]">

            {/* CUSTOMER */}
            <div className="rounded-md bg-muted/30 p-2 space-y-1">
              <p className="text-[13px] font-semibold text-muted-foreground uppercase">
                {t("availableWork.customer")}
              </p>

              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("availableBookings.name")}</span>
                <span className="font-medium text-right">
                  {work.customer?.fullName || t("common.na")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("availableBookings.email")}</span>
                <span className="text-right break-all max-w-[170px]">
                  {work.customer?.email || t("common.na")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("availableBookings.phone")}</span>
                <span className="text-right">
                  {work.customer?.phone || t("common.na")}
                </span>
              </div>
            </div>

            {/* ESTIMATES */}
            <div className="flex justify-between text-[13px] border-b pb-1">
              <span className="text-muted-foreground uppercase">
                {work.booking?.schedule?.estimatedDays
                  ? t("availableBookings.EstimatedDays")
                  : t("availableBookings.EstimatedHours")}
              </span>

              <span>
                {work.booking?.schedule?.estimatedDays
                  ? `${work.booking?.schedule?.estimatedDays} days`
                  : `${work.booking?.schedule?.estimatedHours} hrs`}
              </span>
            </div>

            {/* EARNINGS */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground uppercase text-[13px]">
                {t("availableBookings.You Earn")}
              </span>

              <span className="font-semibold text-green-600 text-sm">
                {getWorkerAmount(work)} {work.booking?.currency}
              </span>
            </div>

            {/* NOTE */}
            <div className="text-[13px] text-muted-foreground bg-gray-100 p-2 rounded-md">
             
              {work.booking?.schedule?.estimatedDays
                ? t("availableBookings.dailyNote")
                : t("availableBookings.hourlyNote")}
            </div>

            {/* TIMER */}
            {isActiveWork(work) && timers[id] && (
              <div className="flex items-center gap-1 text-green-700 text-[13px] font-medium">
                <Timer size={12} />
                {timers[id]}
              </div>
            )}

            {/* MAP BUTTON */}
            {coordinates && (
              <Button
              variant="ghost"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`,
                    "_blank"
                  )
                }
                className="w-full text-[13px] border rounded-md py-1 mt-1 flex items-center justify-center gap-1"
              >
                <MapPin size={14} />
                {t("availableWork.getDirections")}
              </Button>
            )}
          </div>

          {/* ACTIONS */}
        <div className="p-2 border-t grid grid-cols-3 gap-1">

          {canStartOrCancel(work) && (
            <>
              <Button
                size="sm"
                onClick={() => onStart(work)}
                className="h-7 w-full text-[13px]"
              >
                {t("common.start")}
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => onCancel(work)}
                className="h-7 w-full text-[13px]"
              >
                {t("common.cancel")}
              </Button>

              <Button
                size="sm"
                onClick={() => navigate(`/chat/${work.bookingId}`)}
                className="h-7 w-full text-[13px] flex items-center justify-center gap-1"
              >
                <MessageCircle size={14} />
                {t("common.chat")}
              </Button>
            </>
          )}

          {isActiveWork(work) && (
            <Button
              size="sm"
              className="h-7 w-full text-[13px] col-span-3"
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

          {work.status === "WORK_COMPLETED_PENDING" && (
            <Button
              size="sm"
              className="h-7 w-full text-[13px] col-span-3"
              onClick={() => onVerify(work)}
            >
              {t("availableWork.verifyOtp")}
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

function canStartOrCancel(work: DisplayWork) {
  return ["ASSIGNED", "WORKER_ACCEPTED"].includes(work.status);
}

function isActiveWork(work: DisplayWork) {
  return ["STARTED", "IN_PROGRESS"].includes(work.status);
}