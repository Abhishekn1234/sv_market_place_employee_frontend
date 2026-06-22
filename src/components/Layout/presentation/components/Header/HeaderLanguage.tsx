import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HeaderLanguage } from "../../../domain/entities/languagesettingheader";



interface Props {
  isRTL: boolean;
  language: string;
  languages: HeaderLanguage[];
  langDropdownOpen: boolean;
  setLangDropdownOpen: (open: boolean) => void;
  setLanguage: (code: "EN" | "AR" | "HI") => void;
}

export default function HeaderLanguage({
  isRTL,
  language,
  languages,
  langDropdownOpen,
  setLangDropdownOpen,
  setLanguage,
}: Props) {
  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setLangDropdownOpen(!langDropdownOpen)}
        className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <Globe className="h-5 w-5" />
        <span>{language}</span>
      </Button>

      {langDropdownOpen && (
        <div
          className={`absolute mt-2 w-36 ${isRTL ? "left-0" : "right-0"}
            bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
            rounded-md shadow-lg z-50`}
        >
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant="ghost"
              onClick={() => {
                setLanguage(lang.code as "EN" | "AR" | "HI");
                setLangDropdownOpen(false);
              }}
              className={`flex items-center gap-2 w-full px-4 py-2
                ${isRTL ? "flex-row-reverse text-right" : ""}
                text-gray-900 dark:text-gray-100
                hover:bg-gray-100 dark:hover:bg-gray-800`}
            >
              <span>{lang.icon}</span>
              {lang.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}