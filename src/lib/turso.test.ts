import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isTursoConfigured, getTursoClient, executeTurso } from './turso';

vi.mock('@libsql/client', () => {
  return {
    createClient: vi.fn(() => ({
      execute: vi.fn(async (stmt: unknown) => {
        return {
          columns: ['id'],
          rows: [{ id: 1 }],
          rowsAffected: 0,
          lastInsertRowid: undefined,
        };
      }),
      batch: vi.fn(async () => []),
    })),
  };
});

describe('turso client facade', () => {
  const originalUrl = process.env.TURSO_DATABASE_URL;
  const originalToken = process.env.TURSO_AUTH_TOKEN;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('detects when turso is not configured', () => {
    delete process.env.TURSO_DATABASE_URL;
    delete process.env.TURSO_AUTH_TOKEN;
    expect(isTursoConfigured()).toBe(false);
  });

  it('detects when turso is configured', () => {
    process.env.TURSO_DATABASE_URL = 'libsql://example.turso.io';
    process.env.TURSO_AUTH_TOKEN = 'mock-token';
    expect(isTursoConfigured()).toBe(true);
  });

  it('executes a statement through the client', async () => {
    process.env.TURSO_DATABASE_URL = 'https://example.turso.io';
    process.env.TURSO_AUTH_TOKEN = 'mock-token';

    const result = await executeTurso('SELECT 1');
    expect(result).not.toBeNull();
    expect(result?.rows.length).toBe(1);

    // Restore
    if (originalUrl) process.env.TURSO_DATABASE_URL = originalUrl;
    else delete process.env.TURSO_DATABASE_URL;
    if (originalToken) process.env.TURSO_AUTH_TOKEN = originalToken;
    else delete process.env.TURSO_AUTH_TOKEN;
  });
});
