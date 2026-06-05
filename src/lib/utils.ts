import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createHash } from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Compares two strings in constant time to prevent timing attacks.
 * Since Edge runtime does not fully support Node's `crypto.timingSafeEqual` reliably,
 * this is a manual constant-time comparison.
 */
export function timingSafeEqual(a: string | null | undefined, b: string | null | undefined): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  // Hash both inputs to a fixed-length string (SHA-256) so we never return early on length mismatch.
  const hashA = createHash('sha256').update(a).digest('hex');
  const hashB = createHash('sha256').update(b).digest('hex');

  let mismatch = 0;
  for (let i = 0; i < hashA.length; i++) {
    mismatch |= hashA.charCodeAt(i) ^ hashB.charCodeAt(i);
  }

  return mismatch === 0;
}
