import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Constant-time string comparison utility for secure token/secret evaluation in Edge environments.
 * Avoids built-in Node.js crypto which is often incompatible with Vercel/Cloudflare Edge.
 * Prevents timing attacks by comparing all characters even after a mismatch is found.
 */
export function secureCompare(a: string | null | undefined, b: string | null | undefined): boolean {
    if (typeof a !== 'string' || typeof b !== 'string') return false;

    if (a.length !== b.length) return false;

    let mismatch = 0;

    for (let i = 0; i < a.length; i++) {
        mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return mismatch === 0;
}
