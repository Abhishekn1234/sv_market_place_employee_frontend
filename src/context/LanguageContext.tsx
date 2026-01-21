import React, { createContext, useContext, useEffect, useState } from "react";
import en from "./en.json";
import ar from "./ar.json";
import hi from "./hi.json";
import { useAuthStore } from "@/core/store/auth";



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



const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);



const allTranslations: Record<Language, TranslationSchema> = {
  EN: en,
  AR: ar,
  HI: hi,
};


export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  const userLang = useAuthStore((s) => s.employeeData?.user?.preferredLanguage);

  const [language, setLanguage] = useState<Language>(userLang || "EN");


  useEffect(() => {
    if (userLang && userLang !== language) {
      setLanguage(userLang);
    }
  }, [userLang]);

  useEffect(() => {
    
    document.documentElement.lang =
      language === "AR" ? "ar" : language === "HI" ? "hi" : "en";
    document.documentElement.setAttribute("translate", "no");

  
    useAuthStore.getState().setPreferredLanguage(language);
  }, [language]);

  
const t = (key: TranslationKey | string): string => {
  const keyStr = key.toString(); 
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



export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
