
'use client';

import React, { useState, useEffect, FC } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { getServiceDetails, calculatePackagePrice, type PriceDetails, SelectedServices, formatPrice } from '@/lib/pricing';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, ShoppingCart, CheckCircle, Crown, Check, ChevronsDown, Ticket, Clock, BrainCircuit, Search, Megaphone, PenTool, Shirt, Palette, Box, Type, Layers, BookMarked, ClipboardSignature, Info, Flame, ShieldCheck } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';

interface PackageBuilderProps {
    onOrderNow: () => void;
    lang: string;
    dictionary: any;
}

const serviceIcons: { [key: string]: React.ElementType } = {
    audit: Search,
    namingCheck: ClipboardSignature,
    consultation: Info,
    strategy: BrainCircuit,
    commStrategy: Megaphone,
    smm: PenTool,
    merch: Shirt,
    illustrations: Palette,
    urgency: Flame,
    nda: ShieldCheck,
    packaging: Box,
    namingStandard: Type,
    namingPremium: Sparkles,
    namingVIP: Crown,
    logoStandard: Layers,
    logoPremium: Palette,
    logoVIP: BookMarked,
};

const introIcons: { [key: string]: React.ElementType } = {
    research: Search,
    strategy: BrainCircuit,
    identity: Palette,
    communication: Megaphone
};

