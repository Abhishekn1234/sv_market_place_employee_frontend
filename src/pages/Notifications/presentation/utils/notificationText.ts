import type { Language } from "@/context/domain/entities/types/language.types";

const LANGUAGE_KEYS: Record<Language, string[]> = {
  EN: ["en", "EN", "english", "English"],
  AR: ["ar", "AR", "arabic", "Arabic"],
  HI: ["hi", "HI", "hindi", "Hindi"],
};

const FALLBACK_KEYS = [
  "en",
  "EN",
  "ar",
  "AR",
  "hi",
  "HI",
  "name",
  "displayName",
  "serviceName",
  "serviceTitle",
  "label",
  "title",
  "titles",
  "message",
  "messages",
  "body",
  "text",
  "description",
];

const OBJECT_TEXT_PATTERN = /\[?object[\s,]+Object\]?/gi;
const PLACEHOLDER_FALLBACK: Record<Language, string> = {
  EN: "Service",
  AR: "الخدمة",
  HI: "सेवा",
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const parseObjectString = (value: unknown): unknown => {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();

  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }

  return value;
};

export const resolveNotificationText = (
  value: unknown,
  language: Language
): string => {
  if (value == null) return "";

  if (typeof value === "string") {
    const parsedValue = parseObjectString(value);
    return parsedValue === value
      ? value
      : resolveNotificationText(parsedValue, language);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => resolveNotificationText(item, language))
      .filter(Boolean)
      .join(", ");
  }

  if (!isPlainObject(value)) return "";

  for (const key of LANGUAGE_KEYS[language]) {
    const localizedValue = resolveNotificationText(value[key], language);
    if (localizedValue) return localizedValue;
  }

  for (const key of FALLBACK_KEYS) {
    const fallbackValue = resolveNotificationText(value[key], language);
    if (fallbackValue) return fallbackValue;
  }

  for (const nestedValue of Object.values(value)) {
    const text = resolveNotificationText(nestedValue, language);
    if (text) return text;
  }

  return "";
};

export const getNotificationServiceName = (
  notification: Record<string, unknown>,
  language: Language
): string => {
  const booking = notification.booking as Record<string, unknown> | undefined;
  const bookingDetails = notification.bookingDetails as
    | Record<string, unknown>
    | undefined;

  const serviceSources = [
    notification.serviceName,
    notification.serviceTitle,
    notification.service_title,
    notification.service_name,
    notification.service,
    notification.serviceCategory,
    notification.service_category,
    notification.category,
    booking?.serviceName,
    booking?.serviceTitle,
    booking?.service_title,
    booking?.service_name,
    booking?.service,
    booking?.serviceCategory,
    booking?.service_category,
    booking?.category,
    bookingDetails?.serviceName,
    bookingDetails?.serviceTitle,
    bookingDetails?.service_title,
    bookingDetails?.service_name,
    bookingDetails?.service,
    bookingDetails?.serviceCategory,
    bookingDetails?.service_category,
    bookingDetails?.category,
  ];

  for (const source of serviceSources) {
    const name = resolveNotificationText(source, language);
    if (name) return name;
  }

  const nestedName = findNestedServiceName(notification, language);
  if (nestedName) return nestedName;

  return "";
};

const findNestedServiceName = (
  value: unknown,
  language: Language,
  visited = new WeakSet<object>()
): string => {
  const parsedValue = parseObjectString(value);

  if (!isPlainObject(parsedValue) && !Array.isArray(parsedValue)) {
    return "";
  }

  if (typeof parsedValue === "object" && parsedValue !== null) {
    if (visited.has(parsedValue)) return "";
    visited.add(parsedValue);
  }

  if (Array.isArray(parsedValue)) {
    for (const item of parsedValue) {
      const name = findNestedServiceName(item, language, visited);
      if (name) return name;
    }

    return "";
  }

  for (const [key, nestedValue] of Object.entries(parsedValue)) {
    const normalizedKey = key.toLowerCase();

    if (
      normalizedKey.includes("service") ||
      normalizedKey.includes("category")
    ) {
      const name = resolveNotificationText(nestedValue, language);
      if (name && !OBJECT_TEXT_PATTERN.test(name)) return name;
    }
  }

  for (const [key, nestedValue] of Object.entries(parsedValue)) {
    const normalizedKey = key.toLowerCase();

    if (["title", "message", "body", "text"].includes(normalizedKey)) {
      continue;
    }

    const name = findNestedServiceName(nestedValue, language, visited);
    if (name) return name;
  }

  return "";
};

export const formatNotificationText = (
  value: unknown,
  fallback: string,
  notification: Record<string, unknown>,
  language: Language
): string => {
  const text = resolveNotificationText(value, language) || fallback;
  const serviceName = getNotificationServiceName(notification, language);

  if (!text.match(OBJECT_TEXT_PATTERN)) {
    return text;
  }

  return text
    .replace(
      OBJECT_TEXT_PATTERN,
      serviceName || PLACEHOLDER_FALLBACK[language]
    )
    .trim();
};
