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
        'brand-section relative isolate overflow-hidden',
        tone === 'light' && 'bg-brand-paper',
        tone === 'soft'  && 'bg-brand-mist',
        tone === 'dark'  && 'bg-brand-ink text-white',
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
        <div className="jb-eyebrow mb-5">
          {eyebrow}
        </div>
      )}
      <h2 className="text-balance font-headline font-extrabold leading-[1.08] tracking-[-0.025em] text-foreground">
        {title}
      </h2>
      {description && (
        <p className={cn(
          'mt-5 max-w-2xl text-pretty text-base leading-8 text-brand-slate sm:text-lg',
          align === 'center' && 'mx-auto',
        )}>
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
