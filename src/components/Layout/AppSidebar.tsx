"use client";

import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import {
  FolderOpen,
  History,
  Settings,
  Bell,
  // Home,
  ChevronRight,
  ChevronLeft,
  CalendarCheck,
  // CalendarCheck,
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
  // const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);

  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const isRTL = language === "AR";

  const { user, logout } = useAuthStore();

 
  const fullName = user?.fullName ?? "User";
  const profileImage = user?.profilePictureUrl;

  const handleLogout = () => {
    logout();
    toast.success(t("common.logoutSuccess"));
    setMobileOpen(false);
    navigate("/login", { replace: true });
  };

  const toggleMenu = (id: string) =>
    setExpanded(expanded === id ? null : id);

  const sidebarWidthClass =
    windowWidth >= 1024 ? (mini ? "w-16" : "w-72") : "w-72";


  const menuItems = [
    // {
    //   id: "home",
    //   title: t("sidebar.home"),
    //   icon: Home,
    //   href: "/",
    // },
    {
      id: "history",
      title: t("sidebar.history"),
      icon: History,
      subLinks: [
        { id: "booking", title: t("sidebar.bookingHistory"), href: "/history/booking" },
        { id: "transaction", title: t("sidebar.transactionHistory"), href: "/history/transaction" },
        { id: "work", title: t("sidebar.workHistory"), href: "/history/work" },
        
      ],
    },
     {
    id: "booking",
    title: t("sidebar.booking"),
    icon: CalendarCheck,
    subLinks: [
      {
        id: "available Booking",
        title: t("sidebar.availableBooking"),
        href: "/availableBooking",
      },
      {
        id: "available Work",
        title: t("sidebar.availableWork"),
        href: "/availableWork",
      },
      
    ],
  },
    {
      id: "activity",
      title: t("sidebar.activity"),
      icon: FolderOpen,
      subLinks: [
        { id: "recent", title: t("sidebar.recentActivity"), href: "/activity/recent" },
        { id: "past", title: t("sidebar.pastActivity"), href: "/activity/past" },
      ],
    },
    
    {
      id: "settings",
      title: t("sidebar.settings"),
      icon: Settings,
      subLinks: [
        { id: "profile", title: t("sidebar.profileSettings"), href: "/settings/profile" },
        { id: "wallet", title: t("sidebar.wallet"), href: "/settings/wallet" },
        { id: "logout", title: t("sidebar.logout"), action: "logout" },
      ],
    },
    {
      id: "notifications",
      title: t("sidebar.notifications"),
      icon: Bell,
      href: "/notifications",
    },
  ];

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
                className="h-10 w-10 rounded-full object-cover border cursor-pointer"
                onClick={() => navigate("/")}
              />
            ) : (
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center font-semibold border cursor-pointer"
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
                className="text-lg font-bold truncate max-w-[140px] cursor-pointer"
                onClick={() => navigate("/")}
              >
                {fullName}
              </span>
            )}
          </div>

          {windowWidth < 1024 && (
            <Button onClick={() => setMobileOpen(false)} className="p-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>

        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (item.subLinks) toggleMenu(item.id);
                    else if (item.href) {
                      navigate(item.href);
                      setMobileOpen(false);
                    }
                  }}
                  className="flex items-center w-full px-4 py-2 rounded-lg justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {!mini && (
                      <span className="text-sm font-medium">
                        {item.title}
                      </span>
                    )}
                  </div>

                  {!mini && item.subLinks && (
                    <ChevronRight
                      className={`h-4 w-4 ${
                        expanded === item.id ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </Button>

                {item.subLinks && expanded === item.id && !mini && (
                  <ul className="pl-10 mt-1 space-y-1">
                    {item.subLinks.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => {
                            if (sub.action === "logout") {
                              handleLogout();
                            } else if (sub.href) {
                              navigate(sub.href);
                              setMobileOpen(false);
                            }
                          }}
                          className="w-full text-left px-3 py-1 rounded-lg text-sm cursor-pointer"
                        >
                          {sub.title}
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
