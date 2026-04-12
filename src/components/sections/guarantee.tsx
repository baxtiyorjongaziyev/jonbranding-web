'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Scale, Clock, FileKey, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GuaranteeItem {
    title: string;
    description: string;
}

interface GuaranteeProps {
    dictionary: {
        title: string;
        subtitle: string;
        items: GuaranteeItem[];
        badge: string;
    };
}

const icons = [ShieldCheck, Scale, Clock, FileKey];

const Guarantee: FC<GuaranteeProps> = ({ dictionary }) => {
    if (!dictionary) return null;

    return (
        <section className="py-20 sm:py-32 bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Badge className="mb-4 px-4 py-1 text-sm font-bold bg-primary/10 text-primary border-primary/20 rounded-full">
                                {dictionary.badge}
                            </Badge>
                            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-6">
                                {dictionary.title}
                            </h2>
                            <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto">
                                {dictionary.subtitle}
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {dictionary.items.map((item, index) => {
                            const Icon = icons[index % icons.length];
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="h-full p-8 border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white group rounded-[2.5rem]">
                                        <div className="flex gap-6 items-start">
                                            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                                                <Icon className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                                                    {item.title}
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed font-medium">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Guarantee;
