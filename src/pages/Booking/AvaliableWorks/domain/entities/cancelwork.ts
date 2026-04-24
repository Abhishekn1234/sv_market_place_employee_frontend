

export type CancelType =
  | "BOOKED_WRONG_SERVICE"
  | "BOOKED_BY_MISTAKE"
  | "SCHEDULE_CHANGED"
  | "PRICE_TOO_HIGH"
  | "SERVICE_NO_LONGER_NEEDED"
  | "OTHER";

export type CancelWork =
  | {
      bookingId: string;
      cancelType: Exclude<CancelType, "OTHER">;
      cancelReason?: never;
    }
  | {
      bookingId: string;
      cancelType: "OTHER";
      cancelReason: string;
    };