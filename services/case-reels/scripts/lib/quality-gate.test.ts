import { describe, expect, it } from 'vitest';
import { checkCase, checkRendered, checkVideo, parseRate, type ProbeInfo } from './quality-gate';

const good: ProbeInfo = { width: 1080, height: 1920, fps: 30, durationSec: 12 };

describe('checkCase', () => {
  it('rejects fewer than 2 gallery images', () => {
    expect(checkCase({ gallery: ['a'] })).toEqual({ ok: false, reasons: ['gallery<2'] });
    expect(checkCase({ gallery: null }).ok).toBe(false);
    expect(checkCase({ gallery: ['a', null] }).ok).toBe(false);
  });
  it('accepts 2+ images', () => expect(checkCase({ gallery: ['a', 'b'] }).ok).toBe(true));
});

describe('checkVideo', () => {
  it('accepts spec video and inclusive bounds', () => {
    expect(checkVideo(good).ok).toBe(true);
    expect(checkVideo({ ...good, durationSec: 7 }).ok).toBe(true);
    expect(checkVideo({ ...good, durationSec: 20 }).ok).toBe(true);
  });
  it.each([
    [{ durationSec: 6.9 }, 'duration=6.9s'],
    [{ durationSec: 20.1 }, 'duration=20.1s'],
    [{ height: 1919 }, 'size=1080x1919'],
    [{ fps: parseRate('30000/1001') }, 'fps=29.97'],
  ])('rejects %o', (patch, reason) => {
    expect(checkVideo({ ...good, ...patch }).reasons).toEqual([reason]);
  });
  it('reports all failures together', () => {
    expect(checkVideo({ width: 720, height: 1280, fps: 25, durationSec: 30 }).reasons).toHaveLength(3);
  });
});

describe('checkRendered', () => {
  it('uses injected probe', async () => {
    expect(await checkRendered('x.mp4', async () => good)).toEqual({ ok: true, reasons: [] });
  });
  it('turns probe errors into a rejection', async () => {
    const r = await checkRendered('x.mp4', async () => { throw new Error('boom'); });
    expect(r.ok).toBe(false);
    expect(r.reasons[0]).toMatch(/probe-failed/);
  });
});
