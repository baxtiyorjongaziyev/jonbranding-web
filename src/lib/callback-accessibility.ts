/** Accessibility bridge for the externally owned Oisha shadow dialog. */
export function bindCallbackAccessibility(host: HTMLElement) {
  const root = host.shadowRoot || host;
  const style = document.createElement('style');
  style.textContent = '.x{width:44px!important;height:44px!important;line-height:44px!important;top:6px!important;right:6px!important}h2{padding-right:32px}';
  root.append(style);
  let open = false;
  let trigger: HTMLElement | null = null;
  const inertBefore = new Map<HTMLElement, boolean>();
  const dialog = () => root.querySelector<HTMLElement>('.wrap.open');
  const focusable = () => Array.from(dialog()?.querySelectorAll<HTMLElement>(
    'button:not([disabled]), input:not([disabled]):not([type="hidden"]), a[href], [tabindex]'
  ) || []).filter((el) => el.tabIndex >= 0 && !el.hidden && !el.closest('[hidden], .hp') && el.getClientRects().length > 0);
  const release = () => {
    inertBefore.forEach((value, el) => { el.inert = value; });
    inertBefore.clear();
  };
  const sync = () => {
    const next = !!dialog();
    document.body.dataset.callbackOpen = String(next);
    if (next && !open) {
      trigger = document.activeElement instanceof HTMLElement && document.activeElement !== host ? document.activeElement : null;
    }
    if (next) {
      // Inert sibling branches at every level, preserving pre-existing inert state.
      let branch: HTMLElement = host;
      while (branch.parentElement) {
        for (const sibling of Array.from(branch.parentElement.children)) {
          if (sibling !== branch && sibling instanceof HTMLElement && !inertBefore.has(sibling)) {
            inertBefore.set(sibling, sibling.inert);
            sibling.inert = true;
          }
        }
        if (branch.parentElement === document.body) break;
        branch = branch.parentElement;
      }
      const fab = root.querySelector<HTMLElement>('.fab');
      if (fab && !inertBefore.has(fab)) { inertBefore.set(fab, fab.inert); fab.inert = true; }
    } else if (open) {
      release();
      if (trigger?.isConnected) trigger.focus();
    }
    open = next;
  };
  const keydown = (event: KeyboardEvent) => {
    if (!dialog()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      root.querySelector<HTMLButtonElement>('.x')?.click();
    }
    if (event.key !== 'Tab') return;
    const items = focusable();
    if (!items.length) return;
    const active = host.shadowRoot?.activeElement || document.activeElement;
    const index = items.indexOf(active as HTMLElement);
    event.preventDefault();
    const next = index < 0 ? (event.shiftKey ? items.length - 1 : 0) : (index + (event.shiftKey ? -1 : 1) + items.length) % items.length;
    items[next].focus();
  };
  const focusin = (event: FocusEvent) => {
    const current = dialog();
    if (current && !event.composedPath().includes(current)) focusable()[0]?.focus();
  };
  document.addEventListener('keydown', keydown, true);
  document.addEventListener('focusin', focusin, true);
  const observer = new MutationObserver(sync);
  observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  sync();
  return () => {
    observer.disconnect();
    document.removeEventListener('keydown', keydown, true);
    document.removeEventListener('focusin', focusin, true);
    release();
    style.remove();
  };
}
