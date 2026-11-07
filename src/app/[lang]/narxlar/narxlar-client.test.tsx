import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getSalesContent } from '@/lib/sales-content';
import type { Service } from '@/lib/sales-content';
import NarxlarClient from './narxlar-client';

const leadModal = vi.hoisted(() => vi.fn());

vi.mock('next/image', () => ({ default: () => null }));
vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));
vi.mock('@/components/sections/client-logos', () => ({ default: () => null }));
vi.mock('@/components/sales/lead-modal', () => ({
  default: (props: { open: boolean; presetService: string; intent?: string }) => {
    leadModal(props);
    return null;
  },
}));

const labels = { title: 'Mijozlar', pauseLabel: 'Pauza', resumeLabel: 'Davom' };
const renderPage = (lang = 'uz') =>
  render(<NarxlarClient lang={lang} cases={[]} quotes={[]} clientLogoLabels={labels} showcase={[]} />);

const servicesOf = (lang: string): Service[] => getSalesContent(lang).serviceGroups.flatMap((group) => group.items);

/** Topilmasa aniq xato beradi — `!` bilan jim o'tib ketmaydi. */
function el<T extends Element = HTMLElement>(root: ParentNode, selector: string): T {
  const found = root.querySelector<T>(selector);
  if (found === null) throw new Error(`Element topilmadi: ${selector}`);
  return found;
}

function serviceById(lang: string, id: string): Service {
  const service = servicesOf(lang).find((item) => item.id === id);
  if (service === undefined) throw new Error(`Xizmat topilmadi: ${id}`);
  return service;
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class { observe = vi.fn(); unobserve = vi.fn(); disconnect = vi.fn(); });
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
    const { difference } = getSalesContent('uz').ui;
    const { container } = renderPage();
    const packages = el(container, '#packages');
    const differenceHeading = screen.getByRole('heading', { level: 2, name: (name) => name.startsWith(difference.pre) });
    const firstService = el(container, 'details[id^="service-"]');
    expect(precedes(packages, differenceHeading)).toBe(true);
    expect(precedes(differenceHeading, firstService)).toBe(true);
  });

  it('lists every service as a collapsed row with its price visible', () => {
    const services = servicesOf('uz');
    const { container } = renderPage();
    const rows = Array.from(container.querySelectorAll<HTMLDetailsElement>('details[id^="service-"]'));
    expect(rows.map((row) => row.id)).toEqual(services.map((service) => `service-${service.id}`));
    expect(rows.filter((row) => row.open)).toHaveLength(0);
    for (const service of services) {
      const summary = el(el(container, `#service-${service.id}`), 'summary');
      expect(within(summary).getAllByText((text) => text.includes(service.price)).length).toBeGreaterThan(0);
    }
  });

  it.each(['uz', 'ru', 'en', 'zh'] as const)('gives each service its own call to action (%s)', (lang) => {
    const { container } = renderPage(lang);
    for (const service of servicesOf(lang)) {
      const row = el(container, `#service-${service.id}`);
      expect(within(row).getByRole('button', { name: service.cta, hidden: true })).toBeInTheDocument();
    }
    // Eski umumiy "Ariza qoldirish" sahifada qolmadi.
    expect(container.textContent).not.toContain('Ariza qoldirish');
    // JSX'da qattiq yozilgan o'zbekcha yorliqlar boshqa tillarga chiqmaydi.
    if (lang !== 'uz') {
      expect(container.textContent).not.toContain('Kimga');
      expect(container.textContent).not.toContain('Muddat:');
    }
  });

  it('opens the row a home-page price link points to', () => {
    window.history.replaceState(null, '', '/narxlar#service-logo');
    const { container } = renderPage();
    expect(el<HTMLDetailsElement>(container, '#service-logo').open).toBe(true);
    expect(el<HTMLDetailsElement>(container, '#service-naming').open).toBe(false);
  });

  it('opens a row when an in-page quick-choice link changes the hash', () => {
    const { container } = renderPage();
    window.history.replaceState(null, '', '/narxlar#service-packaging');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(el<HTMLDetailsElement>(container, '#service-packaging').open).toBe(true);
  });

  it('ignores a malformed hash instead of crashing', () => {
    window.history.replaceState(null, '', '/narxlar#%E0%A4%A');
    const { container } = renderPage();
    expect(container.querySelectorAll('details[open]')).toHaveLength(0);
  });

  it('opens the consultation form with the chosen service preselected', () => {
    const logo = serviceById('uz', 'logo');
    const { container } = renderPage();
    fireEvent.click(within(el(container, '#service-logo')).getByRole('button', { name: logo.cta, hidden: true }));
    expect(leadModal).toHaveBeenLastCalledWith(expect.objectContaining({ open: true, presetService: logo.name, intent: 'consultation' }));
  });
});
