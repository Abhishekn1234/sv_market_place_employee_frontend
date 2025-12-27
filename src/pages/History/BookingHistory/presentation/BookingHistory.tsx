import { useState, useMemo } from "react";
import { Search, Filter, ChevronDown, ChevronUp, User, MapPin } from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useLanguage } from "@/context/LanguageContext";
import { mockBookings } from "./data/bookingdata";

/* ------------------ TYPES ------------------ */

type BookingStatus =
  | "completed"
  | "confirmed"
  | "pending"
  | "inProgress"
  | "in-progress"
  | "cancelled";

type NormalizedBookingStatus =
  | "completed"
  | "confirmed"
  | "pending"
  | "inProgress"
  | "cancelled";

type StatusOptions = {
  all: string;
  completed: string;
  confirmed: string;
  pending: string;
  inProgress: string;
  cancelled: string;
};

type TableHeaders = {
  id: string;
  client: string;
  service: string;
  date: string;
  time: string;
  payment: string;
  status: string;
  actions: string;
};
interface BookingTranslations {
  clientInfo: string;
  bookingDetails: string;
  notes: string;
  bookingDetailsLabels: {
    service: string;
    duration: string;
    payment: string;
    status: string;
  };
}

/* ------------------ COMPONENT ------------------ */

export default function BookingHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<BookingStatus | "all">("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [expandedBooking, setExpandedBooking] =
    useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const { language, t, translations } = useLanguage();
  const isRTL = language === "AR";

  /* ------------------ NARROW TRANSLATIONS ------------------ */

  const statusOptions = translations.statusOptions as StatusOptions;
  const tableHeaders = translations.tableHeaders as TableHeaders;

  /* ------------------ SERVICES ------------------ */

  const serviceTypes = useMemo(
    () => Array.from(new Set(mockBookings.map((b) => b.serviceType))),
    []
  );

  /* ------------------ FILTERING ------------------ */

  const filteredBookings = useMemo(() => {
    return mockBookings.filter((b) => {
      const matchesSearch =
        b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.serviceType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || b.status === statusFilter;

      const matchesService =
        serviceFilter === "all" || b.serviceType === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [searchTerm, statusFilter, serviceFilter]);

  /* ------------------ PAGINATION ------------------ */

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, currentPage]);
function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}
function getNestedString(
  value: unknown,
  key: string
): string {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    key in value
  ) {
    const record = value as Record<string, unknown>;
    return typeof record[key] === "string" ? record[key] : "";
  }
  return "";
}

  /* ------------------ STATUS CONFIG ------------------ */
const bookingTranslations: BookingTranslations = {
  clientInfo: asString(translations.clientInfo),
  bookingDetails: asString(translations.bookingDetails),
  notes: asString(translations.notes),
  bookingDetailsLabels: {
    service: getNestedString(translations.bookingDetailsLabels, "service"),
    duration: getNestedString(translations.bookingDetailsLabels, "duration"),
    payment: getNestedString(translations.bookingDetailsLabels, "payment"),
    status: getNestedString(translations.bookingDetailsLabels, "status"),
  },
};



  const statusConfig: Record<
    NormalizedBookingStatus,
    { label: string; color: string }
  > = {
    completed: {
      label: statusOptions.completed,
      color: "bg-green-100 text-green-700",
    },
    confirmed: {
      label: statusOptions.confirmed,
      color: "bg-blue-100 text-blue-700",
    },
    pending: {
      label: statusOptions.pending,
      color: "bg-yellow-100 text-yellow-700",
    },
    inProgress: {
      label: statusOptions.inProgress,
      color: "bg-purple-100 text-purple-700",
    },
   
    cancelled: {
      label: statusOptions.cancelled,
      color: "bg-red-100 text-red-700",
    },
  };
