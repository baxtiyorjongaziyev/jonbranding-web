import { describe, expect, it } from 'vitest';
import {
  createInstagramOAuthState,
  isInstagramOAuthAdmin,
  isValidInstagramOAuthState,
} from './instagram-oauth';

describe('Instagram OAuth security helpers', () => {
  it('accepts an exact bearer admin secret', () => {
    const request = new Request('https://example.com/api/auth/instagram', {
      headers: { Authorization: 'Bearer strong-secret' },
    });
    expect(isInstagramOAuthAdmin(request, 'strong-secret')).toBe(true);
    expect(isInstagramOAuthAdmin(request, 'different-secret')).toBe(false);
  });

  it('accepts browser Basic auth password and rejects missing configuration', () => {
    const credentials = Buffer.from('admin:strong-secret').toString('base64');
    const request = new Request('https://example.com/api/auth/instagram', {
      headers: { Authorization: `Basic ${credentials}` },
    });
    expect(isInstagramOAuthAdmin(request, 'strong-secret')).toBe(true);
    expect(isInstagramOAuthAdmin(request, '')).toBe(false);
  });

  it('creates a non-guessable state and requires an exact callback match', () => {
    const state = createInstagramOAuthState();
    expect(state.length).toBeGreaterThanOrEqual(40);
    expect(isValidInstagramOAuthState(state, state)).toBe(true);
    expect(isValidInstagramOAuthState(`${state}x`, state)).toBe(false);
    expect(isValidInstagramOAuthState(null, state)).toBe(false);
  });
});
