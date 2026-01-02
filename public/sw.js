/* ===============================
   Service Worker – Location Notify
   =============================== */

let lastLocation = null;

function toRad(deg) { return (deg * Math.PI) / 180; }
function toDeg(rad) { return (rad * 180) / Math.PI; }

function getDistanceKm(from, to) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getDirection(from, to) {
  const y = Math.sin(toRad(to.lng - from.lng)) * Math.cos(toRad(to.lat));
  const x =
    Math.cos(toRad(from.lat)) * Math.sin(toRad(to.lat)) -
    Math.sin(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.cos(toRad(to.lng - from.lng));
  const bearing = (toDeg(Math.atan2(y, x)) + 360) % 360;
  const directions = [
    "North","North-East","East","South-East",
    "South","South-West","West","North-West",
  ];
  return directions[Math.round(bearing / 45) % 8];
}

/* ---------- Receive location from app ---------- */
self.addEventListener("message", async (event) => {
  if (!event.data || event.data.type !== "LOCATION_CHANGED") return;

  const { lat, lng } = event.data.payload || {};
  if (typeof lat !== "number" || typeof lng !== "number") return;

  // Default notification text
  let body = "Your location was updated";

  // Try to read last saved location from localStorage via client
  const clientsList = await clients.matchAll({ type: "window", includeUncontrolled: true });
  let lastSavedLocation = null;

  // Ask first client to send last saved location
  if (clientsList.length) {
    clientsList[0].postMessage({ type: "GET_LAST_SAVED_LOCATION" });
  }

  // Use IndexedDB or localStorage fallback via client responses (async handling)
  // For simplicity, assume clients will respond with RESOLVE_LAST_SAVED_LOCATION

  // If we have a last saved location, calculate distance & direction
  if (lastSavedLocation) {
    const distanceKm = getDistanceKm(lastSavedLocation, { lat, lng });
    const direction = getDirection(lastSavedLocation, { lat, lng });

    body =
      distanceKm < 1
        ? `You moved ${(distanceKm * 1000).toFixed(0)} meters towards ${direction}`
        : `You moved ${distanceKm.toFixed(0)} km towards ${direction}`;
  }

  // Show notification with distance & direction
  self.registration.showNotification("Location Changed", {
    body,
    tag: "location-update",
    renotify: true,
    requireInteraction: true,
    actions: [
      { action: "update", title: "Update" },
      { action: "close", title: "Close" },
    ],
    data: { lat, lng, url: "/settings/profile", tab: "location" },
  });

  // Ask clients to resolve placename for current location
  clientsList.forEach((client) => {
    client.postMessage({
      type: "RESOLVE_PLACENAME",
      payload: { lat, lng },
    });
  });
});