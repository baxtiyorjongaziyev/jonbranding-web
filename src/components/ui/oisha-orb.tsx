'use client';

import { FC, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export type OishaOrbState = 'idle' | 'thinking' | 'talking' | 'handoff';
export type OishaOrbSize = 'sm' | 'md' | 'lg' | 'xl';
export type OishaOrbColor = 'brand' | 'coral' | 'pink' | 'blue' | 'green' | 'yellow' | 'purple';

export interface OishaOrbProps {
  state?: OishaOrbState;
  size?: OishaOrbSize;
  color?: OishaOrbColor;
  label?: string;
  decorative?: boolean;
  className?: string;
}

const FX_ORB_STATE: Record<OishaOrbState, [number, number]> = {
  idle: [0.22, 0.5],
  thinking: [0.38, 1.6],
  talking: [0.85, 1.1],
  handoff: [1, 0.8],
};

const CURVES = [0, 1, 2].map((i) => ({
  f: 1.6 + i * 0.7,
  p: i * 2.1,
  a: 0.9 - i * 0.18,
  s: 0.9 + i * 0.35,
}));

export const OishaOrb: FC<OishaOrbProps> = ({
  state = 'idle',
  size = 'md',
  color = 'brand',
  label = 'Oisha',
  decorative = false,
  className,
}) => {
  const rootRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const probeRef = useRef<HTMLElement>(null);
  const stateRef = useRef<OishaOrbState>(state);
  stateRef.current = state;

  useEffect(() => {
    const root = rootRef.current;
    const cv = canvasRef.current;
    const probe = probeRef.current;
    if (!root || !cv || !probe || typeof window === 'undefined') return;

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = cv.getContext('2d');
    } catch {
      ctx = null;
    }
    if (!ctx) return;

    const readColors = () =>
      ['--_w1', '--_w2', '--_w3'].map((v) => {
        probe.style.color = `var(${v})`;
        return getComputedStyle(probe).color;
      });

    let col = readColors();
    let w = 0;
    let h = 0;
    let amp = 0.2;
    let speed = 0.5;
    let t = Math.random() * 100;
    let raf = 0;
    let seen = true;
    let last = 0;

    const still =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : ({ matches: false } as MediaQueryList);

    const updateSize = () => {
      const r = root.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.width = Math.max(1, Math.round((r.width || 36) * d));
      h = cv.height = Math.max(1, Math.round((r.height || 36) * d));
    };

    const draw = (dt: number) => {
      if (!col[0] || col[0] === 'rgba(0, 0, 0, 0)') {
        col = readColors();
      }
      const currentState = (root.dataset.state as OishaOrbState) || stateRef.current || 'idle';
      const [ta, ts] = FX_ORB_STATE[currentState] || FX_ORB_STATE.idle;
      amp += (ta - amp) * Math.min(1, dt * 4);
      speed += (ts - speed) * Math.min(1, dt * 3);
      t += dt * speed;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      const mid = h / 2;
      const n = 48;

      CURVES.forEach((c, i) => {
        const talk = currentState === 'talking' ? 0.65 + 0.35 * Math.abs(Math.sin(t * 7 + i)) : 1;
        const A = mid * 0.62 * amp * c.a * talk * (0.75 + 0.25 * Math.sin(t * c.s + c.p));
        ctx.beginPath();
        for (let k = 0; k <= n; k++) {
          const x = -2 + (4 * k) / n;
          const att = (4 / (4 + x ** 4)) ** 4;
          ctx.lineTo(((x + 2) / 4) * w, mid + A * att * Math.sin(c.f * x * 2.2 - t * 3 * c.s + c.p));
        }
        for (let k = n; k >= 0; k--) {
          const x = -2 + (4 * k) / n;
          const att = (4 / (4 + x ** 4)) ** 4;
          ctx.lineTo(
            ((x + 2) / 4) * w,
            mid - A * att * Math.sin(c.f * x * 2.2 - t * 3 * c.s + c.p) * 0.35
          );
        }
        ctx.closePath();
        const g = ctx.createLinearGradient(0, 0, w, 0);
        const ribbonColor = col[i] || col[0] || '#60A5FA';
        g.addColorStop(0, 'transparent');
        g.addColorStop(0.5, ribbonColor);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.globalAlpha = 0.75;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.lineWidth = Math.max(1, w / 90);
        ctx.strokeStyle = g;
        ctx.stroke();
      });

      ctx.globalCompositeOperation = 'source-over';
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      draw(dt);
      raf = seen && !document.hidden && !still.matches ? window.requestAnimationFrame(loop) : 0;
    };

    const go = () => {
      if (!raf && !still.matches) {
        last = 0;
        raf = window.requestAnimationFrame(loop);
      }
    };

    updateSize();
    draw(0);

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            updateSize();
            draw(0);
          })
        : null;
    resizeObserver?.observe(root);

    const intersectionObserver =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => {
            seen = entry.isIntersecting;
            if (seen) go();
          })
        : null;
    intersectionObserver?.observe(root);

    const onVisibilityChange = () => {
      if (!document.hidden) go();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const mutationObserver =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver(() => {
            col = readColors();
            if (!raf) draw(0);
            go();
          })
        : null;
    mutationObserver?.observe(root, {
      attributes: true,
      attributeFilter: ['data-state', 'data-color', 'style'],
    });

    if (!still.matches) {
      go();
    }

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      mutationObserver?.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <span
      ref={rootRef}
      className={cn('fx-orb', className)}
      data-fx-orb=""
      data-lines=""
      data-size={size}
      data-state={state}
      data-color={color === 'brand' ? undefined : color}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? 'true' : undefined}
    >
      <span className="fx-orb__wave" />
      <span className="fx-orb__wave" />
      <span className="fx-orb__wave" />
      <canvas ref={canvasRef} className="fx-orb__lines" aria-hidden="true" />
      <i ref={probeRef} hidden aria-hidden="true" />
    </span>
  );
};

export default OishaOrb;
