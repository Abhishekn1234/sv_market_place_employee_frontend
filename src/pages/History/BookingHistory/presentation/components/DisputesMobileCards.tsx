import { Button } from "@/components/ui/button";
import { formatDate } from "@/pages/Activity/RecentActivity/presentation/helpers/formatdate";
import type { Dispute } from "../../domain/entities/disputes";

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
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:hidden">
      {!isLoading &&
        disputes.map((d: Dispute) => (
          <div
            key={d._id}
            className="border rounded-lg p-2 bg-white shadow-sm flex flex-col gap-1 min-w-0"
          >
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

            {d.description && (
              <p className="text-[10px] text-gray-600 line-clamp-2">
                {d.description}
              </p>
            )}

            <Button
              onClick={() => {
                setSelected(d);
                setResponseOpen(true);
              }}
              className="mt-auto text-[10px] px-2 py-1 h-7"
              variant="outline"
            >
              {t("disputepage.respond")}
            </Button>
          </div>
        ))}
    </div>
  );
}