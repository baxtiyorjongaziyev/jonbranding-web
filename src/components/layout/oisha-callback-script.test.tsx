import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import OishaPhoneSync from './oisha-callback-script';

vi.mock('next/navigation', () => ({ usePathname: () => '/', useSearchParams: () => null }));

describe('external callback overlay state', () => {
  it('observes a late-mounted shadow dialog and releases mobile actions when closed', async () => {
    const mounted = render(<OishaPhoneSync />);
    const host = document.createElement('div');
    host.dataset.oishaCallbackHost = '';
    const root = host.attachShadow({ mode: 'open' });
    const dialog = document.createElement('div');
    dialog.className = 'wrap';
    root.append(dialog);
    document.body.append(host);
    await waitFor(() => expect(document.body.dataset.callbackOpen).toBe('false'));
    dialog.classList.add('open');
    await waitFor(() => expect(document.body.dataset.callbackOpen).toBe('true'));
    dialog.classList.remove('open');
    await waitFor(() => expect(document.body.dataset.callbackOpen).toBe('false'));
    mounted.unmount();
    expect(document.body.dataset.callbackOpen).toBeUndefined();
    host.remove();
  });
});
