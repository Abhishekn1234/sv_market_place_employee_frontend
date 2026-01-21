import { useState, useMemo } from "react";
import { Search, Filter, User, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useStatusConfig } from "./hooks/statusconfig";
import { useLanguage } from "@/context/LanguageContext";
import { mockBookings } from "./data/bookingdata";
import { CommonTable,  } from "@/components/common/CommonTable";
import type { Booking } from "../domain/entities/booking";
import { CommonCard } from "@/components/common/CommonCard";
import type { BookingStatus } from "../domain/entities/bookingstatus";
import type  { StatusOptions } from "../domain/entities/statusoptions.types";
import type { BookingTranslations } from "../domain/entities/bookingtranslations.types";
import { useStringUtils } from "./hooks/useStringutils";
import { useBookingColumns } from "./hooks/useColumns";
export default function BookingHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<BookingStatus | "all">("all"); 
  const [serviceFilter, setServiceFilter] = useState("all");
  const [expandedBooking, setExpandedBooking] =
    useState<string | null>(null);
    const {asString,getNestedString}=useStringUtils();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { language, t, translations } = useLanguage();
  const isRTL = language === "AR";
  const statusConfig=useStatusConfig();
  const statusOptions = translations.statusOptions as StatusOptions;
  
  const serviceTypes = useMemo(
    () => Array.from(new Set(mockBookings.map((b) => b.serviceType))),
    []
  );
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



  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, currentPage]);


  
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
const toggleExpanded = (id: string) =>
    setExpandedBooking(expandedBooking === id ? null : id);

const columns = useBookingColumns({
  expandedBooking,
  toggleExpanded,
});

 return (
    <div className="min-h-full">
    <div className={`mb-6 ${isRTL ? "text-right" : "text-left"}`}>
        <h1>{t("title")}</h1>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>
      <CommonCard
      title="Filters" 
      contentClassName={`flex flex-col md:flex-row gap-4 mb-4 ${
        isRTL ? "md:flex-row-reverse" : ""
      }`}
    >
  
  <div className="flex-1 relative mb-4 md:mb-0">
    <Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
    <Input
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }}
      placeholder={t("searchPlaceholder")}
    />
  </div>
 <Select
    value={statusFilter}
    onValueChange={(v) => {
      setStatusFilter(v as BookingStatus | "all");
      setCurrentPage(1);
    }}
  >
    <SelectTrigger className="w-full md:w-[180px] flex items-center">
      <Filter className="h-4 w-4 mr-2" />
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

  
  <Select
    value={serviceFilter}
    onValueChange={(v) => {
      setServiceFilter(v);
      setCurrentPage(1);
    }}
  >
    <SelectTrigger className="w-full md:w-[180px]">
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
</CommonCard>
    <CommonTable<Booking>
      columns={columns}
      data={paginatedBookings}
      keyExtractor={(b) => b.id}
      dir={isRTL ? "rtl" : "ltr"}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      expandedRowKey={expandedBooking}
      renderExpandedRow={(b) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
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
        </div>
      )}
    />

    </div>
  );
}
