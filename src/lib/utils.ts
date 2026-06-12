import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Performs a constant-time comparison of two strings to prevent timing attacks.
 * This is edge-compatible (unlike crypto.timingSafeEqual which requires Node's crypto).
 */
export function secureCompare(a: string | null | undefined, b: string | null | undefined): boolean {
  if (a === undefined || a === null || b === undefined || b === null) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
