import React, { createContext, useContext, useEffect, useState } from "react";
import en from "./en.json";
import ar from "./ar.json";
import hi from "./hi.json";
import { useAuthStore } from "@/core/store/auth";

/* ------------------ TYPES ------------------ */

export type Language = "EN" | "AR" | "HI";

export type TranslationValue = string | { [key: string]: TranslationValue };

export type TranslationSchema = {
  [key: string]: TranslationValue;
  workHistory: any;
  recentActivities: any;
  Wallet: any;
  Notifications: any;
  HomePage: any;
};

export type TranslationKey = keyof TranslationSchema;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey | string) => string;
  translations: TranslationSchema;
}

/* ------------------ CONTEXT ------------------ */

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

/* ------------------ TRANSLATIONS ------------------ */

const allTranslations: Record<Language, TranslationSchema> = {
  EN: en,
  AR: ar,
  HI: hi,
};

/* ------------------ PROVIDER ------------------ */

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Get the user's preferred language from auth store
  const userLang = useAuthStore((s) => s.employeeData?.user?.preferredLanguage);

  const [language, setLanguage] = useState<Language>(userLang || "EN");

  // Sync language with auth store whenever it changes
  useEffect(() => {
    if (userLang && userLang !== language) {
      setLanguage(userLang);
    }
  }, [userLang]);

  useEffect(() => {
    // Set document language attribute
    document.documentElement.lang =
      language === "AR" ? "ar" : language === "HI" ? "hi" : "en";
    document.documentElement.setAttribute("translate", "no");

    // Persist preferred language in auth store
    useAuthStore.getState().setPreferredLanguage(language);
  }, [language]);

  // Translation function
const t = (key: TranslationKey | string): string => {
  const keyStr = key.toString(); // ensure it's a string
  const keys = keyStr.split(".");
  let value: any = allTranslations[language];

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) return "";
  }
  return typeof value === "string" ? value : "";
};


  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translations: allTranslations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

/* ------------------ HOOK ------------------ */

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
