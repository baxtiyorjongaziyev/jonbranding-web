import { cn } from '@/lib/utils';
import Image from 'next/image';

export const Logo = ({ isWhite = false, className }: { isWhite?: boolean, className?: string }) => (
    <div className={cn("flex items-center", className)} suppressHydrationWarning>
        <Image 
            src={isWhite ? "/logos/logo-white.svg" : "/logos/logo-black.svg"}
            alt="Jon Branding Agency"
            width={180}
            height={40}
            className="h-10 w-auto object-contain"
            priority
        />
    </div>
);