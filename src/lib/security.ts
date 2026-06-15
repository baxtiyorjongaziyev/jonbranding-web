import { timingSafeEqual } from 'crypto';

/**
 * Performs a constant-time comparison of two strings to prevent timing attacks.
 */
export function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');

  if (bufA.length !== bufB.length) {
    // Perform dummy timingSafeEqual comparison on identical buffers to consume time
    // and prevent timing leaks of the secret's length.
    timingSafeEqual(bufA, bufA);
    return false;
  }

  return timingSafeEqual(bufA, bufB);
}

/**
 * Safely stringifies JSON data and escapes HTML characters to prevent XSS.
 * Intended for safely injecting JSON data into <script> tags.
 */
export function safeJsonStringify(obj: any): string {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/'/g, '\\u0027');
}
