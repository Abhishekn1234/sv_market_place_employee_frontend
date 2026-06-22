import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { MenuItem } from "../../../domain/entities/menuitem";


interface Props {
  item: MenuItem;
  mini: boolean;
  expanded: string | null;
  unreadCount: number;
  toggleMenu: (id: string) => void;
  handleLogout: () => void;
  setMobileOpen: (open: boolean) => void;
}

export default function SidebarNavItem({
  item,
  mini,
  expanded,
  unreadCount,
  toggleMenu,
  handleLogout,
  setMobileOpen,
}: Props) {
  const navigate = useNavigate();

  return (
    <li>
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
          <div className="relative">
            <item.icon className="h-5 w-5" />
            {item.id === "notifications" && unreadCount > 0 && (
              <span
                className="absolute -top-2 -right-2 min-w-[18px] h-[18px]
                  px-1 flex items-center justify-center text-[10px] font-bold
                  rounded-full bg-red-500 text-white shadow-md"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>

          {!mini && (
            <span className="text-sm font-medium">{item.title}</span>
          )}
        </div>

        {!mini && item.subLinks && (
          <ChevronRight
            className={`h-4 w-4 transition-transform ${
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
  );
}