'use client';

import { useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const KnobToggle = ({ isOn, onToggle }: { isOn: boolean; onToggle: (value: boolean) => void }) => {
  const x = useMotionValue(isOn ? 20 : 0);

  useEffect(() => {
    x.set(isOn ? 20 : 0);
  }, [isOn, x]);

  return (
    <motion.div
      className={cn(
        "w-12 h-8 flex items-center p-1 rounded-full cursor-pointer transition-colors",
        isOn ? "bg-accent justify-end" : "bg-white/10 justify-start"
      )}
      onClick={() => onToggle(!isOn)}
    >
      <motion.div
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center bg-white"
        )}
        drag="x"
        dragConstraints={{ left: 0, right: 20 }}
        style={{ x }}
        onDragEnd={() => onToggle(x.get() > 10)}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isOn && <Check className="w-4 h-4 text-accent" />}
      </motion.div>
    </motion.div>
  );
};

export default KnobToggle;
