import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FolderOpen,
  History,
  Settings,
  Bell,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import { Button } from "../ui/button";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "react-toastify";
import { useLanguage } from "@/context/LanguageContext";
import { useAuthStore } from "@/core/store/auth";

interface AppSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  mini: boolean;
  windowWidth: number;
}

export default function AppSidebar({
  mobileOpen,
  setMobileOpen,
  mini,
  windowWidth,
}: AppSidebarProps) {
  const location = useLocation();
  console.log(location);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);

  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const isRTL = language === "AR";

  /* ================= AUTH STORE ================= */

  const { employeeData, logout } = useAuthStore();

  const user = employeeData?.user;
  const fullName = user?.fullName ?? "User";
  const profileImage = user?.profilePictureUrl;

  /* ================= HANDLERS ================= */

  const handleLogout = () => {
    logout(); // ✅ Zustand only

    toast.success("Logged out successfully");
    setMobileOpen(false);
    navigate("/login", { replace: true });
  };

  const toggleMenu = (title: string) =>
    setExpanded(expanded === title ? null : title);

  const sidebarWidthClass =
    windowWidth >= 1024 ? (mini ? "w-16" : "w-72") : "w-72";

  /* ================= MENU ================= */

  const menuItems = [
    {
      titleKey: t("history"),
      icon: History,
      href: "/history",
      subLinks: [
        { titleKey: t("bookingHistory"), href: "/history/booking" },
        { titleKey: t("transactionHistory"), href: "/history/transaction" },
        { titleKey: t("WorkHistory"), href: "/history/work" },
      ],
    },
    {
      titleKey: t("activity"),
      icon: FolderOpen,
      href: "/activity",
      subLinks: [
        { titleKey: t("recentActivity"), href: "/activity/recent" },
        { titleKey: t("pastActivity"), href: "/activity/past" },
      ],
    },
    {
      titleKey: t("settings"),
      icon: Settings,
      href: "/settings",
      subLinks: [
        { titleKey: t("profileSettings"), href: "/settings/profile" },
        { titleKey: t("wallet"), href: "/settings/wallet" },
        { titleKey: t("logout") }, // no href
      ],
    },
    {
      titleKey: t("notifications"),
      icon: Bell,
      href: "/notifications",
    },
  ];

  /* ================= RENDER ================= */

  return (
    <>
      {mobileOpen && windowWidth < 1024 && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 ${
          isRTL ? "right-0" : "left-0"
        } h-full z-50 border-r transition-transform duration-300 flex flex-col
        ${sidebarWidthClass}
        ${
          mobileOpen
            ? "translate-x-0"
            : isRTL
            ? "translate-x-full lg:translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        ${
          theme === "dark"
            ? "bg-gray-900 text-white border-gray-800"
            : "bg-gray-100 text-gray-900 border-gray-300"
        }
      `}
      >
        {/* ================= HEADER ================= */}
        <div
          className={`flex items-center justify-between px-4 py-4 border-b ${
            theme === "dark" ? "border-gray-800" : "border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            {profileImage ? (
              <img
                src={profileImage}
                alt={fullName}
                className={`h-10 w-10 rounded-full object-cover border cursor-pointer ${
                  theme === "dark"
                    ? "border-gray-700"
                    : "border-gray-400"
                }`}
                onClick={() => navigate("/")}
              />
            ) : (
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold border cursor-pointer ${
                  theme === "dark"
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-gray-200 text-gray-800 border-gray-400"
                }`}
              >
                {fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}

            {!mini && (
              <span
                className={`text-lg font-bold truncate max-w-[140px] cursor-pointer ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
                onClick={() => navigate("/")}
              >
                {fullName}
              </span>
            )}
          </div>

          {windowWidth < 1024 && (
            <Button
              onClick={() => setMobileOpen(false)}
              className="p-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* ================= MENU ================= */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-1">
            {menuItems.map((item) => (
              <li key={item.titleKey}>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (item.subLinks) toggleMenu(item.titleKey);
                    else if (item.href) {
                      navigate(item.href);
                      setMobileOpen(false);
                    }
                  }}
                  className={`flex items-center w-full px-4 py-2 rounded-lg justify-between`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {!mini && (
                      <span className="text-sm font-medium">
                        {item.titleKey}
                      </span>
                    )}
                  </div>

                  {!mini && item.subLinks && (
                    <ChevronRight
                      className={`h-4 w-4 ${
                        expanded === item.titleKey ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </Button>

                {item.subLinks && expanded === item.titleKey && !mini && (
                  <ul className="pl-10 mt-1 space-y-1">
                    {item.subLinks.map((sub) => (
                      <li key={sub.titleKey}>
                        <button
                          onClick={() => {
                            if (
                              sub.titleKey
                                .toLowerCase()
                                .includes("logout")
                            ) {
                              handleLogout();
                            } else if (sub.href) {
                              navigate(sub.href);
                              setMobileOpen(false);
                            }
                          }}
                          className="w-full text-left px-3 py-1 rounded-lg text-sm"
                        >
                          {sub.titleKey}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

