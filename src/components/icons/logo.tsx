import { cn } from '@/lib/utils';

export const Logo = ({ isWhite = false, className }: { isWhite?: boolean, className?: string }) => (
    <div className={cn("flex items-center", className)} suppressHydrationWarning>
        <img 
            src={isWhite ? "/assets/logos/logo-white.svg" : "/assets/logos/logo-black.svg"}
            alt="Jon Branding Agency"
            width={180}
            height={40}
            className="h-10 w-auto object-contain"
        />
    </div>
);