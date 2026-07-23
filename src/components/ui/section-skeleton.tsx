import type { FC } from 'react';

interface SectionSkeletonProps {
  /** Minimum height in Tailwind class syntax, e.g. "min-h-[400px]" */
  minHeight?: string;
}

/**
 * Lightweight placeholder shown while a lazily-loaded section is hydrating.
 * Fixed min-height prevents CLS (Cumulative Layout Shift).
 */
const SectionSkeleton: FC<SectionSkeletonProps> = ({ minHeight = 'min-h-[400px]' }) => (
  <div
    aria-hidden="true"
    className={`w-full ${minHeight} animate-pulse bg-[#f0ede7]`}
  />
);

export default SectionSkeleton;
