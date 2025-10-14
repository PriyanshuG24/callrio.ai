import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, differenceInMinutes } from "date-fns";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDate = (dateString?: string | Date | number) => {
  if (!dateString) return "No date";
  try {
    return format(new Date(dateString), "MMM d, yyyy HH:mm:ss");
  } catch {
    return "Invalid date";
  }
};

export const formatTime = (dateString?: string | Date | number) => {
  if (!dateString) return "No time";
  try {
    return format(new Date(dateString), "h:mm:ss");
  } catch {
    return "Invalid time";
  }
};

export const getMeetingDuration = (start?: string | Date, end?: string | Date) => {
  if (!start || !end) return "N/A";
  try {
    const startDate =formatTime(start)
    const endDate =formatTime(end)
    const [startHours, startMinutes, startSeconds] = startDate.split(":").map(Number);
    const [endHours, endMinutes, endSeconds] = endDate.split(":").map(Number);
    const duration = (endHours - startHours) * 60 + (endMinutes - startMinutes) + (endSeconds - startSeconds);
    return `${duration} min`;
  } catch {
    return "N/A";
  }
};
