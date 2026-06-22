"use client";

import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import {
  // FolderOpen,
  History,
  Settings,
  Bell,
  // Home,
  // ChevronRight,
  // ChevronLeft,
  CalendarCheck,
  // CalendarCheck,
} from "lucide-react";

// import { Button } from "../ui/button";
import { useTheme } from "@/context/presentation/components/ThemeContext";
import { toast } from "react-toastify";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { useAuthStore } from "@/core/store/auth";
import { useProfile } from "@/pages/Profile/presentation/hooks/useProfile";
import { useUnreadCount } from "@/pages/Notifications/presentation/hooks/useUnreadCount";
import SidebarHeader from "../components/Sidebar/SidebarHeader";
import SidebarNav from "../components/Sidebar/SidebarNav";


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

 const { data: profile } = useProfile();
const { data: unreadCount = 0 } = useUnreadCount();
const fullName = profile?.fullName || user?.fullName || "User";
const profileImage = profile?.profilePictureUrl || user?.profileImage;
//  console.log(user);
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
        // {id:"Disputes",title:t("sidebar.disputes"), href:"/disputes"}
        // { id: "work", title: t("sidebar.workHistory"), href: "/history/work" },
        
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
        id: "assigned Work",
        title: t("sidebar.assignedWork"),
        href: "/availableWork",
      },
      // {
      //   id:"current Work",
      //   title:t('sidebar.currentWork'),
      //   href:"/currentWork"
      // }
      
    ],
  },
    // {
    //   id: "activity",
    //   title: t("sidebar.activity"),
    //   icon: FolderOpen,
    //   subLinks: [
    //     { id: "recent", title: t("sidebar.recentActivity"), href: "/activity/recent" },
    //     { id: "past", title: t("sidebar.pastActivity"), href: "/activity/past" },
    //   ],
    // },
    
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
      className={`fixed top-0 ${isRTL ? "right-0" : "left-0"} h-full z-50 border-r
        transition-transform duration-300 flex flex-col ${sidebarWidthClass}
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
        }`}
    >
      <SidebarHeader
        fullName={fullName}
        profileImage={profileImage}
        mini={mini}
        theme={theme}
        windowWidth={windowWidth}
        setMobileOpen={setMobileOpen}
      />

      <SidebarNav
        menuItems={menuItems}
        mini={mini}
        expanded={expanded}
        unreadCount={unreadCount}
        toggleMenu={toggleMenu}
        handleLogout={handleLogout}
        setMobileOpen={setMobileOpen}
      />
    </aside>
  </>
);
}
