export function normalizeBooking(data: any) {
  if (!data) return null;

  const id =
    data?._id ||
    data?.bookingId ||
    data?.booking?._id;

  if (!id) return null;

  return {
    ...data,
    _id: String(id),
  };
}