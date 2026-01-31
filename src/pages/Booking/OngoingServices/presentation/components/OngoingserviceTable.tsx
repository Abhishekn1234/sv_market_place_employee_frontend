"use client";

import { CommonTable, type TableColumn } from "@/components/common/CommonTable";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export type OngoingService = {
  id: string;
  customer: string;
  location: string;
  startDate: string;
  status: string;
};

interface Props {
  data: OngoingService[];
}

export default function OngoingServicesTable({ data }: Props) {
  const { translations,language  } = useLanguage(); // lang: "en" | "hi" | "ar"
  const isRTL=language==="AR"
  const t = translations.ongoingservices;

  const columns: TableColumn<OngoingService>[] = [
    { key: "id", header: t?.serviceId || "Service ID" },
    { key: "customer", header: t?.customer || "Customer" },
    { key: "location", header: t?.location || "Location" },
    { key: "startDate", header: t?.startDate || "Start Date" },
    { key: "status", header: t?.status || "Status" },
    {
      key: "action",
      header: t?.action || "Action",
      render: () => (
        <Button size="sm" variant="outline">
          {t?.view || "View"}
        </Button>
      ),
    },
  ];

  return (
    <CommonTable
      columns={columns}
      data={data}
      keyExtractor={(row) => row.id}
      emptyMessage={t?.noData || "No ongoing services found"}
      isRTL={isRTL}
    //   dir={lang === "ar" ? "rtl" : "ltr"} // RTL support for Arabic
    />
  );
}

