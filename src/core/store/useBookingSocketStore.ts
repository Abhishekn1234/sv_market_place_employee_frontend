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

    // ✅ Resolve status from socket event first
    let status =
      b.status ??
      b.booking?.status ??
      exists?.booking?.status;

    switch (b.eventName) {
      case "WORK_START_OTP_GENERATED":
        status = "WORK_START_OTP_GENERATED";
        break;

      case "WORK_STARTED":
      case "WORKER_STARTED":
        status = "STARTED";
        break;

      case "WORK_COMPLETED_BY_WORKER":
      case "COMPLETION_OTP_GENERATED":
        status = "WORK_COMPLETED_PENDING";
        break;

      case "COMPLETION_CONFIRMED":
        status = "COMPLETION_CONFIRMED";
        break;

      case "INVOICE_GENERATED":
        status = "INVOICE_GENERATED";
        break;

      case "PAYMENT_INITIATED":
        status = "PAYMENT_INITIATED";
        break;

      case "PARTIALLY_PAID":
        status = "PARTIALLY_PAID";
        break;

      case "PAYMENT_COMPLETED":
      case "PAID":
        status = "PAYMENT_COMPLETED";
        break;

      case "CANCELLED_BY_CUSTOMER":
        status = "CUSTOMER_CANCELLED";
        break;

      case "CANCELLED_BY_WORKER":
        status = "WORKER_CANCELLED";
        break;

      default:
        break;
    }

  const normalized = {
  ...(exists ?? {}),
  ...b,

  _id: id,
  bookingId: id,

  // Preserve top-level fields
  customer: b.customer ?? exists?.customer,
  service: b.service ?? exists?.service,
  location: b.location ?? exists?.location,
  elapsedTime: b.elapsedTime ?? exists?.elapsedTime,
  startedAt: b.startedAt ?? exists?.startedAt,
  workStartedAt:
    b.workStartedAt ??
    b.booking?.workStartedAt ??
    exists?.workStartedAt,

  booking: {
    ...(exists?.booking ?? {}),
    ...(b.booking ?? {}),

    _id: id,
    status,

    // Deep merge nested objects
    customer: {
      ...(exists?.booking?.customer ?? {}),
      ...(b.booking?.customer ?? {}),
    },

    service: {
      ...(exists?.booking?.service ?? {}),
      ...(b.booking?.service ?? {}),
    },

    schedule: {
      ...(exists?.booking?.schedule ?? {}),
      ...(b.booking?.schedule ?? {}),
    },

    location:
      b.booking?.location ??
      exists?.booking?.location,

    currency:
      b.booking?.currency ??
      exists?.booking?.currency,

    numberOfWorkers:
      b.booking?.numberOfWorkers ??
      exists?.booking?.numberOfWorkers,

    workerPoolAmount:
      b.booking?.workerPoolAmount ??
      exists?.booking?.workerPoolAmount,

    finalWorkerPoolAmount:
      b.booking?.finalWorkerPoolAmount ??
      exists?.booking?.finalWorkerPoolAmount,

    workStartedAt:
      b.workStartedAt ??
      b.booking?.workStartedAt ??
      exists?.booking?.workStartedAt,

    workerActions: {
      ...(exists?.booking?.workerActions ?? {}),
      ...(b.booking?.workerActions ?? {}),
    },
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