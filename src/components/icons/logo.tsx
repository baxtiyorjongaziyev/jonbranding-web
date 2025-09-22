import Image from 'next/image';
import { cn } from '@/lib/utils';

export const Logo = ({ isWhite = false }) => (
    <Image
      src="https://img2.teletype.in/files/92/3c/923cd394-a437-47e1-86a1-51e1a2a3eb38.png"
      alt="Jon.Branding Logo"
      width={160}
      height={32}
      className={cn(isWhite ? 'filter brightness-0 invert' : '', 'transition-all duration-300')}
      priority
    />
);

    