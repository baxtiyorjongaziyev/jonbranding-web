/** Apply at the outer boundary, including early rejections and cached/static responses. */
export function secureWebsiteResponse(request: Request, response: Response): Response {
  const url = new URL(request.url);
  const headers = new Headers(response.headers);
  for (const name of Array.from(headers.keys())) {
    if (name.startsWith('x-middleware-') || name.startsWith('x-nextjs-') || name === 'x-powered-by') headers.delete(name);
  }
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), browsing-topics=()');
  headers.set('X-XSS-Protection', '0');
  if (url.protocol === 'https:') headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  const csp = headers.get('content-security-policy');
  if (csp) {
    // Keep required Next bootstrap/analytics scripts; prohibit inline event handlers and base-tag hijacking.
    const directives = csp.split(';').map(value => value.trim()).filter(value => value && !/^(?:script-src-attr|base-uri)\s/i.test(value));
    headers.set('Content-Security-Policy', [...directives, "script-src-attr 'none'", "base-uri 'none'"].join('; '));
  } else if (url.pathname.startsWith('/api/') || response.status >= 400) {
    headers.set('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  }
  if (url.pathname.startsWith('/api/') || response.status >= 400) {
    headers.set('Cache-Control', 'private, no-store');
    headers.set('CDN-Cache-Control', 'no-store');
  }
  if (response.status === 429 && !headers.has('retry-after')) headers.set('Retry-After', '60');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
