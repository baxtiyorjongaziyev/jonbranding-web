import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import * as crypto from 'crypto';

/**
 * Compares two strings in constant time to prevent timing attacks.
 * Uses SHA-256 to hash strings to a fixed length before comparison to avoid leaking length.
 * @param a The first string
 * @param b The second string
 * @returns True if the strings are equal, false otherwise
 */
export function secureCompare(a: string | null | undefined, b: string | null | undefined): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();

  return crypto.timingSafeEqual(hashA, hashB);
}
