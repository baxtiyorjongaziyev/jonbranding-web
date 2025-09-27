import { FC } from 'react';
import { cn } from '@/lib/utils';

export const RuFlagIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 9 6"
    className={cn('w-5 h-auto', className)}
  >
    <rect fill="#fff" width="9" height="3" />
    <rect fill="#d52b1e" y="3" width="9" height="3" />
    <rect fill="#0039a6" y="2" width="9" height="2" />
  </svg>
);
