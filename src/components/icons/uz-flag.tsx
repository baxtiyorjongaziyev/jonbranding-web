
import { FC } from 'react';
import { cn } from '@/lib/utils';

export const UzFlagIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1000 500"
    className={cn('w-5 h-auto', className)}
  >
    <rect width="1000" height="500" fill="#1eb53a" />
    <rect width="1000" height="333.33" fill="#fff" />
    <rect width="1000" height="166.67" fill="#0099b5" />
    <rect y="166.67" width="1000" height="166.67" fill="#fff" />
    <rect y="183.33" width="1000" height="133.33" fill="#fff" />
    <path fill="#f4181c" d="M0 183.33h1000v22.22H0zM0 294.44h1000v22.22H0z" />
    <path
      d="M149.92 125a41.67 41.67 0 1 0 0-83.33 50 50 0 1 1 0 83.33z"
      fill="#fff"
    />
    <g fill="#fff" transform="translate(250 41.67) scale(1.3888)">
      <path id="star" d="M0-15l4.4 13.6h-11.5z" />
      <use href="#star" transform="rotate(30)" />
      <use href="#star" transform="rotate(60)" />
      <use href="#star" transform="rotate(90)" />
      <use href="#star" transform="rotate(120)" />
      <use href="#star" transform="rotate(150)" />
      <use href="#star" transform="rotate(180)" />
      <use href="#star" transform="rotate(210)" />
      <use href="#star" transform="rotate(240)" />
      <use href="#star" transform="rotate(270)" />
      <use href="#star" transform="rotate(300)" />
      <use href="#star" transform="rotate(330)" />
    </g>
    <g fill="#fff" transform="translate(300 83.33) scale(1.3888)">
      <use href="#star" />
      <use href="#star" transform="translate(30)" />
      <use href="#star" transform="translate(60)" />
      <use href="#star" transform="translate(90)" />
    </g>
    <g fill="#fff" transform="translate(250 125) scale(1.3888)">
      <use href="#star" />
      <use href="#star" transform="translate(30)" />
      <use href="#star" transform="translate(60)" />
      <use href="#star" transform="translate(90)" />
      <use href="#star" transform="translate(120)" />
    </g>
  </svg>
);
