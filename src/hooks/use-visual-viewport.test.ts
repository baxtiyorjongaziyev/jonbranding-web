import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useVisualViewport } from './use-visual-viewport';

afterEach(() => vi.unstubAllGlobals());
describe('keyboard viewport positioning', () => {
  it('keeps the composer above a keyboard with visual-only resizing and panning', () => {
    const visible = Object.assign(new EventTarget(), { height: 800, offsetTop: 0 });
    vi.stubGlobal('visualViewport', visible);
    vi.stubGlobal('innerHeight', 800);
    const { result, unmount } = renderHook(() => useVisualViewport(true));
    expect(result.current).toEqual({ height: 800, bottom: 0 });
    act(() => {
      visible.height = 420;
      visible.offsetTop = 20;
      visible.dispatchEvent(new Event('resize'));
    });
    expect(result.current).toEqual({ height: 420, bottom: 360 });
    act(() => {
      vi.stubGlobal('innerHeight', 420);
      visible.offsetTop = 0;
      visible.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toEqual({ height: 420, bottom: 0 });
    unmount();
  });
  it('does not subscribe while the chat is closed and removes listeners on close', () => {
    const visible = Object.assign(new EventTarget(), { height: 800, offsetTop: 0 });
    vi.stubGlobal('visualViewport', visible);
    vi.stubGlobal('innerHeight', 800);
    const add = vi.spyOn(visible, 'addEventListener');
    const remove = vi.spyOn(visible, 'removeEventListener');
    const { result, rerender } = renderHook(({ open }) => useVisualViewport(open), { initialProps: { open: false } });
    expect(add).not.toHaveBeenCalled();
    rerender({ open: true });
    expect(add).toHaveBeenCalledTimes(2);
    rerender({ open: false });
    expect(remove).toHaveBeenCalledTimes(2);
    expect(result.current).toBeNull();
  });
  it('falls back to CSS viewport units on older browsers', () => {
    vi.stubGlobal('visualViewport', undefined);
    const { result } = renderHook(() => useVisualViewport(true));
    expect(result.current).toBeNull();
  });
});
