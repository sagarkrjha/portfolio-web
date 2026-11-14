export { cn } from "cn";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Pure deterministic date formatter that avoids hydration mismatch across timezones and server/client
 * Expected input format: "YYYY-MM-DD"
 */
export function formatBlogDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.trim().split("-");
  if (parts.length === 3) {
    const year = parts[0];
    const monthIdx = Number.parseInt(parts[1], 10) - 1;
    const day = Number.parseInt(parts[2], 10);
    if (!Number.isNaN(monthIdx) && monthIdx >= 0 && monthIdx < 12 && !Number.isNaN(day)) {
      return `${MONTH_NAMES[monthIdx]} ${day}, ${year}`;
    }
  }
  return dateStr;
}
