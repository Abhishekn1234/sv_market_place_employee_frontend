export function BookingCard({
  booking,
  dark,
  accepting,
  onAccept,
  onIgnore,
  onDirections,
  onNavigate,
}: any) {
  return (
    <div
      className={`relative border rounded-xl p-4 flex flex-col gap-3 ${
        dark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"
      }`}
    >
      {/* Navigate */}
      <button
        onClick={onNavigate}
        className="absolute right-3 top-3 text-blue-600 text-xs font-semibold"
      >
        Assigned Works →
      </button>

      {/* Service Info */}
      <div>
        <h3 className="font-semibold text-lg">
          {booking.service?.name || "Service"}
        </h3>
        <p className="text-xs text-gray-500">
          Tier: {booking.serviceTier?.displayName || "-"}
        </p>
      </div>

      {/* Customer Info */}
      <div className="text-sm space-y-1">
        <p>
          <span className="font-medium">Customer:</span>{" "}
          {booking.customer?.fullName || "-"}
        </p>
        <p>
          <span className="font-medium">Phone:</span>{" "}
          {booking.customer?.phone || "-"}
        </p>
      </div>

      {/* Pricing Info */}
      <div className="text-sm space-y-1 border-t pt-2">
        <p>
          <span className="font-medium">Your Amount:</span>{" "}
          SAR {booking.workerPoolAmount ?? 0}
        </p>
        {/* <p>
          <span className="font-medium">Total Amount:</span>{" "}
          <span className="font-semibold">
            SAR {booking.amount ?? 0}
          </span>
        </p> */}
      </div>

      {/* Directions */}
      {onDirections && (
        <button
          onClick={onDirections}
          className="w-full border mt-2 py-2 rounded"
        >
          📍 Get Directions
        </button>
      )}

      {/* Actions */}
      {booking.status !== "WORKER_CANCELLED" && (
        <div className="mt-2 space-y-2">
          <button
            disabled={accepting}
            onClick={onAccept}
            className="w-full bg-green-500 text-white py-2 rounded"
          >
            {accepting ? "Processing..." : "Accept"}
          </button>

          <button
            onClick={onIgnore}
            className="w-full border py-2 rounded"
          >
            Ignore
          </button>
        </div>
      )}
    </div>
  );
}