
'use client';

import type { FC } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, CheckCircle2, Target, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeroProps {
  lang: string;
  dictionary: any;
  onPrimaryClick: () => void;
  renderHeadline: (headline: string) => React.ReactNode;
}

const MockPrioritySelector = ({ dictionary }: { dictionary: any }) => (
    <div className="flex flex-col items-center text-center space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{dictionary.title}</h3>
        <div className="flex gap-2">
            {['Arzon', 'Sifatli', 'Tez'].map((opt) => (
                <div key={opt} className="px-4 py-2 bg-white shadow-sm border border-border/50 rounded-full text-xs font-bold">
                    {opt}
                </div>
            ))}
        </div>
        <p className="text-[10px] text-muted-foreground italic px-4 leading-tight">{dictionary.subtitle}</p>
    </div>
);

const DashboardHero: FC<DashboardHeroProps> = ({ lang, dictionary, onPrimaryClick, renderHeadline }) => {
    if (!dictionary) return null;

    return (
        <section className="relative w-full min-h-screen bg-white text-foreground overflow-hidden pt-[110px] pb-8 px-4 lg:px-6">
            <div className="max-w-[1600px] mx-auto h-[calc(100vh-140px)] flex flex-col gap-6">
                {/* Bento Grid Container */}
                <div className="grid grid-cols-12 grid-rows-6 gap-6 h-full">
                    
                    {/* 1. Main Hero Tile (7x4) */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="col-span-12 lg:col-span-7 row-span-4 bg-secondary/30 rounded-[2.5rem] p-10 lg:p-14 flex flex-col justify-center border border-border/50 relative overflow-hidden group hover:shadow-xl transition-all duration-500"
                    >
                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-wider text-primary">Branding Agency</span>
                            </div>
                            
                            <h1 className="text-3xl lg:text-4xl 2xl:text-5xl font-black leading-[1.2] tracking-tight text-foreground max-w-2xl">
                                {renderHeadline(dictionary.hero.title)}
                            </h1>
                            
                            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                                {dictionary.hero.subtitle}
                            </p>
                            
                            <div className="pt-4 flex flex-wrap gap-4 items-center">
                                <Button 
                                    size="lg" 
                                    onClick={onPrimaryClick}
                                    className="h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-white text-lg font-bold shadow-lg shadow-primary/25 group/btn"
                                >
                                    {dictionary.hero.primary_cta || dictionary.hero.cta}
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                                </Button>
                                
                                <div className="flex items-center space-x-3 text-sm text-muted-foreground/80">
                                    <div className="flex -space-x-2">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                                                <div className="h-full w-full bg-gradient-to-tr from-primary/20 to-primary/10" />
                                            </div>
                                        ))}
                                    </div>
                                    <span>{dictionary.hero.audit_label || dictionary.hero.buttonHint}</span>
                                </div>
                            </div>
                        </div>

                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
                    </motion.div>

                    {/* 2. Problems / Target Audience (5x3) */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="col-span-12 lg:col-span-5 row-span-3 bg-secondary/10 rounded-[2.5rem] p-8 border border-border/30 overflow-hidden flex flex-col relative"
                    >
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-bold">{dictionary.targetAudience.title}</h2>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                            {(dictionary.targetAudience.items || dictionary.targetAudience.problems).slice(0, 3).map((item: any, i: number) => (
                                <div key={i} className="flex items-start space-x-3 group animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="mt-1 h-5 w-5 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-snug">{item.description || item.text}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* 3. Why Us / Benefits (5x3) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="col-span-12 lg:col-span-5 row-span-3 bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10 overflow-hidden flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Target className="h-6 w-6" />
                                </div>
                                <h2 className="text-xl font-bold">{dictionary.whyUs.title}</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {(dictionary.whyUs.features || dictionary.whyUs.values).slice(0, 3).map((feature: any, i: number) => (
                                <div key={i} className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-white/50 transition-colors border border-transparent hover:border-primary/10">
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <span className="font-semibold text-sm">{feature.title}</span>
                                </div>
                            ))}
                        </div>
                        
                        <button onClick={onPrimaryClick} className="mt-auto flex items-center text-primary font-bold text-sm hover:underline group pt-4">
                            {dictionary.common?.learn_more || 'Batafsil'}
                            <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                    </motion.div>

                    {/* 4. Priority Selector (5x2) */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="col-span-12 lg:col-span-5 row-span-2 bg-secondary/20 rounded-[2.5rem] p-6 border border-border/50 flex flex-col justify-center"
                    >
                        <MockPrioritySelector dictionary={dictionary.pickTwoSelector} />
                    </motion.div>

                    {/* 5. Stats & Track Record (7x2) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="col-span-12 lg:col-span-7 row-span-2 bg-blue-950 text-white rounded-[2.5rem] p-10 border border-white/10 flex flex-col justify-between overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-0" />
                        
                        <div className="relative z-10 flex justify-between items-center h-full">
                            <div className="space-y-4">
                                <span className="text-[10px] uppercase tracking-widest text-blue-300 font-bold">{dictionary.results?.badge || 'Mijoz natijasi'}</span>
                                <div className="flex items-center gap-8">
                                    <div className="group">
                                        <div className="text-4xl font-black text-white group-hover:text-primary transition-colors">60%+</div>
                                        <div className="text-[10px] text-blue-200 uppercase opacity-60">Den Aroma - Check</div>
                                    </div>
                                    <div className="h-10 w-[1px] bg-white/10" />
                                    <div className="group">
                                        <div className="text-4xl font-black text-white group-hover:text-primary transition-colors">40%+</div>
                                        <div className="text-[10px] text-blue-200 uppercase opacity-60">Bexruz Market - Oqim</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-right space-y-4">
                                <span className="text-[10px] uppercase tracking-widest text-blue-300 font-bold">{dictionary.stats?.badge || 'Jon.Branding Stat'}</span>
                                <div className="flex gap-8 justify-end">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">1000+</div>
                                        <div className="text-[8px] text-blue-200 uppercase opacity-60">{dictionary.stats?.projects || 'Loyihalar'}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">9+</div>
                                        <div className="text-[8px] text-blue-200 uppercase opacity-60">{dictionary.stats?.experience || 'Tajriba'}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">90%</div>
                                        <div className="text-[8px] text-blue-200 uppercase opacity-60">{dictionary.stats?.recommend || 'Tavsiya'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Logo Marquee */}
                        <div className="absolute bottom-0 left-0 right-0 py-4 bg-white/5 border-t border-white/5 overflow-hidden">
                            <div className="flex space-x-12 animate-scroll-x whitespace-nowrap opacity-40">
                                {['ZAMIN', 'ESVIRO', 'BOYARIN', 'DEN AROMA', 'CHEVRON', 'MURAD BUILDINGS', 'AKFA', 'ARTEL'].map((brand) => (
                                    <span key={brand} className="text-xs font-black tracking-tighter">{brand}</span>
                                ))}
                                {['ZAMIN', 'ESVIRO', 'BOYARIN', 'DEN AROMA', 'CHEVRON', 'MURAD BUILDINGS', 'AKFA', 'ARTEL'].map((brand) => (
                                    <span key={brand + '-2'} className="text-xs font-black tracking-tighter">{brand}</span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default DashboardHero;
