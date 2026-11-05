import { afterEach, describe, expect, it, vi } from 'vitest';
import { bindCallbackAccessibility } from './callback-accessibility';

afterEach(() => { document.body.innerHTML = ''; vi.restoreAllMocks(); });

describe('callback accessibility bridge', () => {
  it('cycles both ways inside shadow DOM, isolates the background and restores focus/state', async () => {
    const trigger = document.createElement('button');
    const alreadyInert = document.createElement('section');
    alreadyInert.inert = true;
    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = '<button class="fab">Open</button><div class="wrap"><button class="x">Close</button><input><button class="send">Send</button></div>';
    document.body.append(trigger, alreadyInert, host);
    const wrap = root.querySelector<HTMLElement>('.wrap')!;
    const close = root.querySelector<HTMLButtonElement>('.x')!;
    const input = root.querySelector<HTMLInputElement>('input')!;
    const send = root.querySelector<HTMLButtonElement>('.send')!;
    for (const el of [close, input, send]) vi.spyOn(el, 'getClientRects').mockReturnValue([{}] as unknown as DOMRectList);
    close.onclick = () => wrap.classList.remove('open');
    const release = bindCallbackAccessibility(host);
    trigger.focus();
    wrap.classList.add('open');
    await Promise.resolve();
    expect(trigger.inert).toBe(true);
    expect(alreadyInert.inert).toBe(true);
    send.focus();
    send.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, composed: true, cancelable: true }));
    expect(root.activeElement).toBe(close);
    close.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, composed: true, cancelable: true }));
    expect(root.activeElement).toBe(send);
    send.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
    await Promise.resolve();
    expect(wrap.classList.contains('open')).toBe(false);
    expect(trigger.inert).not.toBe(true);
    expect(alreadyInert.inert).toBe(true);
    expect(document.activeElement).toBe(trigger);
    release();
  });

  it('restores background state if unmounted while open', () => {
    const background = document.createElement('main');
    const host = document.createElement('div');
    host.innerHTML = '<div class="wrap open"></div>';
    document.body.append(background, host);
    const release = bindCallbackAccessibility(host);
    expect(background.inert).toBe(true);
    release();
    expect(background.inert).not.toBe(true);
  });
});
