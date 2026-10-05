import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AtModal from './at-modal';

vi.mock('@/lib/analytics', () => ({
  generateEventId: () => 'lead_test',
  getGaClientId: () => 'ga_test',
  trackEvent: vi.fn(),
  trackLead: vi.fn(),
}));

const dictionary = {
  sidebarTitle: 'Bepul Brand Audit',
  description: 'Tashxis tavsifi',
  steps: { step4: { subtitle: 'Aloqa ma’lumotlaringizni qoldiring' } },
  fields: {
    name: { label: 'Ismingiz', placeholder: 'Sardor' },
    phone: { label: 'Telefon raqamingiz', placeholder: '+998' },
    telegram: { label: 'Telegram (ixtiyoriy)', placeholder: '@username' },
  },
  atModal: {
    eyebrow: 'Bepul Brand Audit · 15 daqiqa',
    submitting: 'Yuborilmoqda',
  },
  buttons: {
    submit: 'Yuborish',
    close: 'Yopish',
    back: 'Orqaga',
    next: 'Keyingi qadam',
  },
  formErrors: {
    phone: 'To‘liq telefon raqamini kiriting',
    telegram: 'To‘g‘ri Telegram username kiriting',
  },
  errorToast: { description: 'Qayta urinib ko‘ring' },
  successStep: {
    title: 'So‘rov qabul qilindi',
    description: 'Tez orada bog‘lanamiz',
    telegramButton: 'Telegram kanal',
  },
  telegramLinkLabel: 'Telegram',
  trustBadge: 'Ma’lumotlaringiz maxfiy saqlanadi',
};

describe('AtModal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('submits a required normalized phone with optional Telegram in a single step', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, eventId: 'lead_test' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<AtModal open onClose={vi.fn()} lang="uz" dictionary={dictionary} />);

    fireEvent.change(screen.getByLabelText(/Ismingiz/), {
      target: { value: 'Sardor Karimov' },
    });
    fireEvent.change(screen.getByLabelText(/Telefon raqamingiz/), {
      target: { value: '90 123 45 67' },
    });
    fireEvent.change(screen.getByLabelText(/Telegram/), {
      target: { value: '@Sardor' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Yuborish/ }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const request = fetchMock.mock.calls[0][1];
    const payload = JSON.parse(String(request.body));

    expect(payload).toMatchObject({
      fullName: 'Sardor Karimov',
      phone: '+998901234567',
      telegram: 'Sardor',
      source: 'at_modal',
      lang: 'uz',
      role: 'Bepul Brand Audit',
      budget: 'Bepul',
    });
  });

  it('uses dialog semantics, closes on Escape, and restores trigger focus', async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Tashxisni ochish</button>
          <AtModal open={open} onClose={() => setOpen(false)} lang="uz" dictionary={dictionary} />
        </>
      );
    }

    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Tashxisni ochish' });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: 'Bepul Brand Audit' });
    expect(dialog).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText(/Telefon raqamingiz/)).toHaveFocus());

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('announces validation errors and keeps focus on the invalid phone field', async () => {
    render(<AtModal open onClose={vi.fn()} lang="uz" dictionary={dictionary} />);
    fireEvent.click(screen.getByRole('button', { name: /Yuborish/ }));

    expect(screen.getByRole('alert')).toHaveTextContent('To‘liq telefon raqamini kiriting');
    expect(screen.getByLabelText(/Telefon raqamingiz/)).toHaveFocus();
  });

  it('renders lead-form copy from the selected locale dictionary', () => {
    const englishDictionary = {
      ...dictionary,
      sidebarTitle: 'Free Brand Audit',
      description: 'Audit description',
      steps: { step4: { subtitle: 'Leave your contact details' } },
      fields: {
        ...dictionary.fields,
        name: { label: 'Your name', placeholder: 'John Doe' },
        phone: { label: 'Phone number', placeholder: '+998' },
        telegram: { label: 'Telegram (optional)', placeholder: '@username' },
      },
      atModal: {
        ...dictionary.atModal,
        eyebrow: 'Free Brand Audit · 15 minutes',
      },
      buttons: { ...dictionary.buttons, submit: 'Get Free Audit', close: 'Close' },
      trustBadge: 'Your data is kept private',
    };

    render(<AtModal open onClose={vi.fn()} lang="en" dictionary={englishDictionary} />);
    expect(screen.getByRole('dialog', { name: 'Free Brand Audit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get Free Audit/ })).toBeInTheDocument();
    expect(screen.queryByText('Yuborish')).not.toBeInTheDocument();
  });
});
