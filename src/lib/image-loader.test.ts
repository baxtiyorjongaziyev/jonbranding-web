import { describe, expect, it } from 'vitest';
import cloudflareImageLoader from './image-loader';

describe('cloudflareImageLoader', () => {
  it('routes Sanity CDN images directly to Sanity CDN transformations', () => {
    const out = cloudflareImageLoader({
      src: 'https://cdn.sanity.io/images/h6ymmj0v/production/abc-1200x800.jpg',
      width: 640,
      quality: 80,
    });
    const url = new URL(out);
    expect(url.origin + url.pathname).toBe('https://cdn.sanity.io/images/h6ymmj0v/production/abc-1200x800.jpg');
    expect(url.searchParams.get('auto')).toBe('format');
    expect(url.searchParams.get('fit')).toBe('max');
    expect(url.searchParams.get('w')).toBe('640');
    expect(url.searchParams.get('q')).toBe('80');
  });

  it('preserves existing Sanity fit query params cleanly while updating width/quality', () => {
    const out = cloudflareImageLoader({
      src: 'https://cdn.sanity.io/images/h6ymmj0v/production/abc.png?w=800&fit=crop',
      width: 384,
    });
    const url = new URL(out);
    expect(url.searchParams.get('fit')).toBe('crop');
    expect(url.searchParams.get('w')).toBe('384');
    expect(url.searchParams.get('q')).toBe('75');
    expect(url.searchParams.get('auto')).toBe('format');
  });

  it('passes SVGs and data URIs directly without /_next/image proxying', () => {
    expect(cloudflareImageLoader({ src: '/logos/brand.svg', width: 256 })).toBe('/logos/brand.svg');
    expect(cloudflareImageLoader({ src: 'data:image/png;base64,AA', width: 64 })).toBe('data:image/png;base64,AA');
  });

  it('keeps local raster images routed through /_next/image', () => {
    expect(cloudflareImageLoader({ src: '/images/cms/og-image.jpeg', width: 1200, quality: 85 })).toBe(
      '/_next/image?url=%2Fimages%2Fcms%2Fog-image.jpeg&w=1200&q=85',
    );
  });
});
