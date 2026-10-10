import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PwaInstaller from './pwa-installer';

vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));
vi.mock('next/image', () => ({ default: () => null }));

function device(userAgent: string, standalone = false) {
  Object.defineProperty(navigator, 'userAgent', { configurable: true, value: userAgent });
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches: standalone, addListener: vi.fn(), removeListener: vi.fn(),
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
  })));
}

function installEvent() {
  const event = new Event('beforeinstallprompt', { cancelable: true });
  act(() => { window.dispatchEvent(event); });
  return event;
}

describe('mobile PWA install offers', () => {
  beforeEach(() => { vi.useFakeTimers(); localStorage.clear(); });
  afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); });

  it('does not offer installation on desktop, including custom triggers', () => {
    device('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130');
    render(<PwaInstaller />);
    const event = installEvent();
    act(() => {
      window.dispatchEvent(new Event('openPwaInstallPrompt'));
      vi.advanceTimersByTime(6000);
    });
    expect(event.defaultPrevented).toBe(false);
    expect(screen.queryByText('Jon.Branding Ilovasi')).not.toBeInTheDocument();
  });

  it('offers installation on Android after the browser install event', () => {
    device('Mozilla/5.0 (Linux; Android 14) Chrome/130 Mobile');
    render(<PwaInstaller />);
    expect(installEvent().defaultPrevented).toBe(true);
    act(() => { vi.advanceTimersByTime(6000); });
    expect(screen.getByRole('button', { name: "O'rnatish" })).toBeInTheDocument();
  });

  it('offers the iPhone home-screen flow without a browser install event', () => {
    device('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)');
    render(<PwaInstaller />);
    act(() => { vi.advanceTimersByTime(6000); });
    expect(screen.getByRole('button', { name: "O'rnatish" })).toBeInTheDocument();
  });

  it('keeps the offer hidden in an installed mobile app', () => {
    device('Mozilla/5.0 (Linux; Android 14)', true);
    render(<PwaInstaller />);
    installEvent();
    act(() => { vi.advanceTimersByTime(6000); });
    expect(screen.queryByText('Jon.Branding Ilovasi')).not.toBeInTheDocument();
  });

  it('cancels a pending offer when the app is installed', () => {
    device('Mozilla/5.0 (Linux; Android 14)');
    render(<PwaInstaller />);
    installEvent();
    act(() => {
      window.dispatchEvent(new Event('appinstalled'));
      vi.advanceTimersByTime(6000);
    });
    expect(screen.queryByText('Jon.Branding Ilovasi')).not.toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(0);
  });
});
