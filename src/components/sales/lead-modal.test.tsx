import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import LeadModal from './lead-modal';
import { getSalesContent } from '@/lib/sales-content';
import { getSalesFlow } from '@/lib/sales-flow';
import { TELEGRAM_CONTACT_URL } from '@/lib/contacts';

vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn(), trackLead: vi.fn(), trackContactClick: vi.fn(), generateEventId: () => 'test-event', getGaClientId: () => undefined }));
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
  // K-2: reklamadan kelgan mehmon boshqa sahifada yozsa ham manba amoCRM'ga borsin.
  it('sends the stored campaign source with the lead', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal('fetch', fetch);
    window.localStorage.setItem('jb_lead_attribution_v1', JSON.stringify({
      utmSource: 'google', utmCampaign: 'logo', referrer: 'https://www.google.com', landingPage: '/narxlar', capturedAt: Date.now(),
    }));
    render(<LeadModal open onClose={() => {}} presetService="Logotip" source="narxlar" />);
    fireEvent.change(screen.getByLabelText('Telefon *'), { target: { value: '+998901234567' } });
    fireEvent.click(screen.getByRole('button', { name: getSalesFlow('uz').submit }));
    await waitFor(() => expect(fetch).toHaveBeenCalledOnce());
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toMatchObject({
      utmSource: 'google', utmCampaign: 'logo', referrer: 'https://www.google.com', landingPage: '/narxlar', source: 'narxlar_modal',
    });
    window.localStorage.clear();
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
  // Xizmat tanlovi matnlari JSX'da qattiq yozilgan edi: ru/zh'da inglizcha izoh,
  // barcha tillarda o'zbekcha "Tanlangan:" chiqardi.
  it.each(['uz', 'ru', 'en', 'zh'] as const)('shows the service picker texts in %s', (lang) => {
    const modal = getSalesContent(lang).ui.modal;
    render(<LeadModal open onClose={() => {}} presetService="Brendbuk" lang={lang} />);
    expect(screen.getByText(modal.servicesLabel)).toBeInTheDocument();
    expect(screen.getByText(modal.multiSelectHint)).toBeInTheDocument();
    expect(screen.getByText(`${modal.selectedPrefix}: Brendbuk`)).toBeInTheDocument();
    if (lang !== 'uz') {
      expect(screen.queryByText(/Tanlangan|Bir nechtasini|Qaysi xizmatlar/)).toBeNull();
    }
    if (lang === 'ru' || lang === 'zh') {
      expect(screen.queryByText('Multiple options allowed')).toBeNull();
    }
  });
  // Yuborilgandan keyin mijozga darhol qadam: kanalga emas, yoziladigan akkauntga.
  it('offers an immediate Telegram next step after a successful submit', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) }));
    render(<LeadModal open onClose={() => {}} presetService="Naming" source="test" />);
    fireEvent.change(screen.getByLabelText('Telefon *'), { target: { value: '+998901234567' } });
    fireEvent.click(screen.getByRole('button', { name: getSalesFlow('uz').submit }));
    const telegram = await screen.findByRole('link', { name: getSalesFlow('uz').doneTelegram });
    expect(telegram).toHaveAttribute('href', TELEGRAM_CONTACT_URL);
    expect(screen.getByText(getSalesFlow('uz').done)).toBeInTheDocument();
  });
  it('allows selecting multiple services via checkboxes and sends combined services', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal('fetch', fetch);
    render(<LeadModal open onClose={() => {}} presetService="Naming" source="test" />);
    const patentCheckbox = screen.getByRole('checkbox', { name: /patent/i });
    fireEvent.click(patentCheckbox);
    expect(screen.getByLabelText('Xizmat')).toHaveValue('Naming, Patent');
    fireEvent.change(screen.getByLabelText('Telefon *'), { target: { value: '+998901234567' } });
    fireEvent.click(screen.getByRole('button', { name: getSalesFlow('uz').submit }));
    await waitFor(() => expect(fetch).toHaveBeenCalledOnce());
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.role).toBe('Naming, Patent');
  });
});
