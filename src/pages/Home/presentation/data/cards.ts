import { useLanguage } from "@/context/LanguageContext";
import type { BookingHistory } from "@/pages/History/BookingHistory/domain/entities/bookinghistory";
import { useGetBookingHistory } from "@/pages/History/BookingHistory/presentation/hooks/useGetBookingHistory";
import { data as notificationData } from "@/pages/Notifications/presentation/data/mockdata";

import { ClipboardList, Wrench, CreditCard, Bell } from "lucide-react";
import { calculateMonthlyRevenue } from "../helpers/calculatemonthlyrevenue";

export const useHomeCards = () => {
  const { translations } = useLanguage();
  const homeTranslations = translations.HomePage;

  const { data: bookingHistory } = useGetBookingHistory();
  console.log(bookingHistory);
  const bookings: BookingHistory[] = bookingHistory?.data ?? [];

  const totalBookingsCount = bookingHistory?.data?.length ?? 0;

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
      value: notificationData.length,
      icon: Bell,
      bg: "bg-red-100",
      text: "text-red-600",
    },
  ];
};