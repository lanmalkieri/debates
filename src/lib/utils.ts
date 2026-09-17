import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merge Tailwind class lists the shadcn way. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
