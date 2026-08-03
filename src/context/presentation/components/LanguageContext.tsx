"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import type { TranslationSchema } from "../../domain/entities/types/translationschema.types";
import type { LanguageContextType } from "../../domain/entities/types/languagecontexttype.types";
import type { Language } from "../../domain/entities/types/language.types";
import { useAuthStore, useIsAuthenticated, usePreferredLanguage } from "@/core/store/auth";
import api from "@/api/api";

import en from "../../data/languagejson/en.json";
import ar from "../../data/languagejson/ar.json";
import hi from "../../data/languagejson/hi.json";

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const allTranslations: Record<Language, TranslationSchema> = {
  EN: en as unknown as TranslationSchema,
  AR: ar as unknown as TranslationSchema,
  HI: hi as unknown as TranslationSchema,
};

export interface LocalizedText {
  en?: string;
  ar?: string;
  hi?: string;
}

const mapLanguageToBackend = (lang: Language): string => {
  switch (lang) {
    case "AR":
      return "ar";
    case "HI":
      return "hi";
    default:
      return "en";
  }
};

const mapLanguageFromBackend = (value?: string | null): Language => {
  switch (value?.toLowerCase()) {
    case "ar":
      return "AR";
    case "hi":
      return "HI";
    default:
      return "EN";
  }
};

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const userLang = usePreferredLanguage();
  const isAuthenticated = useIsAuthenticated();

  const [language, setLanguage] = useState<Language>(userLang || "EN");

  const persistLanguage = useCallback(
    async (nextLanguage: Language) => {
      if (!isAuthenticated) return;

      try {
        await api.post("/language", {
          language: mapLanguageToBackend(nextLanguage),
        });
      } catch (error) {
        console.warn("Unable to sync language preference with server", error);
      }
    },
    [isAuthenticated]
  );

  const applyLanguage = useCallback(
    (nextLanguage: Language, shouldPersist: boolean) => {
      useAuthStore.getState().setPreferredLanguage(nextLanguage);
      setLanguage(nextLanguage);

      if (shouldPersist) {
        void persistLanguage(nextLanguage);
      }
    },
    [persistLanguage]
  );

  const changeLanguage = useCallback(
    (nextLanguage: Language) => {
      applyLanguage(nextLanguage, true);
    },
    [applyLanguage]
  );

  useEffect(() => {
    if (userLang && userLang !== language) {
      setLanguage(userLang);
    }
  }, [userLang, language]);

  useEffect(() => {
  if (!isAuthenticated) return;

  const loadServerLanguage = async () => {
    try {
      const response = await api.get("/language");
      const mappedLanguage = mapLanguageFromBackend(
        response.data?.language
      );

      applyLanguage(mappedLanguage, false);
    } catch (error) {
      console.warn(error);
    }
  };

  void loadServerLanguage();
}, [isAuthenticated]);

  useEffect(() => {
    document.documentElement.lang =
      language === "AR" ? "ar" : language === "HI" ? "hi" : "en";

    document.documentElement.setAttribute("translate", "no");
  }, [language]);

  /**
   * Translation function
   */
  const t = (
    key: string,
    params?: Record<string, string | number>
  ): any => {
    const keys = key.split(".");
    let value: any = allTranslations[language];

    for (const k of keys) {
      value = value?.[k];

      if (value === undefined) {
        return key;
      }
    }

    if (typeof value === "string" && params) {
      let result = value;

      Object.entries(params).forEach(([k, v]) => {
        result = result.replace(
          new RegExp(`{{${k}}}`, "g"),
          String(v)
        );
      });

      return result;
    }

    return value;
  };

  /**
   * Localize API values
   * Supports:
   * - string
   * - { en, ar, hi }
   */
  const localize = (
    value?: string | LocalizedText | null
  ): string => {
    if (!value) return "";

    // Already a string
    if (typeof value === "string") {
      return value;
    }

    switch (language) {
      case "AR":
        return value.ar || value.en || value.hi || "";

      case "HI":
        return value.hi || value.en || value.ar || "";

      default:
        return value.en || value.ar || value.hi || "";
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        t,
        localize,
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
    throw new Error(
      "useLanguage must be used within a LanguageProvider"
    );
  }

  return context;
};
