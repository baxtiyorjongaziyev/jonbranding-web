import { FC } from 'react';
import { cn } from '@/lib/utils';

export const UzFlagIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 5 3"
    className={cn('w-5 h-auto', className)}
  >
    <rect width="5" height="3" fill="#1eb53a" />
    <rect width="5" height="2" fill="#fff" />
    <rect width="5" height="1" fill="#0099b5" />
    <rect y="1" width="5" height="1" fill="#fff" />
    <rect y="1.1" width="5" height="0.8" fill="#fff" />
    <rect y="1.2" width="5" height="0.6" fill="#f4181c" />
    <rect y="1.4" width="5" height="0.2" fill="#fff" />
    <path
      d="M1.2 0.5a.3.3 0 1 0 0 .3.3.3 0 0 1 0-.3m.1.03a.3.3 0 1 0 0 .2.3.3 0 0 1 0-.2m-.1.17a.3.3 0 1 0 0 .2.3.3 0 0 1 0-.2m-.1-.17a.3.3 0 1 0 0 .2.3.3 0 0 1 0-.2m.2.07a.3.3 0 1 0 0 .2.3.3 0 0 1 0-.2m.1-.07a.3.3 0 1 0 0 .2.3.3 0 0 1 0-.2m.1.07a.3.3 0 1 0 0 .2.3.3 0 0 1 0-.2m.1-.07a.3.3 0 1 0 0 .2.3.3 0 0 1 0-.2m-.5.2a.3.3 0 1 0 0 .2.3.3 0 0 1 0-.2m.1-.07a.3.3 0 1 0 0 .2.3.3 0 0 1 0-.2m.1.07a.3.3 0 1 0 0 .2.3.3 0 0 1 0-.2m.1-.07a.3.3 0 1 0 0 .2.3.3 0 0 1 0-.2"
      fill="#fff"
      transform="scale(.3) translate(-1.2 -.3)"
    />
  </svg>
);
