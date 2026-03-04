
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
        <div className={cn("relative flex w-full rounded-full bg-secondary p-1 border border-slate-200 overflow-hidden", className)}>
            {options.map((option) => (
                <div key={option.value} className="relative flex-1 h-full">
                    <div className="relative h-full w-full flex items-center justify-center">
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
                                "relative w-full h-full rounded-full px-2 flex items-center justify-center text-center text-sm font-bold transition-colors duration-300 z-10 outline-none",
                                selected === option.value ? "text-white" : "text-slate-500 hover:text-primary"
                            )}
                        >
                            <span className="relative z-20 truncate">{option.label}</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DynamicToggle;
