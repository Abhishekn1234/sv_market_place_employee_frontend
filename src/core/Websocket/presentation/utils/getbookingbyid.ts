export const getBookingId = (b: any): string | undefined => {
  return (
    b?.bookingId ??
    b?.booking?._id ??
    b?.id ??
    b?._id
  )?.toString();
};