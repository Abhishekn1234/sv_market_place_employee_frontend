import { create } from "zustand";

type Store = {
  bookings: any[];
  connected: boolean;

  setConnected: (v: boolean) => void;
  upsertBooking: (b: any) => void;
  removeBooking: (id: string) => void;
};

export const useBookingSocketStore = create<Store>((set, get) => ({
  bookings: [],
  connected: false,

  setConnected: (v) => set({ connected: v }),

  upsertBooking: (booking) => {
    const existing = get().bookings; // ✅ now valid

    const index = existing.findIndex((b) => b._id === booking._id);

    if (index !== -1) {
      const updated = [...existing];
      updated[index] = { ...updated[index], ...booking };
      set({ bookings: updated });
    } else {
      set({ bookings: [booking, ...existing] });
    }
  },

  removeBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b._id !== id),
    })),
}));