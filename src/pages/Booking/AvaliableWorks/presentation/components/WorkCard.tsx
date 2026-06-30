import { CommonCard } from "@/components/common/CommonCard";

import WorkCardActions from "./WorkCardActions";
import type { DisplayWork } from "../types/workPresentation.types";
import BookingCustomerInfo from "@/components/common/BookingCustomerInfo";
import BookingEstimateRow from "@/components/common/BookingEstimateRow";
import { getWorkerAmount } from "../utils/workPresentation.helpers";
import BookingMapButton from "@/components/common/BookingMapButton";

interface Props {
  work: DisplayWork;
  id: string;
  isRTL: boolean;
  categoryName: string;
  coordinates: { lat: number; lng: number } | null;
  timers: Record<string, string>;
  t: (key: string) => string;
  onStart: (work: DisplayWork) => void;
  onComplete: (work: DisplayWork & { elapsedTime: string }) => void;
  onCancel: (work: DisplayWork) => void;
  onVerify: (work: DisplayWork) => void;
}

export default function WorkCard({
  work, id, categoryName, coordinates, timers, t, isRTL,
  onStart, onComplete, onCancel, onVerify,
}: Props) {
  return (
    <CommonCard
      noPadding
      hoverable
      className="relative flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900"
    >
      {/* HEADER */}
      <div className="border-b bg-slate-50/70 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-900/70">
        <h3 className="line-clamp-1 text-sm font-semibold leading-snug text-slate-900 break-words dark:text-slate-100">
          {work.service?.name || t("common.na")}
        </h3>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {categoryName}
        </p>
      </div>

      {/* BODY */}
      <div className="flex flex-1 flex-col gap-2.5 px-3.5 py-3">
        <BookingCustomerInfo
          customer={work.customer}
          t={t}
          isRTL={isRTL}
          showCallButton={true}
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

      <WorkCardActions
        work={work}
        id={id}
        timers={timers}
        t={t}
        onStart={onStart}
        onComplete={onComplete}
        onCancel={onCancel}
        onVerify={onVerify}
      />
    </CommonCard>
  );
}