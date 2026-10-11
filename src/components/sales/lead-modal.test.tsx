import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import LeadModal from './lead-modal';
import { getSalesContent } from '@/lib/sales-content';
import { getSalesFlow } from '@/lib/sales-flow';

vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn(), trackLead: vi.fn(), generateEventId: () => 'test-event', getGaClientId: () => undefined }));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
describe('contextual lead form', () => {
  it('preserves the selected service and source in the server request', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal('fetch', fetch);
    const name = getSalesContent('uz').serviceGroups[0].items.find(item => item.id === 'logo')!.name;
    render(<LeadModal open onClose={() => {}} presetService={name} source="home_logo" />);
    expect(screen.getByLabelText('Xizmat')).toHaveValue(name);
    fireEvent.change(screen.getByLabelText('Telefon *'), { target: { value: '+998901234567' } });
    fireEvent.click(screen.getByRole('button', { name: getSalesFlow('uz').submit }));
    await waitFor(() => expect(fetch).toHaveBeenCalledOnce());
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body).toMatchObject({ role: name, source: 'home_logo_modal', phone: '+998901234567' });
    expect(fetch.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
  });
  it('distinguishes consultation intent and keeps retry available after failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network unavailable')));
    render(<LeadModal open onClose={() => {}} presetService={getSalesContent('uz').ui.notSure} intent="consultation" />);
    expect(screen.getByRole('dialog')).toHaveAccessibleName(getSalesFlow('uz').consultation);
    fireEvent.change(screen.getByLabelText('Telefon *'), { target: { value: '+998901234567' } });
    fireEvent.click(screen.getByRole('button', { name: getSalesFlow('uz').submit }));
    await screen.findByRole('alert');
    expect(screen.getByRole('button', { name: getSalesFlow('uz').submit })).toBeEnabled();
  });
});
