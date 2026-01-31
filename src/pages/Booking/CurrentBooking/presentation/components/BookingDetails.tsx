import { useMemo } from "react";
import { CommonTable, type TableColumn } from "@/components/common/CommonTable";
import type { Booking } from "@/pages/History/BookingHistory/domain/entities/booking";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  data: Booking[];
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}

export default function BookingList({
  data,
  page,
  pageSize,
  onPageChange,
}: Props) {
  const { translations,language } = useLanguage();
  const isRTL=language==="AR";
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [page, pageSize, data]);

  const totalPages = Math.ceil(data.length / pageSize);

  const columns: TableColumn<Booking>[] = [
    { key: "service", header: translations?.currentBookings?.table?.service ?? "" },
    { key: "clientName", header: translations?.currentBookings?.table?.customer ?? "" },
    { key: "time", header: translations?.currentBookings?.table?.time ?? "" },
   {
  key: "status",
  header: translations?.currentBookings?.table?.status ?? "",
  render: (row) =>
    translations?.currentBookings?.status?.[row.status] ?? row.status,
}
  ];

  return (
    <CommonTable<Booking>
      columns={columns}
      data={paginatedData}
      keyExtractor={(row) => row.id}
      currentPage={page}
      isRTL={isRTL}
      totalPages={totalPages}
      onPageChange={onPageChange}
      emptyMessage={translations?.currentBookings?.noBookings}
    />
  );
}
