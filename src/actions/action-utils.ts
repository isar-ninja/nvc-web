"server only";
import { Timestamp } from "firebase-admin/firestore";
/**
 * Recursively converts Firebase Timestamps to JavaScript Date objects
 * @param obj Object that may contain Timestamp fields
 * @returns Object with all Timestamps converted to Dates
 */
export function convertTimestamps<T extends object>(obj: T): T {
  if (!obj) return obj;

  // Handle different types of input
  if (obj instanceof Timestamp) {
    return obj.toDate() as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) =>
      typeof item === "object" && item !== null
        ? convertTimestamps(item)
        : item,
    ) as unknown as T;
  }

  if (typeof obj === "object" && obj !== null) {
    const converted: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (value instanceof Timestamp) {
        converted[key] = value.toDate();
      } else if (typeof value === "object" && value !== null) {
        converted[key] = convertTimestamps(value);
      } else {
        converted[key] = value;
      }
    }

    return converted as T;
  }

  return obj;
}
