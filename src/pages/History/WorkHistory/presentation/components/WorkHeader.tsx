"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function WorkHeader() {
  const { translations, language } = useLanguage();
  const isRTL = language === "AR";
  const { theme } = useTheme();

  const workhistory = translations.workHistory;

  return (
    <div
      className={`
        ${theme === "dark" ? "text-gray-100" : "text-gray-900"}
        ${isRTL ? "text-right" : "text-left"}
      `}
    >
      <h1 className="text-xl sm:text-2xl font-semibold">
        {workhistory.pageTitle}
      </h1>
    </div>
  );
}
