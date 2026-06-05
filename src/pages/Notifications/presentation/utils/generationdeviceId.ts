export function generateDeviceId() {
  const raw = navigator.userAgent + navigator.language + screen.width + screen.height;
  return btoa(raw).slice(0, 120);
}