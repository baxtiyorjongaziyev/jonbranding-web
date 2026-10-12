import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isAssetLoadError, recoverAssetLoadError } from './pwa-recovery';

describe('deployment asset recovery', () => {
  beforeEach(() => sessionStorage.clear());
  it.each([
    { name: 'ChunkLoadError', message: 'Loading chunk 19 failed.' },
    { message: 'Failed to load chunk /_next/static/chunks/old.js from module' },
    { message: 'Importing a module script failed.' },
    { message: 'Failed to fetch dynamically imported module: https://example.test/old.js' },
  ])('recognizes deployment chunk failures: $message', (error) => {
    expect(isAssetLoadError(error)).toBe(true);
  });
  it('reloads once and guards against a persistent chunk failure loop', () => {
    const reload = vi.fn();
    const error = { name: 'ChunkLoadError' };
    const options = { storage: sessionStorage, online: true, now: 100_000, reload };
    expect(recoverAssetLoadError(error, options)).toBe(true);
    expect(recoverAssetLoadError(error, { ...options, now: 100_010 })).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });
  it('does not hide render defects, offline errors or blocked storage', () => {
    const reload = vi.fn();
    const options = { storage: sessionStorage, online: true, now: 100_000, reload };
    expect(recoverAssetLoadError({ message: 'Cannot read properties of undefined' }, options)).toBe(false);
    expect(recoverAssetLoadError({ name: 'ChunkLoadError' }, { ...options, online: false })).toBe(false);
    const storage = { getItem: () => { throw new Error('Blocked'); } } as unknown as Storage;
    expect(recoverAssetLoadError({ name: 'ChunkLoadError' }, { ...options, storage })).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });
});
