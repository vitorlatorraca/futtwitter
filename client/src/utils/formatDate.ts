import { formatDistanceToNowStrict, format, isToday, isYesterday, differenceInHours } from "date-fns";

export function formatTimestamp(date: Date): string {
  const hours = differenceInHours(new Date(), date);

  if (hours < 1) {
    const result = formatDistanceToNowStrict(date, { unit: "minute" });
    const mins = parseInt(result);
    if (mins < 1) return "now";
    return `${mins}m`;
  }

  if (hours < 24) {
    return `${hours}h`;
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  const currentYear = new Date().getFullYear();
  if (date.getFullYear() === currentYear) {
    return format(date, "MMM d");
  }

  return format(date, "MMM d, yyyy");
}

export function formatFullDate(date: Date): string {
  return format(date, "h:mm a · MMM d, yyyy");
}

export function formatMessageTime(date: Date): string {
  if (isToday(date)) {
    return format(date, "h:mm a");
  }
  if (isYesterday(date)) {
    return "Yesterday " + format(date, "h:mm a");
  }
  return format(date, "MMM d, h:mm a");
}
