import { useLanguage } from "@/context/LanguageContext";
import type { GetBooking } from "@/core/Websocket/domain/entities/getrepo";
import { useAvailableBookings } from "@/core/Websocket/presentation/hooks/useGet";
import { useAssign } from "@/pages/Booking/AvaliableWorks/presentation/hooks/useAssign";
import { data } from "@/pages/Notifications/presentation/data/mockdata";
import { ClipboardList, Wrench, CreditCard, Bell } from "lucide-react";

export const useHomeCards = () => {
  const { translations } = useLanguage();
  const homeTranslations = translations.HomePage;

  const { bookings = [] } = useAvailableBookings();
  const { assignedWorks = [] } = useAssign();

  const totalBookingsCount = bookings.length;

  const calculateMonthlyRevenue = (bookings: GetBooking[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return bookings.reduce((total, booking) => {
      if (!booking.createdAt || !booking.amount) return total;

      const bookingDate = new Date(booking.createdAt);

      if (
        bookingDate.getMonth() === currentMonth &&
        bookingDate.getFullYear() === currentYear
      ) {
        return total + booking.amount;
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
      value: data.length,
      icon: Bell,
      bg: "bg-red-100",
      text: "text-red-600",
    },
  ];
};

