import Image from 'next/image';
import { cn } from '@/lib/utils';

// Logotip gorizontal yozuv: viewBox 1069×172 (nisbat ~6.2:1).
// Balandlik kichik, chunki shu nisbatda har 1px balandlik ~6.2px enga aylanadi.
export const Logo = ({ isWhite = false, className }: { isWhite?: boolean, className?: string }) => (
    <div className={cn("flex items-center", className)} suppressHydrationWarning>
        <Image 
            src={isWhite ? "/assets/logos/logo-white.svg" : "/assets/logos/logo-black.svg"}
            alt="Jon Branding"
            width={149}
            height={24}
            priority
            className="h-6 w-auto object-contain sm:h-7"
        />
    </div>
);
