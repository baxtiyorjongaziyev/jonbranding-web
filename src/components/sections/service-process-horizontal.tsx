'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import * as Icons from 'lucide-react';

interface ProcessStep {
  title: string;
  description: string;
  iconName: string;
}

interface ServiceProcessHorizontalProps {
  title: string;
  subtitle: string;
  steps: ProcessStep[];
}

const ServiceProcessHorizontal: React.FC<ServiceProcessHorizontalProps> = ({ title, subtitle, steps }) => {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-50%"]);

  return (
    <section className="relative bg-gray-50/50 overflow-visible py-10" suppressHydrationWarning>
      <div ref={targetRef} className="h-[250vh]">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="container mx-auto px-4 mb-16 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark-blue tracking-tighter">
              {title}
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-500 font-medium">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center w-full">
            <motion.div style={{ x }} className="flex px-[5vw] gap-8">
              {steps.map((step, index) => {
                const IconComponent = (Icons as any)[step.iconName] || Icons.Search;
                return (
                  <div key={index} className="w-[300px] md:w-[350px] lg:w-[400px] flex-shrink-0">
                    <Card className="text-center h-full shadow-lg rounded-3xl bg-white border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-8 md:p-10 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <div className="text-4xl font-black text-gray-200">
                                   0{index + 1}
                                </div>
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                                    <IconComponent className="h-8 w-8 text-primary" aria-hidden="true" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-dark-blue text-left mb-4">{step.title}</h3>
                            <p className="text-gray-600 text-left leading-relaxed">{step.description}</p>
                        </CardContent>
                    </Card>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceProcessHorizontal;