const ServiceCard = ({ id, onSelect, selected, lang, dictionary, currency }: { id: keyof SelectedServices, onSelect: () => void, selected: boolean, lang: 'uz' | 'ru' | 'en' | 'zh', dictionary: any, currency: 'uzs' | 'usd' }) => {
    const serviceDetails = getServiceDetails(lang);
    const detail = serviceDetails[id];

    if (!detail) return null;

    const { label, description, price, features, results, timeline, note, recommended } = detail;
    const Icon = serviceIcons[id] || Sparkles;
    const isVip = id.toLowerCase().includes('vip');

    return (
        <Card
            onClick={onSelect}
            className={cn(
                "group relative h-full transition-all duration-300 cursor-pointer overflow-hidden border-2 flex flex-col",
                selected
                    ? (isVip ? 'border-amber-400 bg-blue-950/50 shadow-amber-400/20' : 'border-primary bg-primary/5 shadow-primary/20 shadow-xl')
                    : (isVip ? 'bg-blue-950/30 border-slate-800 hover:border-amber-400' : 'bg-white border-slate-200 hover:border-primary/50'),
                (recommended || isVip) && "shadow-lg"
            )}
        >
            <CardHeader className="relative p-6 pb-0">
                <div className="flex justify-between items-start mb-4">
                    <div className={cn("p-3 rounded-xl", selected ? "bg-primary text-white" : (isVip ? "bg-amber-400 text-black" : "bg-secondary text-slate-600"))}>
                        <Icon className="w-6 h-6" />
                    </div>
                    {recommended && !isVip && (
                        <div className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            {dictionary.recommended}
                        </div>
                    )}
                    {isVip && (
                        <div className="bg-amber-400 text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                            <Crown className="w-3 h-3" /> VIP
                        </div>
                    )}
                </div>
                <div className="space-y-1">
                    <CardTitle className={cn("text-xl font-bold", isVip && "text-white")}>
                        {label} <span className="text-primary ml-2">{formatPrice(price, lang, currency)}</span>
                    </CardTitle>
                    <p className={cn("text-sm leading-relaxed min-h-[40px]", isVip ? "text-slate-300" : "text-slate-500")}>
                        {description}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="p-6 flex-grow flex flex-col">
                <div className="space-y-6 flex-grow">
                    {features && features.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{dictionary.features}</p>
                            <ul className="space-y-2">
                                {features.map((f: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-xs">
                                        <Check className={cn("w-3.5 h-3.5 mt-0.5 shrink-0", isVip ? "text-amber-400" : "text-green-500")} />
                                        <span className={isVip ? "text-slate-200" : "text-slate-700"}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {results && results.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs font-bold uppercase tracking-widest text-primary">{dictionary.results}</p>
                            <ul className="space-y-2">
                                {results.map((r: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-xs font-semibold">
                                        <CheckCircle className={cn("w-3.5 h-3.5 mt-0.5 shrink-0", isVip ? "text-amber-400" : "text-primary")} />
                                        <span className={isVip ? "text-white" : "text-slate-900"}>{r}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mt-8 space-y-4">
                    {(timeline || note) && (
                        <div className="space-y-2">
                            {note && (
                                <p className={cn("text-[11px] italic p-2 rounded bg-slate-50 border-l-2", isVip ? "bg-white/5 border-amber-400 text-slate-300" : "border-primary text-slate-600")}>
                                    {note}
                                </p>
                            )}
                            {timeline && (
                                <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                                    <Clock className="w-3 h-3" />
                                    <span>{timeline}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <Button
                        className={cn(
                            "w-full rounded-xl py-6 h-auto text-base font-bold transition-all",
                            selected
                                ? "bg-primary text-white shadow-lg"
                                : (isVip ? "bg-white/10 text-white hover:bg-white/20" : "bg-slate-100 text-slate-900 hover:bg-slate-200")
                        )}
                        onClick={(e) => { e.stopPropagation(); onSelect(); }}
                    >
                        {selected ? (
                            <>
                                <CheckCircle className="w-5 h-5 mr-2 text-white" />
                                <span className="text-white">{dictionary.selected}</span>
                            </>
                        ) : dictionary.select}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const ServiceGroup = ({ title, children, gridCols = "lg:grid-cols-3" }: { title: string, children: React.ReactNode, gridCols?: string }) => (
    <div className="space-y-8">
        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <span className="w-2 h-8 bg-primary rounded-full" />
            {title}
        </h3>
        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", gridCols)}>
            {children}
        </div>
    </div>
);

const PackageBuilder: FC<PackageBuilderProps> = ({ onOrderNow, lang, dictionary }) => {
    const translations = dictionary;
    const serviceDetails = getServiceDetails(lang as 'uz' | 'ru' | 'en' | 'zh');

    const [selectedServices, setSelectedServices] = useLocalStorage<SelectedServices>('selectedServices', {
        audit: false, namingCheck: false, consultation: false, strategy: false, commStrategy: false,
        namingVIP: false, namingPremium: false, namingStandard: false,
        logoVIP: false, logoPremium: false, logoStandard: false,
        packaging: false, smm: false, merch: false, illustrations: false, urgency: false, nda: false,
    });
    
    const [wantsUpfrontPayment, setWantsUpfrontPayment] = useLocalStorage<boolean>('wantsUpfrontPayment', false);
    const [promoCode, setPromoCode] = useState('');
    const [isClient, setIsClient] = useState(false);
    const [currency, setCurrency] = useLocalStorage<'uzs' | 'usd'>('currency', 'usd');

    useEffect(() => { setIsClient(true); }, []);

    if (!isClient || !translations || !translations.introList) {
        return (
            <section className="py-20 pt-32 bg-slate-50 min-h-screen">
                <div className="container mx-auto px-4 space-y-12">
                    <Skeleton className="h-20 w-3/4 mx-auto" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Skeleton className="h-96 w-full rounded-3xl" />
                        <Skeleton className="h-96 w-full rounded-3xl" />
                        <Skeleton className="h-96 w-full rounded-3xl" />
                    </div>
                </div>
            </section>
        );
    }

    const total = calculatePackagePrice({ selectedServices, wantsUpfrontPayment, promoCode }, lang as 'uz' | 'ru' | 'en' | 'zh');

    const handleServiceToggle = (id: keyof SelectedServices) => {
        const namingGroup: (keyof SelectedServices)[] = ['namingVIP', 'namingPremium', 'namingStandard'];
        const logoGroup: (keyof SelectedServices)[] = ['logoVIP', 'logoPremium', 'logoStandard'];

        setSelectedServices(prev => {
            const newState = { ...prev };
            if (namingGroup.includes(id)) namingGroup.forEach(k => { if (k !== id) newState[k] = false; });
            if (logoGroup.includes(id)) logoGroup.forEach(k => { if (k !== id) newState[k] = false; });
            newState[id] = !prev[id];
            return newState;
        });
    };

    return (
        <section id="package-builder" className="py-20 sm:py-32 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto mb-20 space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-extrabold text-slate-900">{translations.title}</h2>
                        <p className="text-lg text-slate-600">{translations.subtitle}</p>
                    </div>
                    <Card className="p-8 rounded-3xl shadow-sm border-slate-200">
                        <h4 className="font-bold text-slate-900 text-xl mb-6">{translations.introSubtitle}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {translations.introList.map((item: any, index: number) => {
                                const Icon = introIcons[item.icon] || Sparkles;
                                return (
                                    <div key={index} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="bg-white p-3 rounded-xl shadow-sm h-fit">
                                            <Icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-900">{item.title}</p>
                                            <p className="text-sm text-slate-500">{item.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                <div className="space-y-20">
                    <ServiceGroup title={translations.categories.tripwire} gridCols="lg:grid-cols-3">
                        {['namingCheck', 'audit', 'consultation'].map((id) => (
                            <ServiceCard key={id} id={id as any} selected={selectedServices[id as any]} onSelect={() => handleServiceToggle(id as any)} lang={lang as any} dictionary={translations} currency={currency} />
                        ))}
                    </ServiceGroup>

                    <ServiceGroup title={translations.categories.strategy} gridCols="lg:grid-cols-2">
                        {['strategy', 'commStrategy'].map((id) => (
                            <ServiceCard key={id} id={id as any} selected={selectedServices[id as any]} onSelect={() => handleServiceToggle(id as any)} lang={lang as any} dictionary={translations} currency={currency} />
                        ))}
                    </ServiceGroup>

                    <ServiceGroup title={translations.categories.naming}>
                        {['namingVIP', 'namingPremium', 'namingStandard'].map((id) => (
                            <ServiceCard key={id} id={id as any} selected={selectedServices[id as any]} onSelect={() => handleServiceToggle(id as any)} lang={lang as any} dictionary={translations} currency={currency} />
                        ))}
                    </ServiceGroup>

                    <ServiceGroup title={translations.categories.identity}>
                        {['logoVIP', 'logoPremium', 'logoStandard'].map((id) => (
                            <ServiceCard key={id} id={id as any} selected={selectedServices[id as any]} onSelect={() => handleServiceToggle(id as any)} lang={lang as any} dictionary={translations} currency={currency} />
                        ))}
                    </ServiceGroup>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="more" className="border-none">
                            <AccordionTrigger className="text-xl font-bold text-slate-900 justify-center gap-2 hover:no-underline py-10 bg-slate-100 rounded-3xl">
                                {translations.categories.more_services}
                                <ChevronsDown className="w-5 h-5" />
                            </AccordionTrigger>
                            <AccordionContent className="pt-12 space-y-20">
                                <ServiceGroup title={translations.categories.addons} gridCols="lg:grid-cols-2">
                                    {['packaging', 'smm', 'merch', 'illustrations'].map((id) => (
                                        <ServiceCard key={id} id={id as any} selected={selectedServices[id as any]} onSelect={() => handleServiceToggle(id as any)} lang={lang as any} dictionary={translations} currency={currency} />
                                    ))}
                                </ServiceGroup>
                                <ServiceGroup title={translations.categories.options} gridCols="lg:grid-cols-2">
                                    {['urgency', 'nda'].map((id) => (
                                        <ServiceCard key={id} id={id as any} selected={selectedServices[id as any]} onSelect={() => handleServiceToggle(id as any)} lang={lang as any} dictionary={translations} currency={currency} />
                                    ))}
                                </ServiceGroup>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <div className="mt-24 max-w-4xl mx-auto">
                    <Card className="p-8 sm:p-12 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-12 bg-primary/10 blur-3xl rounded-full" />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black">{translations.your_package}</h3>
                                    <p className="text-slate-400">{translations.your_package_desc}</p>
                                </div>
                                <div className="space-y-4">
                                    {Object.entries(selectedServices).filter(([_,v]) => v).map(([k]) => (
                                        <div key={k} className="flex justify-between items-center text-sm font-medium p-3 rounded-xl bg-white/5 border border-white/10">
                                            <span>{serviceDetails[k as keyof typeof serviceDetails].label}</span>
                                            <span className="font-mono text-primary">{formatPrice(serviceDetails[k as keyof typeof serviceDetails].price, lang as any, currency)}</span>
                                        </div>
                                    ))}
                                    {Object.values(selectedServices).every(v => !v) && (
                                        <p className="text-slate-500 italic text-center py-10">{translations.empty_package_desc}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-8 bg-white/5 p-8 rounded-3xl border border-white/10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">{translations.base_price}</span>
                                        <span className="text-2xl font-mono">{formatPrice(total.base, lang as any, currency)}</span>
                                    </div>
                                    {total.discountApplied.map((d, i) => (
                                        <div key={i} className="flex justify-between items-center text-green-400 text-sm">
                                            <span>{d.name}</span>
                                            <span className="font-mono">-{formatPrice(d.value, lang as any, currency)}</span>
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t border-white/10 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-black">{translations.final_price}</span>
                                            <span className="text-4xl font-black text-primary">{formatPrice(total.final, lang as any, currency)}</span>
                                        </div>
                                        {total.savings > 0 && (
                                            <p className="text-xs text-center text-slate-400 bg-white/5 py-2 rounded-lg font-bold">
                                                {translations.total_savings}: {formatPrice(total.savings, lang as any, currency)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 py-2">
                                        <div className={cn("w-12 h-6 rounded-full relative cursor-pointer transition-colors", wantsUpfrontPayment ? "bg-primary" : "bg-slate-700")} onClick={() => setWantsUpfrontPayment(!wantsUpfrontPayment)}>
                                            <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", wantsUpfrontPayment ? "left-7" : "left-1")} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">100% Pre-payment (-10%)</span>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">{translations.promo_code_label}</Label>
                                        <div className="relative">
                                            <Input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="bg-white/5 border-white/10 text-white h-12 rounded-xl" placeholder={translations.promo_code_placeholder} />
                                            {total.isPromoValid && <CheckCircle className="absolute right-4 top-3.5 w-5 h-5 text-green-400" />}
                                        </div>
                                    </div>
                                </div>

                                <Button size="lg" className="w-full py-8 text-xl font-black rounded-2xl shadow-primary/25 shadow-xl" onClick={onOrderNow} disabled={total.base === 0}>
                                    {translations.get_free_consultation}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default PackageBuilder;
