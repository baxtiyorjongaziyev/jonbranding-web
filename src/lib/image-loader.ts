'use client';

import type { ImageLoaderProps } from 'next/image';

const SANITY_IMAGES_PREFIX = 'https://cdn.sanity.io/images/';

/**
 * Custom Next.js image loader for Cloudflare Workers Free:
 * Routes Sanity CDN images directly to Sanity's global image pipeline (`?w=&q=&auto=format`)
 * to avoid spending Cloudflare Images transformations and Worker invocations on Sanity assets,
 * while retaining `/_next/image` (with edge boundary checks) for local and other allowed hosts.
 */
export default function cloudflareImageLoader({ src, width, quality }: ImageLoaderProps): string {
  const safeQuality = quality ?? 75;

  if (!src || src.startsWith('data:') || src.startsWith('blob:') || /\.svg(?:$|\?)/i.test(src)) {
    return src;
  }

  if (src.startsWith(SANITY_IMAGES_PREFIX)) {
    try {
      const url = new URL(src);
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', url.searchParams.get('fit') || 'max');
      url.searchParams.set('w', String(width));
      url.searchParams.set('q', String(safeQuality));
      return url.toString();
    } catch {
      return src;
    }
  }

  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${safeQuality}`;
}
