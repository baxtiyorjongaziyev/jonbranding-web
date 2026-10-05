import { FC, ReactNode } from 'react';
import { mono } from '../data';

export const Eyebrow: FC<{ children: ReactNode; light?: boolean }> = ({ children, light }) => (
  <p
    className={`mb-4 text-[11px] font-medium uppercase ${light ? 'text-blue-300' : 'text-blue-700'}`}
    style={mono}
  >
    {children}
  </p>
);

export const Section: FC<{
  id?: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}> = ({ id, children, className = '', labelledBy }) => (
  <section id={id} aria-labelledby={labelledBy} className={`px-5 sm:px-8 py-20 md:py-28 ${className}`}>
    <div className="mx-auto max-w-5xl">{children}</div>
  </section>
);

export const Tag: FC<{ children: ReactNode; tone?: 'blue' | 'neutral' | 'dark' }> = ({
  children,
  tone = 'blue',
}) => {
  const cls =
    tone === 'blue'
      ? 'bg-blue-50 text-blue-700 border-blue-100'
      : tone === 'dark'
      ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
      : 'bg-neutral-100 text-neutral-700 border-neutral-200';
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase ${cls}`}
      style={{ letterSpacing: '0.08em' }}
    >
      {children}
    </span>
  );
};

export const PrimaryBtn: FC<{
  onClick: () => void;
  children: ReactNode;
  dark?: boolean;
  className?: string;
}> = ({ onClick, children, dark, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 active:scale-[0.99] ${
      dark
        ? 'bg-white text-black hover:bg-neutral-200 focus-visible:ring-offset-black'
        : 'bg-black text-white hover:bg-neutral-800'
    } ${className}`}
  >
    {children}
  </button>
);

export const SecondaryBtn: FC<{
  onClick: () => void;
  children: ReactNode;
  dark?: boolean;
  className?: string;
}> = ({ onClick, children, dark, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border px-8 py-3.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 active:scale-[0.99] ${
      dark
        ? 'border-white/30 text-white hover:bg-white/10 focus-visible:ring-offset-black'
        : 'border-neutral-300 text-neutral-900 hover:bg-neutral-50'
    } ${className}`}
  >
    {children}
  </button>
);
