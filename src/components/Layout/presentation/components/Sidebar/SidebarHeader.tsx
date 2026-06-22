import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Props {
  fullName: string;
  profileImage?: string;
  mini: boolean;
  theme: string;
  windowWidth: number;
  setMobileOpen: (open: boolean) => void;
}

export default function SidebarHeader({
  fullName,
  profileImage,
  mini,
  theme,
  windowWidth,
  setMobileOpen,
}: Props) {
  const navigate = useNavigate();

  return (
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
            onClick={() => navigate("/")}
          >
            {fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
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
  );
}