import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | number | string): string {
  if (!date) return "Unknown date";

  let d: Date;

  if (date instanceof Date) {
    d = date;
  } else if (typeof date === "number") {
    d = new Date(date * 1000);
  } else if (typeof date === "string") {
    d = new Date(date);
  } else {
    return "Invalid date";
  }

  if (isNaN(d.getTime())) {
    return "Invalid date";
  }

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
