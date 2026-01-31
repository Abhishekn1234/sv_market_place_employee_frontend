"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function OngoingServicesHeader() {
  const {translations}=useLanguage();

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold">{translations.ongoingservices?.title}</h1>
    </div>
  );
}
