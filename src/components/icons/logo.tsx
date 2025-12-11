import { cn } from '@/lib/utils';

export const Logo = ({ isWhite = false, className }: { isWhite?: boolean, className?: string }) => (
    <div className={cn("flex items-center gap-2 font-bold", isWhite ? "text-white" : "text-dark-blue", className)}>
        <svg height="32" viewBox="0 0 10 10" className="h-4 w-auto">
            <circle cx="5" cy="5" r="5" fill="hsl(var(--primary))" />
        </svg>
        <span className="text-2xl tracking-tighter">JON.</span>
    </div>
);
