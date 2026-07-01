"use client";

import { CommonTable, type TableColumn } from "@/components/common/CommonTable";
import { Badge } from "@/components/ui/badge";
import type  { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";

export function BookingTable({
  data,
  page,
  totalPages,
  onPageChange,
  t,
  isRTL
}: {
  data: Booking[];
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  t: any;
  isRTL:boolean;
}) {
 const columns: TableColumn<Booking>[] = [
  {
    key: "clientName",
    header: t.customer,
  },
  {
    key: "serviceType",
    header: t.service,
  },
  {
    key: "serviceTier",
    header: t.tier,
  },
  {
    key: "date",
    header: t.date,
  },
  {
    key: "status",
    header: t.status,
    render: (row) => (
      <Badge variant="outline">
        {t[row.status]}
      </Badge>
    ),
  },
];


  return (
    <CommonTable
      columns={columns}
      data={data}
      keyExtractor={(row) => String(row.id ?? row._id)}
      currentPage={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      emptyMessage={t.noBookings}
      isRTL={isRTL}
    />
  );
}
