import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export const TRIAL_DAYS = 3;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}