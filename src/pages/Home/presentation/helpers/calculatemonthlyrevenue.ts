import type { BookingHistory } from "@/pages/History/BookingHistory/domain/entities/bookinghistory";

 export const calculateMonthlyRevenue = (bookings: BookingHistory[]) => {
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