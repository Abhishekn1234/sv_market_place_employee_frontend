import type { TableColumn } from "@/components/common/CommonTable";
import type { Dispute } from "../../domain/entities/disputes";
import { Button } from "@/components/ui/button";

type Params = {
  onSelect: (d: Dispute) => void;
  formatDate: (date: string) => string;
  t: (key: string) => string;
};

export const getDisputeColumns = ({
  onSelect,
  formatDate,
  t,
}: Params): TableColumn<Dispute>[] => [
  {
    key: "reason",
    header: t("disputepage.reason"),
    render: (d) => (
      <span className="text-sm">{d.reasonType}</span>
    ),
  },
  {
    key: "description",
    header: t("disputepage.descriptionField"),
    render: (d) => (
      <span className="text-xs text-gray-600">
        {d.description}
      </span>
    ),
  },
  {
    key: "status",
    header: t("disputepage.status"),
    render: (d) => {
      const statusClass =
        d.status === "IN_REVIEW"
          ? "bg-yellow-100 text-yellow-700"
          : d.status === "RESOLVED"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700";

      return (
        <span className={`text-xs px-2 py-1 rounded-full ${statusClass}`}>
          {d.status}
        </span>
      );
    },
  },
  {
    key: "workerResponse",
    header: t("disputepage.response"),
    render: (d) =>
      d.workerResponse ? (
        <span className="text-xs text-green-600">
          {d.workerResponse}
        </span>
      ) : (
        <span className="text-xs text-gray-400">
          {t("disputepage.noResponse")}
        </span>
      ),
  },
  {
    key: "createdAt",
    header: t("disputepage.date"),
    render: (d) => (
      <span className="text-xs text-gray-500">
        {formatDate(d?.createdAt)}
      </span>
    ),
  },
  {
    key: "actions",
    header: t("disputepage.actions"),
    render: (d) => (
      <Button onClick={() => onSelect(d)} className="text-xs">
        {t("disputepage.respond")}
      </Button>
    ),
  },
];