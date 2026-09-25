import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import OishaWidget from './oisha-widget';

vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));

const fetchMock = vi.fn(async () => new Response(JSON.stringify({ history: [] }), { status: 200 }));

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('OishaWidget proactive message', () => {
  it('shows the greeting as Oisha and never posts it to the backend on the visitor behalf', async () => {
    render(<OishaWidget lang="uz" />);
    const greeting = "Assalomu alaykum! Xizmatlarimizni o'rganyapsiz.";

    await act(async () => {
      window.dispatchEvent(new CustomEvent('oishaProactive', { detail: { message: greeting } }));
    });

    expect(await screen.findByText(greeting)).toBeTruthy();
    const posts = fetchMock.mock.calls.filter(
      (call) => (call as unknown as [string, RequestInit?])[1]?.method === 'POST',
    );
    expect(posts).toHaveLength(0);
  });
});
