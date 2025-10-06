
import { FC } from 'react';
import { cn } from '@/lib/utils';

export const CnFlagIcon: FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 30 20" 
    className={cn('w-5 h-auto', className)}
  >
    <rect width="30" height="20" fill="#de2910"/>
    <path d="M5 5.035l-1.545.812.22-1.81-1.427-1.127h1.74L5 1.25l.512 1.66h1.74l-1.427 1.127.22 1.81z" fill="#ffde00"/>
    <g transform="translate(10 2.5) rotate(23.036)" fill="#ffde00">
      <path id="a" d="M0-2.5l.772.406-.11.905-.714-.563h.87z"/>
      <use href="#a" transform="scale(-1 1)"/>
    </g>
    <g transform="translate(12.5 5) rotate(45.83)" fill="#ffde00">
      <use href="#a"/>
      <use href="#a" transform="scale(-1 1)"/>
    </g>
    <g transform="translate(12.5 7.5) rotate(69.945)" fill="#ffde00">
      <use href="#a"/>
      <use href="#a" transform="scale(-1 1)"/>
    </g>
    <g transform="translate(10 10) rotate(90)" fill="#ffde00">
      <use href="#a"/>
      <use href="#a" transform="scale(-1 1)"/>
    </g>
  </svg>
);
