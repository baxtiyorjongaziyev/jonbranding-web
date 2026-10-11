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
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('OishaWidget proactive message', () => {
  it('replays a chat request captured before mount and reopens after closing', async () => {
    const view = render(<OishaWidget lang="uz" chatRequest={1} />);
    expect(screen.getByRole('textbox', { name: 'Xabar yozing...' })).toBeTruthy();
    await act(async () => { screen.getByRole('button', { name: 'Oisha chatini yopish' }).click(); });
    view.rerender(<OishaWidget lang="uz" chatRequest={2} />);
    expect(screen.getByRole('textbox', { name: 'Xabar yozing...' })).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('opens safely when Android browser storage access is blocked', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Storage blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Quota exceeded'); });
    render(<OishaWidget lang="uz" />);
    await act(async () => { window.dispatchEvent(new Event('toggleOisha')); });
    expect(screen.getByRole('textbox', { name: 'Xabar yozing...' })).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });
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
