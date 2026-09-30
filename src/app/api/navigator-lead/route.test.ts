import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(async () => true),
  getClientIp: () => 'ip',
}));

const insert = vi.fn(async (_row: Record<string, unknown>) => ({ error: null as null | { message: string } }));
let serviceClient: { from: (table: string) => { insert: typeof insert } } | null = null;
const from = vi.fn(() => ({ insert }));

vi.mock('@/lib/supabase/service', () => ({
  getServiceClient: () => serviceClient,
}));

afterEach(() => {
  serviceClient = null;
  vi.clearAllMocks();
});

const valid = {
  fullName: 'Aziz Karimov',
  phone: '+998901234567',
  companyName: 'Aziz Savdo',
  consent: true,
  selectedPains: ['p1', 'p4'],
  desiredResult: 'r2',
  answers: { q1: 'ha', q2: 'qisman', q3: 'yoq' },
};

async function send(body: unknown) {
  const { POST } = await import('./route');
  return POST(
    new Request('http://localhost/api/navigator-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );
}

describe('POST /api/navigator-lead', () => {
  it('stores the diagnostic with a server-computed score', async () => {
    serviceClient = { from };
    const res = await send({ ...valid, totalScore: 999 });

    expect(res.status).toBe(200);
    expect(from).toHaveBeenCalledWith('navigator_leads');
    expect(insert.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        full_name: 'Aziz Karimov',
        contact: '+998901234567',
        selected_pains: ['p1', 'p4'],
        desired_results: ['r2'],
        total_score: 3,
      }),
    );
  });

  it('rejects unknown answers, missing consent and broken JSON', async () => {
    serviceClient = { from };
    expect((await send({ ...valid, answers: { q1: 'ha', hack: 'ha' } })).status).toBe(400);
    expect((await send({ ...valid, consent: false })).status).toBe(400);
    expect((await send({ ...valid, selectedPains: ['p1', 'p2', 'p3', 'p4'] })).status).toBe(400);
    expect((await send('{')).status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });

  it('answers 202 without crashing when the service key is not configured', async () => {
    const res = await send(valid);
    expect(res.status).toBe(202);
    expect((await res.json()).stored).toBe(false);
  });
});
