import { ActivityHeader } from "./components/ActivityHeader";
import { ActivityStats } from "./components/ActivityStats";
import { ActivityTimeline } from "./components/ActivityTimeline";
import { reverseGeocode } from "@/components/common/CommonMap";

import type { Activity } from "../domain/entities/activity";
import { useGetBookingHistory } from "@/pages/History/BookingHistory/presentation/hooks/useGetBookingHistory";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/core/store/auth";
import CommonSpinner from "@/components/common/CommonSpinner";


export default function RecentActivity() {
  const {user}=useAuthStore();
  const { data: bookingHistory } = useGetBookingHistory();
  const { data: categories } = useServiceCategory();

  const bookings = bookingHistory?.data ?? [];

  const [locations, setLocations] = useState<Record<string, string>>({});


const recentBookings = [...bookings]
  .filter((item) => item.booking?.startedAt)
  .sort(
    (a, b) =>
      Date.parse(b.booking!.startedAt!) -
      Date.parse(a.booking!.startedAt!)
  )
  

 
useEffect(() => {
  const fetchLocations = async () => {

    const coordCache: Record<string, string> = {};
    const results: Record<string, string> = {};

    await Promise.all(
      recentBookings.map(async (item) => {

        const coords =
          typeof item.booking?.location === "string"
            ? undefined
            : item.booking?.location?.coordinates;

        if (!coords) {
          results[item._id ?? ""] = "Unknown location";
          return;
        }

        const key = `${coords[1]},${coords[0]}`; 
        if (coordCache[key]) {
          results[item._id ?? ""] = coordCache[key];
          return;
        }

        try {
          const address = await reverseGeocode(coords[1], coords[0]);
          coordCache[key] = address;
          results[item._id ?? ""] = address;
        } catch {
          coordCache[key] = "Unknown location";
          results[item._id ?? ""] = "Unknown location";
        }
      })
    );

    setLocations(results);
  };

  if (recentBookings.length) {
    fetchLocations();
  }

}, [recentBookings]);


  const activities: Activity[] = useMemo(() => {

    const statusMap: Record<string, Activity["status"]> = {
      COMPLETED: "completed",
      INVOICE_GENERATED: "INVOICE_GENERATED",
      IN_PROGRESS: "pending",
      REQUESTED: "pending",
      CANCELLED: "cancelled",
      in_progress:"IN_PROGRESS"
    };

    return recentBookings.map((item, index) => {

      const id = item._id ?? String(index);

      const serviceName = item.service?.name ?? "Service Booking";

      const categoryId = item.service?.category;

      const category = categories?.find(
        (cat) => cat._id === categoryId
      );

      return {
        id,
        type: "booking",

        title: serviceName,

        description: category?.name ?? "Category",

      timestamp: item.booking?.startedAt
  ? new Date(item.booking.startedAt)
  : new Date(),
        status:
          statusMap[item.booking?.status ?? ""] ?? "pending",

        amount: item.booking?.amount ?? 0,
        currency:item.booking.currency,

        client: item.customer?.email ?? "Client",

        location: locations[id] ?? <CommonSpinner/>,
      };

    });

  }, [recentBookings, categories, locations]);

  
  const totalEarnings = useMemo(() => {
    return activities
      // .filter((a) => a.status === "completed")
      .reduce((sum, a) => sum + (a.amount ?? 0), 0);
  }, [activities]);

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto space-y-6">

        <ActivityHeader
          employeeName={user?.fullName??""}
          employeeId={user?._id??""}
          totalEarnings={totalEarnings}
          completedBookings={
            activities.filter(
              (a) => a.type === "booking"
            ).length
          }
        />

        <ActivityStats activities={activities} />

        <ActivityTimeline activities={activities} />

      </div>
    </div>
  );
}