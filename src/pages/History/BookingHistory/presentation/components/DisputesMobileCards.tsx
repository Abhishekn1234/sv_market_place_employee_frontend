import { Button } from "@/components/ui/button";
import { formatDate } from "@/pages/Activity/RecentActivity/presentation/helpers/formatdate";
import type { Dispute } from "../../domain/entities/disputes";
import { CommonCard } from "@/components/common/CommonCard";

export interface Props {
  isLoading: boolean;
  disputes: Dispute[];
  t: (key: string) => string;
  setSelected: (d: Dispute) => void;
  setResponseOpen: (open: boolean) => void;
}

export default function DisputesMobileCards({
  isLoading,
  disputes,
  t,
  setSelected,
  setResponseOpen,
}: Props) {
  if (isLoading) return null;

  return (
    <div className="md:hidden overflow-y-auto max-h-[60vh] pr-1">
      <div className="grid grid-cols-2 gap-2">
        {disputes.map((d) => (
          <CommonCard
            key={d._id}
            className="p-2 h-full"
          >
            <div className="flex flex-col gap-1 h-full">
              <p className="text-xs font-semibold truncate">
                {d.reasonType}
              </p>

              <p className="text-[10px] text-gray-500">
                {formatDate(d.createdAt)}
              </p>

              {d.status && (
                <p className="text-[10px] font-medium text-blue-600">
                  {d.status}
                </p>
              )}
              {d?.workerResponse && (
                <p className="text-[10px] text-green-600">
                  {d.workerResponse}
                </p>
                )}

              {d.description && (
                <p className="text-[10px] text-gray-600 line-clamp-2">
                  {d.description}
                </p>
              )}

              <Button
                variant="outline"
                className="mt-auto h-7 text-[10px]"
                onClick={() => {
                  setSelected(d);
                  setResponseOpen(true);
                }}
              >
                {t("disputepage.respond")}
              </Button>
            </div>
          </CommonCard>
        ))}
      </div>
    </div>
  );
}