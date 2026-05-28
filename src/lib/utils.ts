import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeStateCode(val: string | null | undefined): string | null {
  if (!val || /^\d+$/.test(val.trim())) return null
  return val
}
