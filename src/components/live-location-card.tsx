
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LiveLocationCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

const LiveLocationCard: React.FC<LiveLocationCardProps> = ({
  icon: Icon,
  title,
  description,
  isSelected,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'cursor-pointer transition-all duration-300 p-4 border-2',
        isSelected
          ? 'border-primary bg-primary/5 shadow-lg'
          : 'border-transparent bg-secondary hover:bg-secondary/70'
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'relative h-12 w-12 flex-shrink-0 rounded-full flex items-center justify-center transition-colors',
            isSelected ? 'bg-primary' : 'bg-gray-300'
          )}
        >
          <Icon
            className={cn(
              'h-6 w-6 transition-colors',
              isSelected ? 'text-primary-foreground' : 'text-gray-600'
            )}
          />
          {isSelected && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{
                  scale: [1, 1.8],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-primary"
                animate={{
                  scale: [1, 1.4],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.3,
                  ease: 'easeInOut',
                }}
              />
            </>
          )}
        </div>
        <div className="flex-grow">
          <p className="font-bold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default LiveLocationCard;
