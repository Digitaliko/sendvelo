import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "@/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (env.NEXT_PUBLIC_APP_URL) {
    return `${env.NEXT_PUBLIC_APP_URL}${path}`;
  }
  return `http://localhost:3000${path}`;
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string) {
  const now = new Date();
  const then = new Date(date);
  const diffInMs = now.getTime() - then.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes <= 1 ? "just now" : `${diffInMinutes} minutes ago`;
    }
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  }

  if (diffInDays === 1) return "yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }

  const months = Math.floor(diffInDays / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export function getEmailUsername(email: string): string {
  const atIndex = email.indexOf("@");
  if (atIndex === -1) return email;
  return email.substring(0, atIndex);
}

export function formatTimeSpent(ms: number | null | undefined): string {
  if (!ms || ms === 0) return "";
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export function formatTimeAgo(date: Date | string | null): string {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export type DeadlineUrgency = "normal" | "soon" | "urgent" | "overdue";

export function calculateDeadlineUrgency(deadline: Date | string | null): DeadlineUrgency {
  if (!deadline) return "normal";
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const hoursUntilDeadline = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilDeadline < 0) return "overdue";
  if (hoursUntilDeadline < 24) return "urgent";
  if (hoursUntilDeadline < 72) return "soon";
  return "normal";
}

export function formatDeadline(deadline: Date | string | null): string {
  if (!deadline) return "";
  const date = new Date(deadline);
  const now = new Date();
  const hoursUntilDeadline = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilDeadline < 0) {
    const hoursOverdue = Math.abs(hoursUntilDeadline);
    if (hoursOverdue < 24) return `${Math.floor(hoursOverdue)}h overdue`;
    return `${Math.floor(hoursOverdue / 24)}d overdue`;
  }

  if (hoursUntilDeadline < 24) {
    return `Due in ${Math.floor(hoursUntilDeadline)}h`;
  }

  const daysUntil = Math.floor(hoursUntilDeadline / 24);
  if (daysUntil === 1) return "Due tomorrow";
  if (daysUntil < 7) return `Due in ${daysUntil} days`;

  return `Due ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}
