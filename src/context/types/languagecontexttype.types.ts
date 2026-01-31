import type { Language } from "./language.types";
import type { TranslationSchema } from "./translationschema.types";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: TranslationSchema;
}