import { describe, expect, it } from 'vitest';
import { REEL_LANGS, REEL_STATUSES } from '@/lib/reels';
import { portfolio } from './portfolio';

type Field = { name: string; type: string; fields?: Field[]; options?: { list?: { value: string }[] } };

describe('portfolio.reel (Reels Zavodi F-04)', () => {
  const fields = (portfolio as unknown as { fields: Field[] }).fields;
  const reel = fields.find((f) => f.name === 'reel');

  it('ixtiyoriy object maydon sifatida mavjud', () => {
    expect(reel?.type).toBe('object');
  });

  it('holatlar PRD oqimiga mos: draft → approved → scheduled → published', () => {
    const status = reel?.fields?.find((f) => f.name === 'status');
    expect(status?.options?.list?.map((o) => o.value)).toEqual([...REEL_STATUSES]);
    expect(REEL_STATUSES).toEqual(expect.arrayContaining(['draft', 'approved', 'scheduled', 'published']));
  });

  it('har 4 til uchun video havolasi bor', () => {
    const videos = reel?.fields?.find((f) => f.name === 'videos');
    expect(videos?.fields?.map((f) => f.name)).toEqual([...REEL_LANGS]);
  });
});

describe('portfolio.reel.publishedAt', () => {
  it('reel ichida alohida — top-level publishedAt (portfolio tartibi) ga tegmaydi', () => {
    const fields = (portfolio as unknown as { fields: Field[] }).fields;
    const reel = fields.find((f) => f.name === 'reel');
    expect(reel?.fields?.some((f) => f.name === 'publishedAt' && f.type === 'datetime')).toBe(true);
  });
});
