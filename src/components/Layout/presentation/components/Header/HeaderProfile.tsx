import { Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { TranslationSchema } from "@/context/domain/entities/types/translationschema.types";

interface Props {
  isRTL: boolean;
  fullName?: string;
  profileImage?: string;
  dropdownOpen: boolean;
  translations:TranslationSchema;
  setDropdownOpen: (fn: (prev: boolean) => boolean) => void;
  handleLogout: () => void;
}

export default function HeaderProfile({
  isRTL,
  fullName,
  profileImage,
  dropdownOpen,
  translations,
  setDropdownOpen,
  handleLogout,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="relative">
            <Button
          variant="ghost"
          onClick={() => setDropdownOpen((p) => !p)}
          className={`
            flex flex-col sm:flex-row
            items-center
            gap-1 sm:gap-2
            min-w-fit
            px-2
            ${isRTL ? "sm:flex-row-reverse" : ""}
          `}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt={fullName}
              className="h-8 w-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0">
              {fullName?.slice(0, 2)?.toUpperCase()}
            </div>
          )}

          <span className="text-xs sm:text-sm text-center sm:text-left">
            {fullName}
          </span>
        </Button>

      {dropdownOpen && (
        <div
          className={`absolute mt-2 w-48 ${isRTL ? "left-0" : "right-0"}
            bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
            rounded-md shadow-lg z-50`}
        >
          <Button
            variant="ghost"
            className={`w-full px-4 py-2 ${
              isRTL ? "justify-end flex-row-reverse" : "justify-start"
            }`}
            onClick={() => navigate("/settings/profile")}
          >
            <Settings className="h-4 w-4" />
            {translations.sidebar.profileSettings}
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-2 text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {translations.sidebar.logout}
          </Button>
        </div>
      )}
    </div>
  );
}