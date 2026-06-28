'use client';

import React, { useState, useEffect, FC, useMemo, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getServiceDetails, calculatePackagePrice, type SelectedServices, formatPrice } from '@/lib/pricing';
import { Sparkles, CheckCircle, Crown, Check, Clock, BrainCircuit, Search, Megaphone, Palette, Box, Type, Layers, ClipboardSignature, Info, Flame, ShieldCheck, Zap, Gift, Plus, Lightbulb, MessageSquare, Target, BarChart, Rocket, Link, Gem, Globe, Lock, Award, TrendingUp, BookOpen, Building2, Smartphone, Scale, ArrowRight } from 'lucide-react';
import DynamicToggle from '@/components/ui/dynamic-toggle';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { renderHeadline } from '@/lib/headline';

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

const BenefitIcon = ({ name, className }: { name: string, className?: string }) => {
    const icons: Record<string, React.ElementType> = {
        Search, Lightbulb, ShieldCheck, CheckCircle, MessageSquare, Target, 
        BarChart, Rocket, Megaphone, Link, Gem, Globe, Lock, Award, Zap, 
        TrendingUp, BookOpen, Gift, Building2, Smartphone, Sparkles, Scale
    };
    const Icon = icons[name] || Sparkles;
    return <Icon className={className} />;
};

