import type { LocalizedText } from "@/context/presentation/components/LanguageContext";
import type { Language } from "./language.types";
import type { TranslationSchema } from "./translationschema.types";

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;

  t: (
    key: string,
    params?: Record<string, string | number>
  ) => any;

  localize: (
    value?: string | LocalizedText | null
  ) => string;

  translations: TranslationSchema;
}