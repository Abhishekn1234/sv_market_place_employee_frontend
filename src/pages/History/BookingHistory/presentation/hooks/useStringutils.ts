export function useStringUtils() {
  const asString = (value: unknown): string => {
    return typeof value === "string" ? value : "";
  };

  const getNestedString = (value: unknown, key: string): string => {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      key in value
    ) {
      const record = value as Record<string, unknown>;
      return typeof record[key] === "string" ? record[key] : "";
    }
    return "";
  };

  const formatTime = (time: string): string => {
    if (!time) return "";
    const parts = time.trim().split(" ");
    if (parts.length === 2) {
      const [ampm, clock] = parts;
      return `${clock} ${ampm.toUpperCase()}`;
    }
    return time;
  };

  return {
    asString,
    getNestedString,
    formatTime,
  };
}
