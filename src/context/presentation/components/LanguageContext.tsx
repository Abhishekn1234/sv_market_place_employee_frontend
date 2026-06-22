"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { TranslationSchema } from "../../domain/entities/types/translationschema.types";
import type { LanguageContextType } from "../../domain/entities/types/languagecontexttype.types";
import type { Language } from "../../domain/entities/types/language.types";
import { useAuthStore } from "@/core/store/auth";
import en from "../../data/languagejson/en.json";
import ar from "../../data/languagejson/ar.json";
import hi from "../../data/languagejson/hi.json";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const allTranslations: Record<Language, TranslationSchema> = {
  EN: en as unknown as TranslationSchema,
  AR: ar as unknown as TranslationSchema,
  HI: hi as unknown as TranslationSchema,
};


export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userLang = useAuthStore((s) => s.user?.preferredLanguage);

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

  
  const t = (key: string, params?: Record<string, string | number>): any => {
    const keys = key.split(".");
    let value: any = allTranslations[language];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }

    if (typeof value === "string" && params) {
      let result = value;
      Object.entries(params).forEach(([k, v]) => {
        result = result.replace(new RegExp(`{{${k}}}`, "g"), String(v));
      });
      return result;
    }
    return value;
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
