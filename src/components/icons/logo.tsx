
import { cn } from '@/lib/utils';

export const Logo = ({ isWhite = false, className }: { isWhite?: boolean, className?: string }) => (
    <div className={cn("flex items-center gap-2", className)}>
        <svg height="32" viewBox="0 0 10 10" className="h-8 w-auto">
            <circle cx="5" cy="5" r="5" fill="hsl(var(--primary))" />
        </svg>
        <div className="flex flex-col items-start">
            <span className={cn("text-xl font-bold tracking-tighter leading-none", isWhite ? "text-white" : "text-dark-blue")}>
                Jon.Branding
            </span>
            <span className={cn("text-xs font-medium tracking-widest uppercase w-full text-center", isWhite ? "text-white/80" : "text-muted-foreground")}>
                Agency
            </span>
        </div>
    </div>
);
