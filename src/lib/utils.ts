import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, differenceInMinutes } from "date-fns";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDate = (dateString?: string | Date | number) => {
  if (!dateString) return "No date";
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch {
    return "Invalid date";
  }
};

export const formatTime = (dateString?: string | Date | number) => {
  if (!dateString) return "No time";
  try {
    return format(new Date(dateString), "h:mm a");
  } catch {
    return "Invalid time";
  }
};

export const getMeetingDuration = (start?: string | Date, end?: string | Date) => {
  if (!start || !end) return "N/A";
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${differenceInMinutes(endDate, startDate)} min`;
  } catch {
    return "N/A";
  }
};
