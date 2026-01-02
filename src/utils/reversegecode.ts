export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<string | null> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );

    const data = await res.json();

    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.state_district ||
      null
    );
  } catch (err) {
    console.error("Reverse geocode failed", err);
    return null;
  }
};
