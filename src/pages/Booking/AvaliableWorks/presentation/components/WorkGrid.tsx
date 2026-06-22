"use client";


import { reverseGeocode } from "@/components/common/CommonMap";

import { useEffect, useMemo, useState } from "react";
import {
  getBookingId,
  getWorkCoordinates,
  getWorkLocation,

  normalizeAssignedWorks,
} from "../utils/workPresentation.helpers";
import type {  WorkGridProps } from "../types/workPresentation.types";
// DisplayWork,
import { useLanguage } from "@/context/presentation/components/LanguageContext";
// import { ChatBadge } from "./ChatBadge/ChatBadge";
// import { Badge } from "@/components/ui/badge";
import { isHidden } from "../utils/hiddenstatus";
import WorkCard from "./WorkCard";

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

          const categoryName = categories.find((c) => c._id === work.service?.category)?.name || t("common.na");
          const coordinates = getWorkCoordinates(getWorkLocation(work));

          return (
            <WorkCard
              key={id}
              work={work}
              id={id}
              categoryName={categoryName}
              coordinates={coordinates}
              timers={timers}
              t={t}
              onStart={onStart}
              onComplete={onComplete}
              onCancel={onCancel}
              onVerify={onVerify}
            />
          );
        })}
        </div>
      
    </div>
  );
}

