'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Award, ExternalLink } from 'lucide-react';

interface ResultItem {
  title: string;
  impact: string;
  desc: string;
  label: string;
}

interface ResultsGridProps {
  dictionary: {
    title: string;
    subtitle: string;
    items: ResultItem[];
  };
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ dictionary }) => {
  if (!dictionary || !dictionary.items) return null;

  const icons = [<TrendingUp key="0" />, <Users key="1" />, <Award key="2" />];

  return (
    <section id="results" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            {dictionary.title}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto italic font-medium">
            {dictionary.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dictionary.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden bg-white/80 backdrop-blur-sm">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                  {icons[index % icons.length]}
                </div>
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="text-primary font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-primary/30"></span>
                    {item.label}
                    <span className="w-8 h-[2px] bg-primary/30"></span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{item.title}</h3>
                  <div className="text-5xl font-black text-primary mb-2 tabular-nums">
                    {item.impact}
                  </div>
                  <p className="text-slate-500 font-semibold text-lg">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
            <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Natijalar real loyihalar bo'yicha tahlillar asosida shakllangan
            </p>
        </div>
      </div>
    </section>
  );
};

export default ResultsGrid;
