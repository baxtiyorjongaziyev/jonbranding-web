/**
 * Safely serializes JSON for use inside `<script>` tags by escaping HTML-sensitive characters.
 * This prevents XSS vulnerabilities when using dangerouslySetInnerHTML.
 */
export function safeJsonStringify(data: any): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/'/g, '\\u0027');
}

/**
 * Performs a constant-time comparison of two strings to prevent timing attacks.
 * This custom implementation is used to ensure compatibility with edge environments
 * where Node's `crypto` module might not be fully supported.
 */
export function safeCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
