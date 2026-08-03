

export type CancelReasonType =
  | "BOOKED_WRONG_SERVICE"
  | "BOOKED_BY_MISTAKE"
  | "SCHEDULE_CHANGED"
  | "PRICE_TOO_HIGH"
  | "SERVICE_NO_LONGER_NEEDED"
  | "OTHER";

export type CancelWork =
  | {
      bookingId: string;
      cancelReasonType: Exclude<CancelReasonType, "OTHER">;
      cancelReason?: never;
    }
  | {
      bookingId: string;
      cancelReasonType: "OTHER";
      cancelReason: string;
    };