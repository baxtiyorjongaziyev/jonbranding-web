import { afterEach, describe, expect, it, vi } from 'vitest';
import { logger } from './logger';

afterEach(() => vi.restoreAllMocks());

describe('logger', () => {
  it('keeps the message and stack of an Error instead of logging {}', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('[x] failed', new Error('boom'));
    const line = String(spy.mock.calls[0][0]);
    expect(line).toContain('"message":"boom"');
    expect(line).toContain('"stack"');
  });

  it('survives circular data', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const data: Record<string, unknown> = {};
    data.self = data;
    expect(() => logger.warn('circular', data)).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });
});
