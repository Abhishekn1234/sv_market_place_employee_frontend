import { create } from "zustand";

type Booking = any;

type State = {
  requestBookings: Booking[];
  assignedBookings: Booking[];
  connected: boolean;

  setConnected: (v: boolean) => void;

  // ✅ IMPORTANT: hydration from API
  setAssignedBookings: (list: Booking[]) => void;

  upsertRequest: (b: Booking) => void;
  removeRequest: (id: string) => void;

  upsertAssigned: (b: Booking) => void;
  removeAssigned: (id: string) => void;
};

const getId = (b: any) =>
  b?._id || b?.bookingId || b?.booking?._id;

export const useBookingSocketStore = create<State>((set, _get) => ({
  requestBookings: [],
  assignedBookings: [],
  connected: false,

  setConnected: (v) => set({ connected: v }),

  // ✅ HYDRATION (API → STORE)
  setAssignedBookings: (list) =>
    set(() => ({
      assignedBookings: list,
    })),

  upsertRequest: (b) =>
    set((state) => {
      const id = getId(b);
      const exists = state.requestBookings.some(
        (x) => getId(x) === id
      );

      return {
        requestBookings: exists
          ? state.requestBookings.map((x) =>
              getId(x) === id ? { ...x, ...b } : x
            )
          : [b, ...state.requestBookings],
      };
    }),

  removeRequest: (id) =>
    set((state) => ({
      requestBookings: state.requestBookings.filter(
        (x) => getId(x) !== id
      ),
    })),

  upsertAssigned: (b) =>
    set((state) => {
      const id = getId(b);
      if (!id) return state;

      const exists = state.assignedBookings.some(
        (x) => getId(x) === id
      );

      const normalized = {
        ...b,
        _id: String(id),
      };

      return {
        assignedBookings: exists
          ? state.assignedBookings.map((x) =>
              getId(x) === id ? { ...x, ...normalized } : x
            )
          : [normalized, ...state.assignedBookings],
      };
    }),

  removeAssigned: (id) =>
    set((state) => ({
      assignedBookings: state.assignedBookings.filter(
        (x) => getId(x) !== id
      ),
    })),
}));