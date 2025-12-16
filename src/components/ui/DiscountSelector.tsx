
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type FC } from 'react';

type DiscountOption = 'none' | 'package' | 'full';

interface DiscountSelectorProps {
    selectedOption: DiscountOption;
    onSelectOption: (option: DiscountOption) => void;
    canApplyPackageDiscount: boolean;
    dictionary: any;
}

const DiscountSelector: FC<DiscountSelectorProps> = ({
    selectedOption,
    onSelectOption,
    canApplyPackageDiscount,
    dictionary
}) => {
    const options: { id: DiscountOption, label: string }[] = [
        { id: 'none', label: dictionary.none },
        { id: 'package', label: dictionary.package },
        { id: 'full', label: dictionary.full },
    ];

    return (
        <div className="relative flex w-full rounded-full bg-black/20 p-1">
            {options.map((option) => {
                const isDisabled = (option.id === 'package' || option.id === 'full') && !canApplyPackageDiscount;
                return (
                    <div key={option.id} className="relative flex-1">
                        {selectedOption === option.id && (
                            <motion.div
                                layoutId="discount-selector-bg"
                                className="absolute inset-0 rounded-full bg-accent shadow-md"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <button
                            onClick={() => !isDisabled && onSelectOption(option.id)}
                            disabled={isDisabled}
                            className={cn(
                                "relative w-full rounded-full py-2 px-2 text-center text-xs font-semibold transition-colors duration-300",
                                selectedOption === option.id ? "text-white" : "text-gray-300 hover:text-white",
                                isDisabled && "text-gray-500 cursor-not-allowed"
                            )}
                        >
                            {option.label}
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default DiscountSelector;
