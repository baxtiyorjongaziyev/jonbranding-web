
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type FC } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type DiscountOption = 'none' | 'package' | 'full';

interface DiscountSelectorProps {
    selectedOption: DiscountOption;
    onSelectOption: (option: DiscountOption) => void;
    availableOptions: DiscountOption[];
    dictionary: any;
}

const DiscountSelector: FC<DiscountSelectorProps> = ({
    selectedOption,
    onSelectOption,
    availableOptions,
    dictionary
}) => {
    const allOptions: { id: DiscountOption, label: string, description: string }[] = [
        { id: 'none', label: dictionary.none, description: dictionary.none_desc },
        { id: 'package', label: dictionary.package, description: dictionary.package_desc },
        { id: 'full', label: dictionary.full, description: dictionary.full_desc },
    ];

    const optionsToShow = allOptions.filter(opt => availableOptions.includes(opt.id));

    return (
        <TooltipProvider delayDuration={100}>
            <div className="relative flex w-full rounded-full bg-black/20 p-1">
                {optionsToShow.map((option) => (
                    <Tooltip key={option.id}>
                        <TooltipTrigger asChild>
                            <div className="relative flex-1">
                                {selectedOption === option.id && (
                                    <motion.div
                                        layoutId="discount-selector-bg"
                                        className="absolute inset-0 rounded-full bg-accent shadow-md"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <button
                                    onClick={() => onSelectOption(option.id)}
                                    className={cn(
                                        "relative w-full rounded-full py-2 px-2 text-center text-xs font-semibold transition-colors duration-300",
                                        selectedOption === option.id ? "text-white" : "text-gray-300 hover:text-white"
                                    )}
                                >
                                    {option.label}
                                </button>
                            </div>
                        </TooltipTrigger>
                         <TooltipContent className="max-w-xs">
                            <p>{option.description}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    );
};

export default DiscountSelector;
