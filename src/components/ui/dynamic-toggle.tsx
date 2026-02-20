
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type FC } from 'react';

interface DynamicToggleProps {
    id: string;
    options: { value: string, label: string }[];
    selected: string;
    onSelect: (value: string) => void;
    className?: string;
}

const DynamicToggle: FC<DynamicToggleProps> = ({
    id,
    options,
    selected,
    onSelect,
    className
}) => {
    return (
        <div className={cn("relative flex w-full rounded-full bg-secondary p-1 border border-slate-200", className)}>
            {options.map((option) => (
                <div key={option.value} className="relative flex-1">
                    {selected === option.value && (
                        <motion.div
                            layoutId={`dynamic-toggle-bg-${id}`}
                            className="absolute inset-0 rounded-full bg-primary shadow-lg"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                    )}
                    <button
                        onClick={() => onSelect(option.value)}
                        className={cn(
                            "relative w-full rounded-full py-2.5 px-2 text-center text-sm font-bold transition-colors duration-300 z-10",
                            selected === option.value ? "text-white" : "text-slate-500 hover:text-primary"
                        )}
                    >
                        {option.label}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default DynamicToggle;
