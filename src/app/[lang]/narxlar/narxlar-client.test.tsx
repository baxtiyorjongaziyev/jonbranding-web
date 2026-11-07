import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getSalesContent } from '@/lib/sales-content';

const leadModal = vi.fn();

vi.mock('next/image', () => ({ default: () => null }));
vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));
vi.mock('@/components/sections/client-logos', () => ({ default: () => null }));
vi.mock('@/components/sales/lead-modal', () => ({
  default: (props: { open: boolean; presetService: string; intent?: string }) => {
    leadModal(props);
    return null;
  },
}));

const { default: NarxlarClient } = await import('./narxlar-client');

const labels = { title: 'Mijozlar', pauseLabel: 'Pauza', resumeLabel: 'Davom' };
const renderPage = (lang = 'uz') =>
  render(<NarxlarClient lang={lang} cases={[]} quotes={[]} clientLogoLabels={labels} showcase={[]} />);

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
});

afterEach(() => {
  cleanup();
  leadModal.mockClear();
  vi.unstubAllGlobals();
  window.history.replaceState(null, '', '/');
});

const precedes = (a: Element, b: Element) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

describe('/narxlar layout (conversion audit K-5)', () => {
  it('shows packages and the "why not a cheap designer" answer before the service list', () => {
    const ui = getSalesContent('uz').ui;
    const { container } = renderPage();
    const packages = container.querySelector('#packages');
    const difference = screen.getByRole('heading', { level: 2, name: new RegExp(ui.difference.pre) });
    const firstService = container.querySelector('details[id^="service-"]');
    expect(packages).not.toBeNull();
    expect(firstService).not.toBeNull();
    expect(precedes(packages!, difference)).toBe(true);
    expect(precedes(difference, firstService!)).toBe(true);
  });

  it('lists every service as a collapsed row with its price visible', () => {
    const content = getSalesContent('uz');
    const services = content.serviceGroups.flatMap((group) => group.items);
    const { container } = renderPage();
    const rows = container.querySelectorAll<HTMLDetailsElement>('details[id^="service-"]');
    expect(rows).toHaveLength(services.length);
    rows.forEach((row, i) => {
      expect(row.id).toBe(`service-${services[i].id}`);
      expect(row.open).toBe(false);
      expect(within(row.querySelector('summary')!).getAllByText(new RegExp(services[i].price)).length).toBeGreaterThan(0);
    });
  });

  it.each(['uz', 'ru', 'en', 'zh'] as const)('gives each service its own call to action (%s)', (lang) => {
    const content = getSalesContent(lang);
    const { container } = renderPage(lang);
    for (const service of content.serviceGroups.flatMap((group) => group.items)) {
      const row = container.querySelector(`#service-${service.id}`)!;
      expect(within(row as HTMLElement).getByRole('button', { name: service.cta, hidden: true })).toBeInTheDocument();
    }
    // Eski umumiy "Ariza qoldirish" sahifada qolmadi.
    expect(container.textContent).not.toContain('Ariza qoldirish');
    // JSX'da qattiq yozilgan o'zbekcha yorliqlar boshqa tillarga chiqmaydi.
    if (lang !== 'uz') {
      expect(container.textContent).not.toMatch(/Kimga|Muddat:/);
    }
  });

  it('opens the row a home-page price link points to', () => {
    window.history.replaceState(null, '', '/narxlar#service-logo');
    const { container } = renderPage();
    expect(container.querySelector<HTMLDetailsElement>('#service-logo')!.open).toBe(true);
    expect(container.querySelector<HTMLDetailsElement>('#service-naming')!.open).toBe(false);
  });

  it('opens a row when an in-page quick-choice link changes the hash', () => {
    const { container } = renderPage();
    window.history.replaceState(null, '', '/narxlar#service-packaging');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(container.querySelector<HTMLDetailsElement>('#service-packaging')!.open).toBe(true);
  });

  it('opens the consultation form with the chosen service preselected', () => {
    const logo = getSalesContent('uz').serviceGroups.flatMap((group) => group.items).find((s) => s.id === 'logo')!;
    const { container } = renderPage();
    fireEvent.click(within(container.querySelector('#service-logo') as HTMLElement).getByRole('button', { name: logo.cta, hidden: true }));
    expect(leadModal).toHaveBeenLastCalledWith(expect.objectContaining({ open: true, presetService: logo.name, intent: 'consultation' }));
  });
});
