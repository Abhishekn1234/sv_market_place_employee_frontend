import { create } from "zustand";

type Booking = any;

type State = {
  requestBookings: Booking[];
  assignedBookings: Booking[];
  connected: boolean;

  setConnected: (v: boolean) => void;

  upsertRequest: (b: Booking) => void;
  removeRequest: (id: string) => void;

  upsertAssigned: (b: Booking) => void;
  removeAssigned: (id: string) => void;
};

const getId = (b: any) => b?._id || b?.bookingId || b?.booking?._id;

export const useBookingSocketStore = create<State>((set, get) => ({
  requestBookings: [],
  assignedBookings: [],
  connected: false,

  setConnected: (v) => set({ connected: v }),

  upsertRequest: (b) => {
    const id = getId(b);
    const exists = get().requestBookings.find((x) => getId(x) === id);

    set({
      requestBookings: exists
        ? get().requestBookings.map((x) => (getId(x) === id ? { ...x, ...b } : x))
        : [b, ...get().requestBookings],
    });
  },

  removeRequest: (id) =>
    set({
      requestBookings: get().requestBookings.filter((x) => getId(x) !== id),
    }),

  upsertAssigned: (b) => {
    const id = getId(b);
    if (!id) return;

    const exists = get().assignedBookings.find((x) => getId(x) === id);
    const normalizedBooking = {
      ...b,
      _id: String(id),
    };

    set({
      assignedBookings: exists
        ? get().assignedBookings.map((x) =>
            getId(x) === id ? { ...x, ...normalizedBooking } : x
          )
        : [normalizedBooking, ...get().assignedBookings],
    });
  },

  removeAssigned: (id) =>
    set({
      assignedBookings: get().assignedBookings.filter((x) => getId(x) !== id),
    }),
}));
