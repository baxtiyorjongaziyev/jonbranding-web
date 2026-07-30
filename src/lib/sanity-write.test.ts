import { describe, expect, it } from 'vitest';
import {
  getSanityWriteDiagnostic,
  getSanityWriteToken,
  SANITY_WRITE_TOKEN_ENV,
} from './sanity-write';

describe('Sanity write configuration', () => {
  it('uses only the explicit server-side write token variable', () => {
    expect(
      getSanityWriteToken({
        SANITY_API_WRITE_TOKEN: '  editor-token  ',
        SANITY_TOKEN: 'ambiguous-legacy-token',
      }),
    ).toBe('editor-token');
    expect(getSanityWriteToken({ SANITY_TOKEN: 'legacy-token' })).toBeNull();
    expect(SANITY_WRITE_TOKEN_ENV).toBe('SANITY_API_WRITE_TOKEN');
  });

  it('returns a useful diagnostic for an invalid token', () => {
    expect(
      getSanityWriteDiagnostic({
        statusCode: 401,
        message: 'Unauthorized',
      }),
    ).toEqual(
      expect.objectContaining({
        code: 'SANITY_WRITE_UNAUTHORIZED',
        status: 503,
        hint: expect.stringContaining('SANITY_API_WRITE_TOKEN'),
      }),
    );
  });

  it('returns a useful diagnostic for a token without create permission', () => {
    expect(
      getSanityWriteDiagnostic({
        response: { statusCode: 403 },
        message: 'Insufficient permissions; permission "create" required',
      }),
    ).toEqual(
      expect.objectContaining({
        code: 'SANITY_WRITE_FORBIDDEN',
        status: 503,
        hint: expect.stringContaining('Editor'),
      }),
    );
  });

  it('does not relabel unrelated failures as token errors', () => {
    expect(
      getSanityWriteDiagnostic(new Error('Gemini API Error: 429')),
    ).toBeNull();
  });
});