const ServiceCard = React.memo(({ id, onSelect, selected, lang, dictionary, currency }: { id: string, onSelect: () => void, selected: boolean, lang: any, dictionary: any, currency: any }) => {
    const serviceDetails = useMemo(() => getServiceDetails(lang) as any, [lang]);
    const detail = serviceDetails[id];
    if (!detail) return null;

    const { label, price, subDescription, features, benefits, timeline, recommended, cta } = detail;
    const Icon = serviceIcons[id] || Sparkles;
    const isVip = id.toLowerCase().includes('vip');
    const isSurcharge = id === 'urgency' || id === 'nda';

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="h-full relative pt-12"
        >
            <div className="absolute top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex justify-center">
                {recommended && !isVip && (
                    <Badge className="flex items-center gap-2 whitespace-nowrap rounded-full bg-primary px-10 py-2.5 text-[13px] font-black uppercase text-white shadow-[0_4px_30px_rgba(37,99,235,0.5)] animate-breathing">
                        {dictionary.recommended || "TAVSIYA ETILADI"}
                    </Badge>
                )}
                {isVip && (
                    <Badge className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-gradient-to-r from-brand-blue to-blue-700 px-10 py-2.5 text-[13px] font-black uppercase text-white shadow-[0_4px_30px_rgba(37,99,235,0.45)]">
                        <Crown className="w-4 h-4 fill-current" /> VIP
                    </Badge>
                )}
            </div>

            <Card
                className={cn(
                    "group relative h-full border flex flex-col rounded-[1.5rem] bg-white transition-[border-color,box-shadow,transform,background-color] duration-500",
                    selected
                        ? (isVip ? 'border-brand-blue bg-blue-950 shadow-[0_0_60px_rgba(37,99,235,0.28)] scale-[1.02]' : 'border-primary shadow-[0_0_40px_rgba(37,99,235,0.15)] scale-[1.02]')
                        : (isVip ? "bg-blue-950 border-blue-900/50 hover:border-brand-blue/60" : "border-slate-100 hover:border-primary/20 shadow-sm")
                )}
            >
                <CardHeader className="p-5 pb-3 relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0",
                            selected 
                                ? (isVip ? "bg-brand-blue text-white shadow-xl" : "bg-primary text-white shadow-lg")
                                : (isVip ? "border border-brand-blue/30 bg-white/10 text-sky-blue" : "bg-secondary text-slate-600")
                        )}>
                            <Icon className="w-7 h-7" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <CardTitle className={cn("text-xl font-black leading-tight tracking-tight", isVip ? "text-white" : "text-foreground")}>
                                {label}
                            </CardTitle>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1">
                        <span className={cn("text-2xl font-black whitespace-nowrap", isVip ? "text-sky-blue" : "text-primary")}>
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

                <CardContent className="relative z-10 flex flex-grow flex-col px-5 pb-5 pt-0" suppressHydrationWarning>
                    <div className={cn("mt-3 pt-4 border-t space-y-5", isVip ? "border-white/10" : "border-slate-100")}>
                        <div className="space-y-2">
                            <span className={cn("text-[13px] font-black uppercase tracking-[0.08em] block", isVip ? "text-sky-blue" : "text-primary")}>
                                {dictionary.tabs?.included || "Nima kiradi"}
                            </span>
                            <ul className="space-y-2">
                                {(features || []).map((r: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                        <div className={cn("mt-1 shrink-0 rounded-full p-0.5", isVip ? "bg-brand-blue/25" : "bg-primary/10")}>
                                            <CheckCircle className={cn("h-3.5 w-3.5", isVip ? "text-sky-blue" : "text-primary")} />
                                        </div>
                                        <span className={cn("text-[13px] font-medium leading-5", isVip ? "text-slate-200" : "text-slate-700")}>{r}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {benefits && benefits.length > 0 && (
                            <div className={cn("space-y-3 border-t pt-4", isVip ? "border-white/10" : "border-slate-100")}>
                                <span className={cn("text-[13px] font-black uppercase tracking-[0.08em] block", isVip ? "text-sky-blue" : "text-primary")}>
                                    {dictionary.tabs?.benefits || "Nima olasiz"}
                                </span>
                                <div className="grid grid-cols-1 gap-3">
                                    {benefits.map((b: any, i: number) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className={cn("mt-0.5 shrink-0", isVip ? "text-sky-blue" : "text-primary")}>
                                                <BenefitIcon name={b.icon} className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className={cn("text-[13px] font-black leading-5", isVip ? "text-white" : "text-foreground")}>{b.title}</p>
                                                <p className={cn("text-[13px] leading-5 text-slate-500", isVip && "text-slate-300")}>{b.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={cn("mt-auto pt-6 border-t space-y-4", isVip ? "border-white/10" : "border-slate-100")}>
                        {timeline && (
                            <div className={cn("flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.08em]", isVip ? "text-sky-blue" : "text-slate-500")}>
                                <Clock className="w-3.5 h-3.5" />
                                <span>{timeline}</span>
                            </div>
                        )}

                        <Button
                            variant={selected ? (isVip ? "outline" : "default") : "outline"}
                            className={cn(
                                "relative z-20 h-auto w-full rounded-full border-2 py-4 text-[13px] font-black uppercase tracking-[0.08em] transition-[background-color,border-color,color,box-shadow,transform] duration-300",
                                selected 
                                    ? (isVip ? "border-none bg-brand-blue text-white shadow-[0_0_20px_rgba(37,99,235,0.35)]" : "border-none bg-primary text-white shadow-lg")
                                    : (isVip ? "border-brand-blue/40 bg-white/5 text-sky-blue hover:bg-brand-blue hover:text-white" : "bg-white border-slate-200 text-slate-600 hover:border-primary hover:text-primary shadow-sm")
                            )}
                            onClick={(e) => { e.stopPropagation(); onSelect(); }}
                        >
                            {selected ? (dictionary.selected || "TANLANDI") : (cta || dictionary.select || "TANLASH")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
});
ServiceCard.displayName = 'ServiceCard';

const ServiceGroup = ({ title, children, gridCols = "lg:grid-cols-3" }: { title: string, children: React.ReactNode, gridCols?: string }) => {
    return (
        <div className="space-y-8">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 px-1"
            >
                <div className="h-8 w-2.5 bg-primary rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight uppercase">{title}</h3>
            </motion.div>
            <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", gridCols)}>{children}</div>
        </div>
    );
};

const DISCOUNT_DURATION_MS = 24 * 60 * 60 * 1000;

const DiscountCountdown = ({ active, lang }: { active: boolean; lang: string }) => {
    const [display, setDisplay] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        if (!active) {
            setDisplay(null);
            return;
        }

        const STORAGE_KEY = 'discountCountdownStart';
        let start = 0;
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            start = stored ? Number(stored) : 0;
        } catch { /* ignore */ }

        if (!start || start < Date.now() - DISCOUNT_DURATION_MS) {
            start = Date.now();
            try { localStorage.setItem(STORAGE_KEY, String(start)); } catch { /* ignore */ }
        }

        const tick = () => {
            const diff = start + DISCOUNT_DURATION_MS - Date.now();
            if (diff <= 0) {
                setDisplay(null);
                return false;
            }
            setDisplay({
                hours: Math.floor(diff / 3600000),
                minutes: Math.floor((diff / 60000) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
            return true;
        };

        tick();
        const interval = setInterval(() => { if (!tick()) clearInterval(interval); }, 1000);
        return () => clearInterval(interval);
    }, [active]);

    if (!display) return null;

    const labels: Record<string, { title: string; hours: string; minutes: string; seconds: string; description: string }> = {
        uz: { title: 'Chegirma muddati tugaydi:', hours: 'soat', minutes: 'daqiqa', seconds: 'soniya', description: "Ushbu chegirma faqat 24 soat ichida to'lov amalga oshirilganda taqdim etiladi." },
        ru: { title: 'Срок скидки истекает:', hours: 'час', minutes: 'мин', seconds: 'сек', description: 'Эта скидка предоставляется только при оплате в течение 24 часов.' },
        en: { title: 'Discount expires in:', hours: 'hrs', minutes: 'min', seconds: 'sec', description: 'This discount is only valid if payment is made within 24 hours.' },
        zh: { title: '折扣剩余时间：', hours: '时', minutes: '分', seconds: '秒', description: '此折扣仅在24小时内付款时有效。' },
    };
    const t = labels[lang] || labels.uz;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4 shadow-sm"
        >
            <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span className="text-[12px] font-bold uppercase tracking-wider text-amber-700">{t.title}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-black tabular-nums text-amber-900">{String(display.hours).padStart(2, '0')}</span>
                    <span className="text-[10px] font-bold uppercase text-amber-600">{t.hours}</span>
                </div>
                <span className="text-2xl font-black text-amber-400">:</span>
                <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-black tabular-nums text-amber-900">{String(display.minutes).padStart(2, '0')}</span>
                    <span className="text-[10px] font-bold uppercase text-amber-600">{t.minutes}</span>
                </div>
                <span className="text-2xl font-black text-amber-400">:</span>
                <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-black tabular-nums text-amber-900">{String(display.seconds).padStart(2, '0')}</span>
                    <span className="text-[10px] font-bold uppercase text-amber-600">{t.seconds}</span>
                </div>
            </div>
            <p className="mt-2 text-center text-[11px] font-medium text-amber-600">{t.description}</p>
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
    const [hasCelebrated, setHasCelebrated] = useState(false);

    useEffect(() => { setIsClient(true); }, []);
    
    const translations = dictionary;
    const serviceDetails = getServiceDetails(lang as any) as any;
    const total = calculatePackagePrice({ selectedServices, discountType, promoCode }, lang as any);

    useEffect(() => {
        if (total.isPromoApplied && !hasCelebrated) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#050583', '#2c2bf5', '#00C9FD', '#ffffff']
            });
            setHasCelebrated(true);
        } else if (!total.isPromoApplied && hasCelebrated) {
            setHasCelebrated(false);
        }
    }, [total.isPromoApplied, hasCelebrated]);

    const isDiscountActive = total.isPromoApplied || discountType !== 'none';


    const handleServiceToggle = useCallback((id: string) => {
        const namingGroup = ['namingVIP', 'namingPremium', 'namingStandard'];
        const logoGroup = ['logoVIP', 'logoPremium', 'logoStandard'];
        setSelectedServices(prev => {
            const newState = { ...prev };
            if (namingGroup.includes(id)) namingGroup.forEach(k => { if (k !== id) newState[k as keyof SelectedServices] = false; });
            if (logoGroup.includes(id)) logoGroup.forEach(k => { if (k !== id) newState[k as keyof SelectedServices] = false; });
            newState[id as keyof SelectedServices] = !prev[id as keyof SelectedServices];
            return newState;
        });
    }, [setSelectedServices]);

    if (!isClient || !dictionary) return null;

    const discountOptions = [
        { value: 'none', label: "50/50 TO'LOV" },
        { value: 'full', label: "100% OLDINDAN (-10%)" }
    ];

    return (
        <section id="package-builder" className="py-20 sm:py-28 bg-white" suppressHydrationWarning>
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="max-w-4xl mx-auto mb-16 text-center space-y-4">
                    <Badge className="bg-primary/10 text-primary border-none px-8 py-2 rounded-full font-black text-[13px] uppercase tracking-[0.16em] shadow-sm">
                        LOYIHA ME'MORI
                    </Badge>
                    <h2 className="text-4xl sm:text-6xl font-black text-foreground leading-tight tracking-tighter">
                        {renderHeadline(translations.title, "text-primary")}
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto font-medium">{translations.subtitle}</p>
                </div>

                <div className="space-y-20">
                    <ServiceGroup title={translations.categories?.tripwire || "Tezkor xizmatlar"}>
                        {['namingCheck', 'audit', 'consultation'].map(id => (
                            <ServiceCard key={id} id={id} selected={!!selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />
                        ))}
                    </ServiceGroup>

                    <ServiceGroup title={translations.categories?.strategy || "Strategik xizmatlar"} gridCols="lg:grid-cols-2">
                        {['strategy', 'commStrategy'].map(id => (
                            <ServiceCard key={id} id={id} selected={!!selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />
                        ))}
                    </ServiceGroup>

                    <ServiceGroup title={translations.categories?.naming || "Neyming"}>
                        {['namingVIP', 'namingPremium', 'namingStandard'].map(id => (
                            <ServiceCard key={id} id={id} selected={!!selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />
                        ))}
                    </ServiceGroup>
                    
                    {lang === 'uz' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-8 mb-16 max-w-4xl mx-auto"
                        >
                            <Card className="group relative overflow-hidden rounded-[2.5rem] border-2 border-dashed border-blue-100 bg-blue-50/70 p-8 shadow-sm transition-colors duration-500 hover:bg-blue-100/60">
                                <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <CheckCircle className="w-40 h-40 text-brand-blue" />
                                </div>
                                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                                    <div className="flex-shrink-0 rounded-2xl bg-brand-blue p-4 text-white shadow-lg transition-transform duration-500 group-hover:scale-110">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-black leading-relaxed tracking-tight text-blue-950 sm:text-xl">
                                            Agar taqdim etilgan nomlardan hech biri sizga mos kelmasa — to'liq pul qaytaramiz. Xavfsiz sinab ko'ring.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    <ServiceGroup title={translations.categories?.identity || "Visual Identity"}>
                        {['logoVIP', 'logoPremium', 'logoStandard'].map(id => (
                            <ServiceCard key={id} id={id} selected={!!selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />
                        ))}
                    </ServiceGroup>
                    
                    <ServiceGroup title={translations.categories?.addons || "Qo'shimcha xizmatlar"} gridCols="lg:grid-cols-2">
                        {['packaging', 'smm', 'urgency', 'nda'].map(id => (
                            <ServiceCard key={id} id={id} selected={!!selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />
                        ))}
                    </ServiceGroup>
                </div>

                <div className="mt-24 max-w-6xl mx-auto">
                    <div id="your-package-card" className={cn("rounded-[2rem] sm:rounded-[3rem] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col lg:flex-row border border-slate-100 transition-all duration-500", total.isPromoApplied && "ring-4 ring-emerald-500/30 scale-[1.01]")}>
                        <div className="relative lg:w-1/2 overflow-hidden bg-[linear-gradient(145deg,#050583_0%,#09113f_58%,#111a52_100%)] p-5 sm:p-14 text-white">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(44,43,245,0.55),transparent_42%),radial-gradient(circle_at_10%_90%,rgba(0,201,253,0.18),transparent_40%)]" />
                            <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-white/15" />
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="space-y-3 mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/10 p-3 rounded-xl border border-white/10 shadow-inner group/icon">
                                            <Box className="w-7 h-7 text-sky-blue group-hover/icon:scale-110 transition-transform" />
                                        </div>
                                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-white">{translations.your_package || "Sizning paketingiz"}</h3>
                                    </div>
                                    <p className="max-w-sm text-base font-medium leading-relaxed text-blue-100">{translations.your_package_desc || "Tanlangan xizmatlar ro'yxati."}</p>
                                </div>
                                <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-3 custom-scrollbar flex-grow max-h-[300px] lg:max-h-[400px]">
                                    <AnimatePresence mode="popLayout">
                                        {Object.entries(selectedServices).filter(([_,v]) => v).map(([k]) => {
                                            const isSurcharge = k === 'urgency' || k === 'nda';
                                            return (
                                                <motion.div 
                                                    key={k} 
                                                    layout
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="group flex items-center justify-between rounded-xl border border-white/15 bg-white/10 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.16)] backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/15"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("p-1.5 rounded-full transition-transform group-hover:scale-110", isSurcharge ? "bg-blue-400/20" : "bg-sky-blue/20")}>
                                                            {isSurcharge ? <Plus className="w-4 h-4 text-blue-400" /> : <Check className="w-4 h-4 text-sky-blue" />}
                                                        </div>
                                                        <span className="text-base font-bold tracking-tight text-white drop-shadow-sm">{serviceDetails[k]?.label}</span>
                                                    </div>
                                                    <span className={cn("font-black text-sm", isSurcharge ? "text-blue-400" : "text-sky-blue")}>
                                                        {isSurcharge ? "+50%" : formatPrice(serviceDetails[k]?.price || 0, lang as any, currency)}
                                                    </span>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 bg-slate-50 p-5 sm:p-14 flex flex-col lg:border-l border-slate-100 relative">
                            <div className="space-y-8 flex-grow">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-[13px] font-bold uppercase tracking-wider text-slate-500">{translations.base_price_label || "Boshlang'ich narx"}</span>
                                        <span className="text-2xl font-bold line-through text-slate-300">{formatPrice(total.base, lang as any, currency)}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <AnimatePresence>
                                            {total.surchargesApplied.map((s: any, i: number) => (
                                                <motion.div 
                                                    key={i} 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="flex justify-between items-center text-blue-700 text-[13px] font-bold bg-blue-50 px-5 py-3 rounded-xl border border-blue-100 shadow-sm"
                                                >
                                                    <div className="flex items-center gap-2"><Plus className="w-4 h-4" />{s.name}</div>
                                                    <span className="text-base">+{formatPrice(s.value, lang as any, currency)}</span>
                                                </motion.div>
                                            ))}
                                            {total.discountApplied.map((d: any, i: number) => (
                                                <motion.div 
                                                    key={i} 
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    exit={{ x: 20, opacity: 0 }}
                                                    className="flex justify-between items-center text-green-700 text-[13px] font-bold bg-green-50 px-5 py-3 rounded-xl border border-green-100 shadow-sm"
                                                >
                                                    <div className="flex items-center gap-2"><Zap className="w-4 h-4" />{d.name}</div>
                                                    <span className="text-base">-{formatPrice(d.value, lang as any, currency)}</span>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    <div className="pt-6 border-t border-slate-200 text-center space-y-2">
                                        <span className="text-slate-500 text-[13px] font-bold uppercase tracking-widest">{translations.final_price || "Yakuniy narx:"}</span>
                                        <div className="flex flex-col items-center">
                                            <AnimatePresence mode="wait">
                                                <motion.span 
                                                    key={total.final}
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className={cn("text-6xl font-bold tracking-tighter transition-colors", total.isPromoApplied ? "text-emerald-600" : "text-primary")}
                                                >
                                                    {formatPrice(total.final, lang as any, currency)}
                                                </motion.span>
                                            </AnimatePresence>
                                            {total.savings > 0 && (
                                                <motion.div 
                                                    initial={{ y: 10, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    className="mt-4 flex items-center gap-2 text-green-600 font-bold text-[13px] bg-green-100/70 px-6 py-2 rounded-full border border-green-200 uppercase tracking-widest shadow-sm"
                                                >
                                                    <Gift className="w-4 h-4" /> JAMI TEJALDI: {formatPrice(total.savings, lang as any, currency)}
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                    {isDiscountActive && (
                                        <div className="mx-2 space-y-3">
                                            <DiscountCountdown active={isDiscountActive} lang={lang} />
                                            
                                            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden">
                                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-400/20 rounded-full blur-xl"></div>
                                                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                                                        <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[14px] font-bold text-amber-900 dark:text-amber-200">Arboun (Bron qilish) Xizmati</h4>
                                                        <p className="text-[13px] text-amber-800/80 dark:text-amber-300/80 mt-0.5 leading-snug">
                                                            24 soat ichida to'lovga ulgurmaysizmi? <strong>$50</strong> to'lab chegirmalaringizni yana 3 kunga muzlatib qo'ying.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="ml-4 text-[13px] font-bold uppercase tracking-widest text-slate-500">{translations.promo_code_label || "Promokod"}</Label>
                                        <div className="relative">
                                            <Input 
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                placeholder={translations.promo_code_placeholder || "KODNI KIRITING"}
                                                className={cn("rounded-full py-3 px-6 border-slate-200 h-14 text-base font-bold uppercase tracking-widest bg-white shadow-inner focus:ring-primary focus:border-primary transition-all", total.isPromoApplied && "border-emerald-500 ring-2 ring-emerald-500/20")}
                                            />
                                            {total.isPromoApplied && (
                                                <motion.div 
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-500"
                                                >
                                                    <CheckCircle className="w-6 h-6" />
                                                </motion.div>
                                            )}
                                        </div>
                                        {total.isPromoApplied && (
                                            <motion.div 
                                                initial={{ y: -10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="mx-auto mt-2 flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-[13px] font-bold text-emerald-600 shadow-sm"
                                            >
                                                <Sparkles className="w-3.5 h-3.5" /> TABRIKLAYMIZ! PROMOKOD QABUL QILINDI
                                            </motion.div>
                                        )}
                                    </div>

                                    {!total.isPromoApplied && (
                                        <div className="space-y-3">
                                            <Label className="ml-4 text-[13px] font-bold uppercase tracking-widest text-slate-500">CHEGIRMALAR</Label>
                                            <DynamicToggle id="discount-tier" options={discountOptions} selected={discountType} onSelect={(val) => setDiscountType(val as any)} className="h-14" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Button 
                                size="lg" 
                                className="w-full py-5 sm:py-8 text-base sm:text-lg font-black rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all mt-8 group btn-premium bg-primary text-white" 
                                onClick={(e) => {
                                    if (typeof window !== 'undefined') {
                                        if ((window as any).fbq) {
                                            (window as any).fbq('track', 'InitiateCheckout', { value: total.final, currency: 'UZS' });
                                        }
                                        if ((window as any).gtag) {
                                            (window as any).gtag('event', 'begin_checkout', { value: total.final, currency: 'UZS' });
                                        }
                                    }
                                    onOrderNow();
                                }} 
                                disabled={total.base === 0}
                                aria-label="Loyiha narxini tasdiqlash"
                            >
                                <span className="flex items-center justify-center gap-3 uppercase tracking-wider">
                                    LOYIHA NARXINI TASDIQLASH 
                                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform shrink-0" />
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PackageBuilder;
