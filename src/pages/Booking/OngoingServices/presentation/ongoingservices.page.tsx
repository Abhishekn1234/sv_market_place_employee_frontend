"use client";

import { useState } from "react";
import OngoingServicesTable, { type OngoingService } from "./components/OngoingserviceTable";
import OngoingServicesFilters from "./components/Ongoingservicefilters";
import { useLanguage } from "@/context/LanguageContext";

export default function OngoingServicesPage() {
  const { translations, language } = useLanguage(); // now includes language
  const t = translations?.ongoingservices;

  // Mock data
  const allServices: OngoingService[] = [
    { id: "SRV-001", customer: "Rahul Sharma", location: "Delhi", startDate: "2026-01-20", status: "inProgress" },
    { id: "SRV-002", customer: "Aisha Khan", location: "Mumbai", startDate: "2026-01-22", status: "assigned" },
    { id: "SRV-003", customer: "John Doe", location: "Delhi", startDate: "2026-01-25", status: "paused" },
  ];

  // Filters state
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [rowsPerPage, setRowsPerPage] = useState<string>("5"); // Select expects string

  // Filtered services
  const filteredServices = allServices.filter(
    (s) =>
      (statusFilter === "all" || s.status === statusFilter) &&
      (locationFilter === "all" || s.location === locationFilter)
  );

  // Unique locations
  const locations = Array.from(new Set(allServices.map((s) => s.location)));

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className={`flex mb-4 ${language === "AR" ? "justify-end" : "justify-start"}`}>
        <h1 className="text-2xl font-semibold">{t?.title || "Ongoing Services"}</h1>
      </div>

      {/* Filters */}
      <OngoingServicesFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        locations={locations}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />

      {/* Ongoing Services Table */}
      <OngoingServicesTable data={filteredServices.slice(0, Number(rowsPerPage))} />
    </div>
  );
}
