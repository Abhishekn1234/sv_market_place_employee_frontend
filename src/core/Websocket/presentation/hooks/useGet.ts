import { useEffect, useRef, useState, useCallback } from "react";
import type { GetBooking } from "../../domain/entities/getrepo";
import { BookingRepositoryImpl } from "../../data/repositories/GetRepoImpl";
import { GetAvailableBookingsUseCase } from "../../domain/usecase/GetWorkUsecase";

export function useAvailableBookings() {
  const [bookings, setBookings] = useState<GetBooking[]>([]);
  const idsRef = useRef<Set<string>>(new Set());

  const repoRef = useRef(new BookingRepositoryImpl());
  const usecaseRef = useRef(
    new GetAvailableBookingsUseCase(repoRef.current)
  );

  // ✅ REUSABLE FETCH
  const fetchBookings = useCallback(async () => {
    try {
      const res = await usecaseRef.current.execute();

      idsRef.current.clear();

      res.data.forEach((b) => idsRef.current.add(b._id));

      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  }, []);

  // ✅ INITIAL LOAD
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const removeBooking = (id: string) => {
    idsRef.current.delete(id);
    setBookings((prev) => prev.filter((b) => b._id !== id));
  };

  const addBooking = (booking: GetBooking) => {
    setBookings((prev) => {
      const exists = prev.find((b) => b._id === booking._id);

      if (exists) {
        return prev.map((b) =>
          b._id === booking._id ? { ...b, ...booking } : b
        );
      } else {
        idsRef.current.add(booking._id);
        return [booking, ...prev];
      }
    });
  };

  const updateBooking = (
    id: string,
    updatedFields: Partial<GetBooking>
  ) => {
    setBookings((prev) =>
      prev.map((b) =>
        b._id === id ? { ...b, ...updatedFields } : b
      )
    );
  };

  return {
    bookings,
    removeBooking,
    addBooking,
    updateBooking,
    fetchBookings, // ✅ IMPORTANT
  };
}
