import { useLanguage } from "@/context/LanguageContext";
import type { BookingHistory } from "@/pages/History/BookingHistory/domain/entities/bookinghistory";
import { useGetBookingHistory } from "@/pages/History/BookingHistory/presentation/hooks/useGetBookingHistory";
import { data as notificationData } from "@/pages/Notifications/presentation/data/mockdata";

import { ClipboardList, Wrench, CreditCard, Bell } from "lucide-react";

export const useHomeCards = () => {
  const { translations } = useLanguage();
  const homeTranslations = translations.HomePage;

  const { data: bookingHistory } = useGetBookingHistory();

  const bookings: BookingHistory[] = bookingHistory?.data ?? [];

const totalBookingsCount = bookingHistory?.data?.length ?? 0;

  const assignedWorks = bookings.filter(
    (item) => item.booking?.status === "WORK_COMPLETED_PENDING"
  );

  const calculateMonthlyRevenue = (bookings: BookingHistory[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return bookings.reduce((total, booking) => {
      if (!booking?.booking?.startedAt || !booking?.booking?.amount) return total;

      const bookingDate = new Date(booking.booking.startedAt);

      if (
        bookingDate.getMonth() === currentMonth &&
        bookingDate.getFullYear() === currentYear
      ) {
        return total + booking.booking.amount;
      }

      return total;
    }, 0);
  };

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