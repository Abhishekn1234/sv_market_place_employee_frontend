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
  work, id, categoryName, coordinates, timers, t,
  onStart, onComplete, onCancel, onVerify,
}: Props) {
  return (
    <CommonCard className="relative flex flex-col rounded-xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all">

      {/* HEADER */}
      <div className="p-2 border-b">
        <h3 className="font-semibold text-sm line-clamp-1">
          {work.service?.name || t("common.na")}
        </h3>
        <p className="text-[13px] text-muted-foreground">{categoryName}</p>
      </div>

      {/* BODY */}
      <div className="p-2 space-y-2 text-[13px]">
        <BookingCustomerInfo
          customer={work.customer}
          t={t}
          showCallButton={false}
        />

        <BookingEstimateRow
          schedule={work.booking?.schedule}
          currency={work.booking?.currency}
          amount={getWorkerAmount(work)}
          t={t}
          showBorder
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