const formatTime = (time: string) => {
  if (!time) return "";

  const parts = time.trim().split(" ");

  // Expected: ["AM", "09:00"]
  if (parts.length === 2) {
    const [ampm, clock] = parts;
    return `${clock} ${ampm.toUpperCase()}`;
  }

  return time;
};





  const toggleExpanded = (id: string) =>
    setExpandedBooking(expandedBooking === id ? null : id);

  /* ------------------ JSX ------------------ */

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className={`mb-6 ${isRTL ? "text-right" : "text-left"}`}>
        <h1>{t("title")}</h1>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
  <CardContent
    className={`pt-6 flex flex-col md:flex-row gap-4 ${
      isRTL ? "md:flex-row-reverse" : ""
    }`}
  >
    {/* Search */}
    <div className="flex-1 relative">
      <Search
        className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400
        
        `}
      />
      <Input
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        // className={isRTL ? "pr-10 text-right" : "pl-10"}
        placeholder={t("searchPlaceholder")}
        
      />
    </div>

    {/* Status */}
    <Select
      value={statusFilter}
      onValueChange={(v) => {
        setStatusFilter(v as NormalizedBookingStatus | "all");
        setCurrentPage(1);
      }}
    >
      <SelectTrigger
        className={`w-full md:w-[180px] flex items-center ${
          isRTL ? "" : ""
        }`}
      >
        <Filter className={`h-4 w-4 ${isRTL ? "" : "mr-2"}`} />
        <SelectValue />
      </SelectTrigger>

      <SelectContent align={isRTL ? "center" : "end"}>
        <SelectItem value="all">{statusOptions.all}</SelectItem>
        {Object.entries(statusConfig).map(([key, val]) => (
          <SelectItem key={key} value={key}>
            {val.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    {/* Service */}
    <Select
      value={serviceFilter}
      onValueChange={(v) => {
        setServiceFilter(v);
        setCurrentPage(1);
      }}
    >
      <SelectTrigger
        className={`w-full md:w-[180px] ${
          isRTL ? "text-right flex-row-reverse" : ""
        }`}
      >
        <SelectValue />
      </SelectTrigger>

      <SelectContent align={isRTL ? "center" : "start"}>
        <SelectItem value="all">
          {(translations.serviceOptions as { all: string }).all}
        </SelectItem>
        {serviceTypes.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </CardContent>
</Card>


      {/* Table */}
      <Table dir={isRTL ? "rtl" : "ltr"}>
  <TableHeader>
    <TableRow>
      {Object.values(tableHeaders).map((h) => (
        <TableHead key={h} className="text-right">
          {h}
        </TableHead>
      ))}
    </TableRow>
  </TableHeader>

  <TableBody>
  {paginatedBookings.map((b) => (
    <>
      {/* Main Row */}
      <TableRow key={b.id}>
        <TableCell>{b.id}</TableCell>

        <TableCell>
          <span dir="ltr">{b.clientName}</span>
        </TableCell>

        <TableCell>{b.serviceType}</TableCell>

        <TableCell>
          <span dir="ltr">{b.date}</span>
        </TableCell>

        <TableCell>
          <span dir="ltr">{b.time}</span>
        </TableCell>

        <TableCell>
          <span dir="ltr">${b.payment}</span>
        </TableCell>

        <TableCell>
          <Badge className={statusConfig[b.status].color}>
            {language === "AR"
              ? statusConfig[b.status].label
              : statusConfig[b.status].label}
          </Badge>
        </TableCell>

        <TableCell>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toggleExpanded(b.id)}
          >
            {expandedBooking === b.id ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </TableCell>
      </TableRow>

      {/* Expanded Row */}
     {expandedBooking === b.id && (
  <TableRow key={`${b.id}-details`}>
    <TableCell colSpan={8} className="bg-gray-50 p-4" dir="ltr">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">

        {/* Client Info */}
        <div>
          <h4 className="text-gray-600 mb-2">
            {bookingTranslations.clientInfo}
          </h4>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span>{b.clientName}</span>
            </div>

            <div className="flex items-center gap-2">
              <span>📧</span>
              <span>{b.clientEmail}</span>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-1" />
              <span>{b.location}</span>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div>
          <h4 className="text-gray-600 mb-2">
            {bookingTranslations.bookingDetails}
          </h4>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>{bookingTranslations.bookingDetailsLabels.service}</span>
              <span>{b.serviceType}</span>
            </div>

            <div className="flex justify-between">
              <span>{bookingTranslations.bookingDetailsLabels.duration}</span>
              <span>
                {b.duration} دقيقة
              </span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>{bookingTranslations.bookingDetailsLabels.payment}</span>
              <span>${b.payment}</span>
            </div>

            <div className="flex justify-between">
              <span>{bookingTranslations.bookingDetailsLabels.status}</span>
              <Badge className={statusConfig[b.status].color}>
                {statusConfig[b.status].label}
              </Badge>
            </div>
          </div>
        </div>

        {/* Notes */}
        {b.notes && (
          <div className="md:col-span-2">
            <h4 className="text-gray-600 mb-1">
              {bookingTranslations.notes}
            </h4>
            <p className="bg-gray-100 p-2 rounded">
              {b.notes}
            </p>
          </div>
        )}
      </div>
    </TableCell>
  </TableRow>
)}

    </>
  ))}
</TableBody>

</Table>


      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className={`${isRTL?"justify-start mt-6":"justify-end mt-6"}`} dir="ltr">
          <PaginationPrevious
            onClick={() =>
              setCurrentPage((p) => Math.max(p - 1, 1))
            }
          />
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
          <PaginationNext
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
          />
        </Pagination>
      )}
    </div>
  );
}
