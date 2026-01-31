"use client";

import { type Dispatch, type SetStateAction } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import type { OngoingServiceLang } from "@/context/types/ongoingservices.types";

interface Props {
  statusFilter: string;
  setStatusFilter: Dispatch<SetStateAction<string>>;
  locationFilter: string;
  setLocationFilter: Dispatch<SetStateAction<string>>;
  locations: string[];
  rowsPerPage?: string;
  setRowsPerPage?: Dispatch<SetStateAction<string>>;
}

export default function OngoingServicesFilters({
  statusFilter,
  setStatusFilter,
  locationFilter,
  setLocationFilter,
  locations,
  rowsPerPage,
  setRowsPerPage
}: Props) {
  const { translations, language } = useLanguage();
  const t: OngoingServiceLang | undefined = translations?.ongoingservices;
  const isRTL = language === "AR";

  return (
    <div className={`flex flex-wrap gap-4 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
      {/* Status Filter */}
      <div className={isRTL ? "text-right" : ""}>
        <label className="block mb-1 font-medium">{t?.filters?.status || "Status"}</label>
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t?.filters?.status || "Status"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t?.filters?.all || "All"}</SelectItem>
            <SelectItem value="inProgress">{t?.filters?.inProgress || "In Progress"}</SelectItem>
            <SelectItem value="assigned">{t?.filters?.assigned || "Assigned"}</SelectItem>
            <SelectItem value="paused">{t?.filters?.paused || "Paused"}</SelectItem>
            <SelectItem value="completed">{t?.filters?.completed || "Completed"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Location Filter */}
      <div className={isRTL ? "text-right" : ""}>
        <label className="block mb-1 font-medium">{t?.filters?.location || "Location"}</label>
        <Select value={locationFilter} onValueChange={(val) => setLocationFilter(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t?.filters?.location || "Location"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t?.filters?.all || "All"}</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rows per page */}
      <div className={`flex items-center ${isRTL ? "justify-end text-right" : ""}`}>
        <label className={`mr-2 font-medium ${isRTL ? "ml-2 mr-0" : ""}`}>
          {t?.filters?.rowsPerPage || "Rows per page:"}
        </label>
        <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Rows" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

