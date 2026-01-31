"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import en from "./languagejson/en.json";
import ar from "./languagejson/ar.json";
import hi from "./languagejson/hi.json";
import { useAuthStore } from "@/core/store/auth";
import type { Language } from "./types/language.types";
import type { TranslationSchema } from "./types/translationschema.types";
import type { LanguageContextType } from "./types/languagecontexttype.types";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const allTranslations: Record<Language, TranslationSchema> = {
  EN: en as unknown as TranslationSchema,
  AR: ar as unknown as TranslationSchema,
  HI: hi as unknown as TranslationSchema,
};


export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userLang = useAuthStore((s) => s.employeeData?.user?.preferredLanguage);

  const [language, setLanguage] = useState<Language>(userLang || "EN");

  useEffect(() => {
    if (userLang && userLang !== language) setLanguage(userLang);
  }, [userLang]);

  useEffect(() => {
    document.documentElement.lang =
      language === "AR" ? "ar" : language === "HI" ? "hi" : "en";
    document.documentElement.setAttribute("translate", "no");
    useAuthStore.getState().setPreferredLanguage(language);
  }, [language]);

  
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = allTranslations[language];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    return typeof value === "string" ? value : key;
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


export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
