import { useLanguage } from "@/context/presentation/components/LanguageContext";
import type { BookingHistory } from "@/pages/History/BookingHistory/domain/entities/bookinghistory";
import { useGetBookingHistory } from "@/pages/History/BookingHistory/presentation/hooks/useGetBookingHistory";
import { useNotifications } from "@/pages/Notifications/presentation/hooks/useNotification";
import { ClipboardList, Wrench, CreditCard, Bell } from "lucide-react";
import { calculateMonthlyRevenue } from "../helpers/calculatemonthlyrevenue";

export const useHomeCards = () => {
  const { translations } = useLanguage();
  const homeTranslations = translations.HomePage;
 const { data: notificationData } = useNotifications();
  const { data: bookingHistory } = useGetBookingHistory();

  const bookings: BookingHistory[] = bookingHistory?.data ?? [];

  const totalBookingsCount = bookingHistory?.pagination.totalItems ?? 0;

  const assignedWorks = bookings.filter(
    (item) => item.booking?.status === "WORK_COMPLETED_PENDING"
  );

 const monthlyRevenue = calculateMonthlyRevenue(bookings);

  return [
    {
      title: homeTranslations.totalBookings,
      value: totalBookingsCount,
      icon: ClipboardList,
      bg: "bg-indigo-100",
      text: "text-indigo-600",
    },
    {
      title: homeTranslations.assignedWorks,
      value: assignedWorks.length,
      icon: Wrench,
      bg: "bg-green-100",
      text: "text-green-600",
    },
    {
      title: homeTranslations.monthlyRevenue,
      value: `SAR ${monthlyRevenue.toLocaleString()}`,
      icon: CreditCard,
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    {
      title: homeTranslations.notifications,
      value: notificationData?.pages.flatMap((data)=>data.pagination.totalItems),
      icon: Bell,
      bg: "bg-red-100",
      text: "text-red-600",
    },
  ];
};