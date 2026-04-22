import { create } from "zustand";

type Store = {
  bookings: any[];
  connected: boolean;

  setConnected: (v: boolean) => void;
  upsertBooking: (b: any) => void;
  removeBooking: (id: string) => void;
};

export const useBookingSocketStore = create<Store>((set) => ({
  bookings: [],
  connected: false,

  setConnected: (v) => set({ connected: v }),

  upsertBooking: (booking) =>
  set((state) => {
    if (!booking?._id) return state;

    const index = state.bookings.findIndex(
      (b) => b._id === booking._id
    );

    if (index === -1) {
      return {
        bookings: [booking, ...state.bookings],
      };
    }

    const updated = [...state.bookings];

    updated[index] = {
      ...state.bookings[index], // always trust existing first
      ...booking,               // then override
      _id: state.bookings[index]._id, // 🔥 lock identity
    };

    return { bookings: updated };
  }),

  removeBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b._id !== id),
    })),
}));