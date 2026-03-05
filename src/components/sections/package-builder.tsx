
'use client';

import React, { useState, useEffect, FC, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getServiceDetails, calculatePackagePrice, type SelectedServices, formatPrice } from '@/lib/pricing';
import { Sparkles, CheckCircle, Crown, Check, ChevronsDown, Clock, BrainCircuit, Search, Megaphone, Palette, Box, Type, Layers, ClipboardSignature, Info, Flame, ShieldCheck, Zap, Gift, Plus } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import DynamicToggle from '@/components/ui/dynamic-toggle';
import { motion, AnimatePresence } from 'framer-motion';

interface PackageBuilderProps {
    onOrderNow: () => void;
    lang: string;
    dictionary: any;
}

const serviceIcons: { [key: string]: React.ElementType } = {
    audit: Search, namingCheck: ClipboardSignature, consultation: Info, strategy: BrainCircuit,
    commStrategy: Megaphone, smm: Palette, packaging: Box,
    namingVIP: Crown, namingPremium: Sparkles, namingStandard: Type,
    logoVIP: Crown, logoPremium: Palette, logoStandard: Layers,
    urgency: Flame, nda: ShieldCheck
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
};

const ServiceCard = React.memo(({ id, onSelect, selected, lang, dictionary, currency }: { id: string, onSelect: () => void, selected: boolean, lang: any, dictionary: any, currency: any }) => {
    const [activeTab, setActiveTab] = useState<'included' | 'benefits'>('included');
    const serviceDetails = useMemo(() => getServiceDetails(lang) as any, [lang]);
    const detail = serviceDetails[id];
    if (!detail) return null;

    const { label, price, subDescription, features, benefits, timeline, recommended } = detail;
    const Icon = serviceIcons[id] || Sparkles;
    const isVip = id.toLowerCase().includes('vip');
    const isSurcharge = id === 'urgency' || id === 'nda';

    return (
        <div className="h-full relative pt-12 px-1">
            <div className="absolute top-[38px] left-1/2 -translate-x-1/2 z-30 pointer-events-none w-full flex justify-center">
                {recommended && !isVip && (
                    <Badge className="bg-primary text-white text-[13px] font-black px-8 py-2 rounded-full border-none uppercase tracking-widest shadow-[0_4px_25px_rgba(37,99,235,0.5)] animate-breathing whitespace-nowrap">
                        {dictionary.recommended}
                    </Badge>
                )}
                {isVip && (
                    <Badge className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-blue-950 text-[13px] font-black px-10 py-2.5 rounded-full border-none uppercase flex items-center gap-2 shadow-[0_4px_30px_rgba(251,191,36,0.7)] animate-subtle-pulse whitespace-nowrap">
                        <Crown className="w-4 h-4 fill-current" /> VIP
                    </Badge>
                )}
            </div>

            <Card
                onClick={onSelect}
                className={cn(
                    "group relative h-full transition-all duration-500 cursor-pointer border flex flex-col rounded-[1.5rem] bg-white",
                    selected
                        ? (isVip ? 'border-amber-400 bg-blue-950 shadow-[0_0_60px_rgba(251,191,36,0.35)] scale-[1.03]' : 'border-primary shadow-[0_0_40px_rgba(37,99,235,0.15)] scale-[1.03]')
                        : (isVip ? "bg-blue-950 border-blue-900/50 hover:border-amber-400/50" : "border-slate-100 hover:border-primary/20 shadow-sm")
                )}
            >
                <CardHeader className="p-5 pb-3 relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0",
                            selected 
                                ? (isVip ? "bg-gradient-to-br from-amber-300 to-amber-500 text-blue-950 shadow-xl" : "bg-primary text-white shadow-lg") 
                                : (isVip ? "bg-white/10 text-amber-400 border border-amber-400/20" : "bg-secondary text-slate-600")
                        )}>
                            <Icon className="w-7 h-7" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <CardTitle className={cn("text-xl font-black leading-tight tracking-tight", isVip ? "text-white" : "text-dark-blue")}>
                                {label}
                            </CardTitle>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1">
                        <span className={cn("text-2xl font-black whitespace-nowrap", isVip ? "text-amber-400" : "text-primary")}>
                            {isSurcharge ? "+50%" : formatPrice(price, lang, currency)}
                        </span>
                        {subDescription && (
                            <div className="flex items-center gap-2 flex-1">
                                <div className={cn("h-6 w-px", isVip ? "bg-white/20" : "bg-slate-200")} />
                                <span className={cn("text-sm font-bold leading-tight", isVip ? "text-slate-300" : "text-slate-500")}>
                                    {subDescription}
                                </span>
                            </div>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="px-5 pt-0 pb-5 flex-grow flex flex-col relative z-10" suppressHydrationWarning>
                    <div className="flex border-b border-slate-100 mb-4" onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => setActiveTab('included')}
                            className={cn(
                                "flex-1 py-2 text-[11px] font-black uppercase tracking-widest transition-all",
                                activeTab === 'included' 
                                    ? (isVip ? "text-amber-400 border-b-2 border-amber-400" : "text-primary border-b-2 border-primary")
                                    : "text-slate-400"
                            )}
                        >
                            {dictionary.tabs?.included || "Nima kiradi"}
                        </button>
                        <button 
                            onClick={() => setActiveTab('benefits')}
                            className={cn(
                                "flex-1 py-2 text-[11px] font-black uppercase tracking-widest transition-all",
                                activeTab === 'benefits' 
                                    ? (isVip ? "text-amber-400 border-b-2 border-amber-400" : "text-primary border-b-2 border-primary")
                                    : "text-slate-400"
                            )}
                        >
                            {dictionary.tabs?.benefits || "Nima olasiz"}
                        </button>
                    </div>

                    <div className="flex-grow min-h-[180px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'included' ? (
                                <motion.div 
                                    key="included"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="space-y-2"
                                >
                                    <ul className="space-y-2">
                                        {(features || []).map((r: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2.5">
                                                <div className={cn("mt-1 shrink-0 rounded-full p-0.5", isVip ? "bg-amber-400/20" : "bg-primary/10")}>
                                                    <CheckCircle className={cn("w-3.5 h-3.5", isVip ? "text-amber-400" : "text-primary")} />
                                                </div>
                                                <span className={cn("text-sm font-medium leading-tight", isVip ? "text-slate-300" : "text-slate-700")}>{r}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="benefits"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="grid grid-cols-1 gap-3"
                                >
                                    {(benefits || []).map((b: any, i: number) => (
                                        <div key={i} className={cn("p-3 rounded-xl border flex items-center gap-3", isVip ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100 shadow-sm")}>
                                            <span className="text-xl shrink-0">{b.icon}</span>
                                            <div className="min-w-0">
                                                <p className={cn("text-sm font-black leading-tight", isVip ? "text-white" : "text-dark-blue")}>{b.title}</p>
                                                <p className={cn("text-[11px] leading-snug text-slate-500", isVip && "text-slate-400")}>{b.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                        {timeline && (
                            <div className={cn("flex items-center gap-2 text-[11px] font-black uppercase tracking-widest", isVip ? "text-amber-400/60" : "text-slate-400")}>
                                <Clock className="w-3.5 h-3.5" />
                                <span>{timeline}</span>
                            </div>
                        )}

                        <Button
                            variant={selected ? (isVip ? "secondary" : "default") : "outline"}
                            className={cn(
                                "w-full py-4 text-xs font-black transition-all duration-300 rounded-full border-2 h-auto uppercase tracking-widest relative z-20",
                                selected 
                                    ? (isVip ? "border-none bg-gradient-to-br from-amber-400 to-amber-600 text-blue-950 shadow-[0_0_20px_rgba(251,191,36,0.4)]" : "border-none bg-primary text-white shadow-lg") 
                                    : (isVip ? "bg-white/5 border-amber-400/20 text-amber-400 hover:bg-amber-400 hover:text-blue-950" : "bg-white border-slate-200 text-slate-600 hover:border-primary hover:text-primary shadow-sm")
                            )}
                            onClick={(e) => { e.stopPropagation(); onSelect(); }}
                        >
                            {selected ? dictionary.selected : dictionary.select}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
});
ServiceCard.displayName = 'ServiceCard';

const ServiceGroup = ({ title, children, gridCols = "lg:grid-cols-3", noAnimation = false }: { title: string, children: React.ReactNode, gridCols?: string, noAnimation?: boolean }) => {
    const content = (
        <div className="space-y-8">
            <div className="flex items-center gap-4 px-1">
                <div className="h-8 w-2.5 bg-primary rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                <h3 className="text-xl sm:text-2xl font-black text-dark-blue tracking-tight uppercase">{title}</h3>
            </div>
            <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", gridCols)}>{children}</div>
        </div>
    );

    if (noAnimation) return content;

    return (
        <motion.div variants={itemVariants}>
            {content}
        </motion.div>
    );
};

const PackageBuilder: FC<PackageBuilderProps> = ({ onOrderNow, lang, dictionary }) => {
    const [selectedServices, setSelectedServices] = useLocalStorage<SelectedServices>('selectedServices', { 
        namingPremium: true, logoPremium: true, urgency: false, nda: false
    });
    const [discountType, setDiscountType] = useLocalStorage<'none' | 'package' | 'full'>('discountOption', 'none');
    const [promoCode, setPromoCode] = useLocalStorage<string>('promoCode', '');
    const [currency] = useLocalStorage<'uzs' | 'usd'>('currency', 'usd');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => { setIsClient(true); }, []);
    if (!isClient || !dictionary) return null;

    const translations = dictionary;
    const serviceDetails = getServiceDetails(lang as any) as any;
    const total = calculatePackagePrice({ selectedServices, discountType, promoCode }, lang as any);

    const handleServiceToggle = (id: string) => {
        const namingGroup = ['namingVIP', 'namingPremium', 'namingStandard'];
        const logoGroup = ['logoVIP', 'logoPremium', 'logoStandard'];
        setSelectedServices(prev => {
            const newState = { ...prev };
            if (namingGroup.includes(id)) namingGroup.forEach(k => { if (k !== id) newState[k as keyof SelectedServices] = false; });
            if (logoGroup.includes(id)) logoGroup.forEach(k => { if (k !== id) newState[k as keyof SelectedServices] = false; });
            newState[id as keyof SelectedServices] = !prev[id as keyof SelectedServices];
            return newState;
        });
    };

    const discountOptions = [
        { value: 'none', label: translations.discountSelector.none },
        { value: 'package', label: translations.discountSelector.package },
        { value: 'full', label: translations.discountSelector.full }
    ];

    return (
        <section id="package-builder" className="py-20 bg-white" suppressHydrationWarning>
            <motion.div 
                className="container mx-auto px-4 max-w-7xl"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            >
                <motion.div variants={itemVariants} className="max-w-4xl mx-auto mb-16 text-center space-y-4">
                    <Badge className="bg-primary/10 text-primary border-none px-8 py-2 rounded-full font-black text-[12px] uppercase tracking-[0.2em] shadow-sm">
                        LOYIHA ME'MORI
                    </Badge>
                    <h2 className="text-4xl sm:text-6xl font-black text-dark-blue leading-tight tracking-tighter">{translations.title}</h2>
                    <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto font-medium">{translations.subtitle}</p>
                </motion.div>

                <div className="space-y-20">
                    <ServiceGroup title={translations.categories.tripwire}>
                        {['namingCheck', 'audit', 'consultation'].map(id => (
                            <ServiceCard key={id} id={id} selected={!!selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />
                        ))}
                    </ServiceGroup>

                    <ServiceGroup title={translations.categories.strategy} gridCols="lg:grid-cols-2">
                        {['strategy', 'commStrategy'].map(id => (
                            <ServiceCard key={id} id={id} selected={!!selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />
                        ))}
                    </ServiceGroup>

                    <ServiceGroup title={translations.categories.naming}>
                        {['namingVIP', 'namingPremium', 'namingStandard'].map(id => (
                            <ServiceCard key={id} id={id} selected={!!selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />
                        ))}
                    </ServiceGroup>

                    <ServiceGroup title={translations.categories.identity}>
                        {['logoVIP', 'logoPremium', 'logoStandard'].map(id => (
                            <ServiceCard key={id} id={id} selected={!!selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />
                        ))}
                    </ServiceGroup>
                    
                    <motion.div variants={itemVariants} className="w-full">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="more" className="border-none">
                                <AccordionTrigger className="text-xl font-black text-dark-blue justify-center gap-6 hover:no-underline py-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 transition-all hover:bg-slate-100 group shadow-sm">
                                    {translations.categories.more_services || "Qo'shimcha xizmatlar va maxsus shartlar"}
                                    <ChevronsDown className="w-6 h-6 text-primary animate-bounce" />
                                </AccordionTrigger>
                                <AccordionContent className="pt-12">
                                    <ServiceGroup title={translations.categories.addons || "Qo'shimcha xizmatlar"} gridCols="lg:grid-cols-2" noAnimation={true}>
                                        {['packaging', 'smm', 'urgency', 'nda'].map(id => (
                                            <ServiceCard key={id} id={id} selected={!!selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />
                                        ))}
                                    </ServiceGroup>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </motion.div>
                </div>

                <motion.div variants={itemVariants} className="mt-24 max-w-6xl mx-auto">
                    <div id="your-package-card" className="rounded-[3rem] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col lg:flex-row border border-slate-100">
                        <div className="lg:w-1/2 bg-dark-blue p-8 sm:p-14 text-white relative">
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px]" />
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="space-y-3 mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/10 p-3 rounded-xl border border-white/10 shadow-inner">
                                            <Box className="w-7 h-7 text-sky-blue" />
                                        </div>
                                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-white">{translations.your_package}</h3>
                                    </div>
                                    <p className="text-blue-100/80 font-medium text-base max-w-sm leading-relaxed">{translations.your_package_desc}</p>
                                </div>
                                <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-3 custom-scrollbar flex-grow max-h-[400px]">
                                    {Object.entries(selectedServices).filter(([_,v]) => v).map(([k]) => {
                                        const isSurcharge = k === 'urgency' || k === 'nda';
                                        return (
                                            <div key={k} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 shadow-sm group">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("p-1.5 rounded-full transition-transform group-hover:scale-110", isSurcharge ? "bg-blue-400/20" : "bg-sky-blue/20")}>
                                                        {isSurcharge ? <Plus className="w-4 h-4 text-blue-400" /> : <Check className="w-4 h-4 text-sky-blue" />}
                                                    </div>
                                                    <span className="text-base font-bold tracking-tight text-white">{serviceDetails[k]?.label}</span>
                                                </div>
                                                <span className={cn("font-black text-sm", isSurcharge ? "text-blue-400" : "text-sky-blue")}>
                                                    {isSurcharge ? "+50%" : formatPrice(serviceDetails[k]?.price || 0, lang as any, currency)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 bg-slate-50 p-8 sm:p-14 flex flex-col border-l border-slate-100 relative">
                            <div className="space-y-8 flex-grow">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{translations.base_price_label}</span>
                                        <span className="text-2xl font-bold line-through text-slate-300">{formatPrice(total.base, lang as any, currency)}</span>
                                    </div>

                                    <div className="space-y-2">
                                        {total.surchargesApplied.map((s: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center text-blue-700 text-[12px] font-bold bg-blue-50 px-5 py-3 rounded-xl border border-blue-100 shadow-sm">
                                                <div className="flex items-center gap-2"><Plus className="w-4 h-4" />{s.name}</div>
                                                <span className="text-base">+{formatPrice(s.value, lang as any, currency)}</span>
                                            </div>
                                        ))}
                                        {total.discountApplied.map((d: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center text-green-700 text-[12px] font-bold bg-green-50 px-5 py-3 rounded-xl border border-green-100 shadow-sm">
                                                <div className="flex items-center gap-2"><Zap className="w-4 h-4" />{d.name}</div>
                                                <span className="text-base">-{formatPrice(d.value, lang as any, currency)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-6 border-t border-slate-200 text-center space-y-2">
                                        <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{translations.final_price}</span>
                                        <div className="flex flex-col items-center">
                                            <span className="text-6xl font-bold text-primary tracking-tighter">
                                                {formatPrice(total.final, lang as any, currency)}
                                            </span>
                                            {total.savings > 0 && (
                                                <div className="mt-4 flex items-center gap-2 text-green-600 font-bold text-[12px] bg-green-100/70 px-6 py-2 rounded-full border border-green-200 uppercase tracking-widest shadow-sm">
                                                    <Gift className="w-4 h-4" /> JAMI TEJALDI: {formatPrice(total.savings, lang as any, currency)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] uppercase font-bold text-slate-400 tracking-widest ml-4">{translations.promo_code_label}</Label>
                                        <div className="relative">
                                            <Input 
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                placeholder={translations.promo_code_placeholder}
                                                className="rounded-full py-3 px-6 border-slate-200 h-14 text-base font-bold uppercase tracking-widest bg-white shadow-inner focus:ring-primary focus:border-primary transition-all"
                                            />
                                            {total.isPromoApplied && <div className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-500"><CheckCircle className="w-6 h-6" /></div>}
                                        </div>
                                    </div>

                                    {!total.isPromoApplied && (
                                        <div className="space-y-2">
                                            <Label className="text-[11px] uppercase font-bold text-slate-400 tracking-widest ml-4">CHEGIRMALAR</Label>
                                            <DynamicToggle id="discount-tier" options={discountOptions} selected={discountType} onSelect={(val) => setDiscountType(val as any)} className="h-14" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Button 
                                size="lg" 
                                className="w-full py-7 text-base sm:text-lg font-black rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all mt-8 group" 
                                onClick={onOrderNow} 
                                disabled={total.base === 0}
                            >
                                <span className="flex items-center justify-center gap-3 uppercase tracking-wider">
                                    LOYIHA NARXINI TASDIQLASH 
                                    <ChevronsDown className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce group-hover:scale-110 shrink-0" />
                                </span>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default PackageBuilder;
