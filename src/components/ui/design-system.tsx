import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function BrandSection({
  className,
  children,
  tone = 'light',
  ...props
}: HTMLAttributes<HTMLElement> & { tone?: 'light' | 'soft' | 'dark' }) {
  return (
    <section
      className={cn(
        'brand-section relative overflow-hidden py-16 sm:py-20 lg:min-h-screen lg:flex lg:flex-col lg:justify-center',
        tone === 'light' && 'bg-brand-paper',
        tone === 'soft' && 'bg-brand-mist',
        tone === 'dark' && 'bg-brand-ink text-white',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div className={cn('max-w-3xl', align === 'center' ? 'mx-auto text-center' : 'text-left', className)}>
      {eyebrow && (
        <div className="mb-4 inline-flex rounded-full border border-brand-line bg-white/70 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-brand-blue shadow-sm">
          {eyebrow}
        </div>
      )}
      <h2 className="text-balance text-3xl font-black tracking-[-0.04em] text-brand-ink sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-8 text-brand-slate sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

export function BrandCard({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('brand-card', className)} {...props}>
      {children}
    </div>
  );
}

export function BrandBadge({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('brand-badge', className)} {...props}>
      {children}
    </span>
  );
}
