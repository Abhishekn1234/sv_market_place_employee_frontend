import { useEffect, useRef, useState } from "react";
import type { GetBooking } from "../../domain/entities/getrepo";
import { BookingRepositoryImpl } from "../../data/repositories/GetRepoImpl";
import { GetAvailableBookingsUseCase } from "../../domain/usecase/GetWorkUsecase";
// import { initializeSocket } from "../components/socket";
// import { useAuthStore } from "@/core/store/auth";

export function useAvailableBookings() {
  // const token = useAuthStore(s => s.employeeData?.accessToken);
  // const workerId = useAuthStore(s => s.employeeData?.user?._id);

  const [bookings, setBookings] = useState<GetBooking[]>([]);
  // const [connected, setConnected] = useState(false);

  const idsRef = useRef<Set<string>>(new Set());

  /* ---------- API LOAD ---------- */
  useEffect(() => {
    const repo = new BookingRepositoryImpl();
    const usecase = new GetAvailableBookingsUseCase(repo);

    usecase.execute().then(res => {
      res.data.forEach(b => idsRef.current.add(b._id));
      setBookings(res.data);
    });
  }, []);

  /* ---------- SOCKET (COMMENTED OUT) ---------- */
  /*
  useEffect(() => {
    if (!token || !workerId) return;

    const socket = initializeSocket(token);

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      setConnected(true);
      socket.emit("worker.join", workerId);
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    const onBookingCreated = ({ booking }: { booking: GetBooking}) => {
      if (!idsRef.current.has(booking._id)) {
        idsRef.current.add(booking._id);
        setBookings(prev => [booking, ...prev]);
      }
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("booking.created", onBookingCreated);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("booking.created", onBookingCreated);
      socket.disconnect(); // optional but recommended
    };
  }, [token, workerId]);
  */

  /* ---------- HELPERS ---------- */
  const removeBooking = (id: string) => {
    idsRef.current.delete(id);
    setBookings(prev => prev.filter(b => b._id !== id));
  };

  const addBooking = (booking: GetBooking) => {
    setBookings(prev => {
      const exists = prev.find(b => b._id === booking._id);
      if (exists) {
        // update existing booking with new data
        return prev.map(b => (b._id === booking._id ? { ...b, ...booking } : b));
      } else {
        idsRef.current.add(booking._id);
        return [booking, ...prev];
      }
    });
  };

  return {
    bookings,
    // connected,
    removeBooking,
    addBooking
  };
}

