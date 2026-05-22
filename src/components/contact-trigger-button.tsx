'use client';

import type { FC, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';

interface ContactTriggerButtonProps extends Pick<ButtonProps, 'size' | 'variant'> {
  section: string;
  ctaText: string;
  source?: string;
  className?: string;
  children?: ReactNode;
  showArrow?: boolean;
}

const ContactTriggerButton: FC<ContactTriggerButtonProps> = ({
  section,
  ctaText,
  source = 'homepage',
  className,
  children,
  showArrow = true,
  size = 'lg',
  variant,
}) => {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('openContactModal', {
      detail: {
        section,
        ctaText,
        source,
      },
    }));
  };

  return (
    <Button onClick={handleClick} size={size} variant={variant} className={className}>
      {children || ctaText}
      {showArrow && <ArrowRight className="ml-2 h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />}
    </Button>
  );
};

export default ContactTriggerButton;
