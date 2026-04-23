export const getBookingId = (b: any) => {
  return String(
    b?._id ||
    b?.booking?._id ||
    b?.bookingId ||
    b?.id
  );
};