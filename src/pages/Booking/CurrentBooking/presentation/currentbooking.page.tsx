import { useMemo, useState } from "react";
import BookingHeader from "./components/BookingHeader";
import BookingFilters from "./components/BookingsFilters";
import BookingList from "./components/BookingDetails";
import type { Booking } from "@/pages/History/BookingHistory/domain/entities/booking";


const bookings: Booking[] = [
  {
    id: "BK001",
    clientName: "Rahul Sharma",
    clientEmail: "rahul.sharma@email.com",
    service: "AC Repair",
    serviceType: "AC Repair",
    date: "2024-06-01",
    time: "10:30 AM",
    duration: 60,
    payment: 1200,
    status: "ongoing",
  },
  {
    id: "BK002",
    clientName: "Ayesha Khan",
    clientEmail: "ayesha.khan@email.com",
    service: "Plumbing",
    serviceType: "Plumbing",
    date: "2024-06-01",
    time: "12:00 PM",
    duration: 45,
    payment: 800,
    status: "pending",
  },
];

export default function CurrentBookingPage() {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = status === "all" || b.status === status;
      const matchSearch =
        b.clientName.toLowerCase().includes(search.toLowerCase()) ||
        String(b.service ?? "")
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [status, search]);

  return (
    <div className="p-4 space-y-4">
      <BookingHeader />

      <BookingFilters
        status={status}
        onStatusChange={(v) => {
          setPage(1);
          setStatus(v);
        }}
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        pageSize={pageSize}
        onPageSizeChange={(v) => {
          setPage(1);
          setPageSize(v);
        }}
      />

      <BookingList
        data={filteredBookings}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </div>
  );
}

