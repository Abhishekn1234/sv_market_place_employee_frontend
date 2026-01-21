import type { TableColumn } from "@/components/common/CommonTable";
import type { Work } from "../../domain/entities/workhistory";
import { getStatusColor, getStatusIcon } from "../utils/workhistory";
import { useLanguage } from "@/context/LanguageContext";

export function useWorkColumns(): TableColumn<Work>[] {
  const { translations, language } = useLanguage();
  const isRTL = language === "AR";

  const headers = translations.workHistory.tableHeaders;
  const statusconfig=translations.workHistory.statusOptions;
  // console.log(statusconfig);
  // console.log(headers);
  
  return [
    {
      key: "title",
      header: headers.title,
    },
    {
      key: "description",
      header: headers.description,
    },
    {
      key: "location",
      header: headers.location,
    },
    {
      key: "assignedDate",
      header: headers.assignedDate,
      render: (w) =>
        new Date(w.assignedDate).toLocaleDateString(),
    },
    {
      key: "status",
      header: headers.status,
      render: (w) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${getStatusColor(
           w.status
          )}`}
        >
          {getStatusIcon(statusconfig[w.status])}

          {statusconfig[w.status]}
        </span>
      ),
    },
    {
      key: "duration",
      header: headers.duration,
      render: (w) =>
        isRTL
          ? `${headers.duration} ${w.duration}`
          : `${w.duration} ${headers.duration}`,
    },
  ];
}
