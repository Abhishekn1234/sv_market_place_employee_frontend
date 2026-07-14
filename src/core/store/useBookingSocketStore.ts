import { create } from "zustand";

type Booking = any;

type State = {
  requestBookings: Booking[];
  assignedBookings: Booking[];
  connected: boolean;

  setConnected: (v: boolean) => void;

  setAssignedBookings: (list: Booking[]) => void;

  upsertRequest: (b: Booking) => void;
  removeRequest: (id: string) => void;

  upsertAssigned: (b: Booking) => void;
  removeAssigned: (id: string) => void;
};

// ✅ SAFE ID RESOLVER
const getId = (b: any) =>
  b?._id || b?.booking?._id || b?.bookingId || null;

const normalizeId = (id: any) => (id ? String(id) : null);

export const useBookingSocketStore = create<State>((set) => ({
  requestBookings: [],
  assignedBookings: [],
  connected: false,

  setConnected: (v) => set({ connected: v }),

  // ✅ HYDRATION FROM API
  setAssignedBookings: (list) =>
    set(() => ({
      assignedBookings: Array.isArray(list) ? list : [],
    })),

  // =========================
  // REQUEST BOOKINGS
  // =========================

  upsertRequest: (b) =>
    set((state) => {
      const id = normalizeId(getId(b));
      if (!id) return state;

      const exists = state.requestBookings.some(
        (x) => normalizeId(getId(x)) === id
      );

      return {
        requestBookings: exists
          ? state.requestBookings.map((x) =>
              normalizeId(getId(x)) === id ? { ...x, ...b } : x
            )
          : [b, ...state.requestBookings],
      };
    }),

  removeRequest: (id) =>
    set((state) => ({
      requestBookings: state.requestBookings.filter(
        (x) => normalizeId(getId(x)) !== normalizeId(id)
      ),
    })),

  // =========================
  // ASSIGNED BOOKINGS (FIXED)
  // =========================

 upsertAssigned: (b) =>
  set((state) => {
    const id = normalizeId(getId(b));
    if (!id) return state;

    const exists = state.assignedBookings.find(
      (x) => normalizeId(getId(x)) === id
    );

   const normalized = {
  ...exists,
  ...b,
  _id: id,

  booking: {
    ...(exists?.booking ?? {}),
    ...(b.booking ?? {}),
    status:
      b.status ??
      b.booking?.status ??
      exists?.booking?.status,
    workStartedAt:
      b.workStartedAt ??
      b.booking?.workStartedAt ??
      exists?.booking?.workStartedAt,
  },

  workerActions: {
    ...(exists?.workerActions ?? {}),
    ...(b.workerActions ?? {}),
    ...(b.booking?.workerActions ?? {}),
  },
};

    if (exists) {
      return {
        assignedBookings: state.assignedBookings.map((x) =>
          normalizeId(getId(x)) === id ? normalized : x
        ),
      };
    }

    return {
      assignedBookings: [normalized, ...state.assignedBookings],
    };
  }),
  // =========================
  // REMOVE (INSTANT UI UPDATE)
  // =========================

  removeAssigned: (id) =>
    set((state) => ({
      assignedBookings: state.assignedBookings.filter(
        (x) => normalizeId(getId(x)) !== normalizeId(id)
      ),
    })),
}));