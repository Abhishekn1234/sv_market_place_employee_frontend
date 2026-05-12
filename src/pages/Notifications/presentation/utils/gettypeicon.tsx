import { BellRing, CheckCircle, Info } from "lucide-react";
import type { Notification } from "../../domain/entities/notification";

 export const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "BOOKING_REQUEST":
        return <BellRing className="w-5 h-5" />;
      case "BOOKING_UPDATE":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };