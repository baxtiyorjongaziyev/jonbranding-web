
import { FC } from 'react';
import { cn } from '@/lib/utils';

export const GbFlagIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 30"
    className={cn('w-5 h-auto', className)}
  >
    <clipPath id="a">
      <path d="M0 0h60v30H0z" />
    </clipPath>
    <clipPath id="b">
      <path d="M30 15h30v15zv-15h-30z" />
    </clipPath>
    <g clipPath="url(#a)">
      <path d="M0 0v30h60V0z" fill="#00247d" />
      <path
        d="M0 0l60 30m0-30L0 30"
        stroke="#fff"
        strokeWidth="6"
      />
      <path
        d="M0 0l60 30m0-30L0 30"
        clipPath="url(#b)"
        stroke="#cf142b"
        strokeWidth="4"
      />
      <path
        d="M30 0v30M0 15h60"
        stroke="#fff"
        strokeWidth="10"
      />
      <path
        d="M30 0v30M0 15h60"
        stroke="#cf142b"
        strokeWidth="6"
      />
    </g>
  </svg>
);

    