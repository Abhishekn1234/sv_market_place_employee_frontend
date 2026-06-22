import { Button } from "@/components/ui/button";
import { formatDate } from "@/pages/Activity/RecentActivity/presentation/helpers/formatdate";
import type { Dispute } from "../../domain/entities/disputes";
import { CommonCard } from "@/components/common/CommonCard";
import { getDisputeStatusStyle } from "../utils/disputescolors";

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
    <div className="md:hidden">
      <div className="flex flex-col gap-3">
        {disputes.map((d) => {
         const { style, label } = getDisputeStatusStyle(d.status);

          return (
            <CommonCard key={d._id} className="p-4 flex flex-col gap-3">
              {/* Header: title + date */}
              <div className="flex justify-between items-start gap-3">
                <h3 className="text-sm font-medium text-foreground leading-snug break-words flex-1">
                  {d.reasonType}
                </h3>
                
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground shrink-0 mt-0.5">
                  {formatDate(d.createdAt)}
                </span>
              </div>

              {/* Status badge */}
              <div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded text-[11px] font-medium ${style}`}>
                  {label}  
                </span>
              </div>

              {/* Description */}
              {d.description && (
                <p className="text-xs text-muted-foreground leading-relaxed break-words">
                  {d.description}
                </p>
              )}

              {/* Worker response */}
              {d.workerResponse && (
                <div className="rounded-md border-l-[2.5px] border-green-500 bg-muted/50 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-green-700 mb-1">
                    Worker response
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed break-words">
                    {d.workerResponse}
                  </p>
                </div>
              )}

              {/* Divider + action */}
              <div className="border-t border-border/50 pt-3 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={d.status === "IN_REVIEW"}
                  className="text-xs h-8 px-4"
                  onClick={() => {
                    setSelected(d);
                    setResponseOpen(true);
                  }}
                >
                  {t("disputepage.respond")}
                </Button>
              </div>
            </CommonCard>
          );
        })}
      </div>
    </div>
  );
}