import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

describe('Submit Form Harness (Mock Mode)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      MOCK_AMOCRM: 'true',
      MOCK_TELEGRAM: 'true',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('successfully delivers lead in mock mode without external calls', async () => {
    const req = new Request('http://localhost:9002/api/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: 'Harness Test User',
        phone: '+998901234567',
        telegram: 'harness_user',
        source: 'harness_test',
        lang: 'uz',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.integrations.telegram).toBe(true);
    expect(body.integrations.amoCrm).toBe(true);
  });
});
