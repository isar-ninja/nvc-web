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

/**
 * Validates if a string is a properly formatted email address.
 *
 * This function checks for:
 * - Proper format (local-part@domain)
 * - Valid characters in local part and domain
 * - Proper domain structure with TLD
 * - Appropriate length
 *
 * @param email The email address to validate
 * @returns `true` if the email is valid, `false` otherwise
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;

  // Check if email is too long (RFC 5321 limits)
  if (email.length > 254) return false;

  // Regular expression for email validation
  // This regex handles most common email validation requirements:
  // - Local part (before @) can contain letters, numbers, and some special characters
  // - Domain part must be properly formatted with at least one dot
  // - TLD must be at least 2 characters
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailRegex.test(email)) return false;

  // Check local part length (before @)
  const localPart = email.split("@")[0];
  if (localPart.length > 64) return false;

  // Additional check for consecutive dots which are not allowed
  if (email.includes("..")) return false;

  return true;
}
