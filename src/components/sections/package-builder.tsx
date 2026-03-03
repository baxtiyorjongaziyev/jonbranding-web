'use client';

import React, { useState, useEffect, FC } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getServiceDetails, calculatePackagePrice, type SelectedServices, formatPrice } from '@/lib/pricing';
import { Sparkles, CheckCircle, Crown, Check, ChevronsDown, Clock, BrainCircuit, Search, Megaphone, Palette, Box, Type, Layers, ClipboardSignature, Info, Flame, ShieldCheck, TrendingUp, Zap, Gift, Plus } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import DynamicToggle from '@/components/ui/dynamic-toggle';

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

const ServiceCard = ({ id, onSelect, selected, lang, dictionary, currency }: { id: string, onSelect: () => void, selected: boolean, lang: any, dictionary: any, currency: any }) => {
    const [activeTab, setActiveTab] = useState<'included' | 'benefits'>('included');
    const serviceDetails = getServiceDetails(lang) as any;
    const detail = serviceDetails[id];
    if (!detail) return null;

    const { label, price, subDescription, features, benefits, timeline, recommended } = detail;
    const Icon = serviceIcons[id] || Sparkles;
    const isVip = id.toLowerCase().includes('vip');
    const isPremium = id.toLowerCase().includes('premium');
    const isSurcharge = id === 'urgency' || id === 'nda';

    return (
        <Card
            onClick={onSelect}
            className={cn(
                "group relative h-full transition-all duration-300 cursor-pointer overflow-visible border flex flex-col rounded-[1.2rem] mt-2",
                selected
                    ? (isVip ? 'border-amber-400 bg-blue-950 shadow-xl scale-[1.01]' : 'border-primary bg-white shadow-lg scale-[1.01]')
                    : (isVip ? 'bg-blue-950 border-blue-900/50 hover:border-amber-400/50' : 
                       isPremium ? 'bg-gradient-to-br from-white to-blue-50/20 border-slate-100 hover:border-primary/20' : 
                       'bg-white border-slate-100 hover:border-primary/20 hover:shadow-md')
            )}
        >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
                {recommended && !isVip && (
                    <Badge className="bg-primary text-white text-[7px] font-bold px-3 py-0.5 rounded-full border-none uppercase tracking-wider whitespace-nowrap shadow-md">
                        {dictionary.recommended}
                    </Badge>
                )}
                {isVip && (
                    <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-blue-950 text-[7px] font-black px-4 py-0.5 rounded-full border-none uppercase flex items-center gap-1 shadow-md whitespace-nowrap">
                        VIP
                    </Badge>
                )}
            </div>

            <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2 mb-2">
                    <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 flex-shrink-0",
                        selected 
                            ? (isVip ? "bg-gradient-to-br from-amber-300 to-amber-500 text-blue-950" : "bg-primary text-white shadow-md") 
                            : (isVip ? "bg-white/10 text-amber-400 border border-amber-400/20" : "bg-secondary text-slate-600")
                    )}>
                        <Icon className="w-4 h-4" />
                    </div>
                    <CardTitle className={cn("text-sm font-black leading-tight tracking-tight truncate", isVip ? "text-white" : "text-dark-blue")}>
                        {label}
                    </CardTitle>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                    <span className={cn("text-xs font-black whitespace-nowrap", isVip ? "text-amber-400" : "text-primary")}>
                        {isSurcharge ? "+50%" : formatPrice(price, lang, currency)}
                    </span>
                    {subDescription && (
                        <>
                            <div className={cn("h-3 w-px mx-1", isVip ? "bg-white/20" : "bg-slate-200")} />
                            <span className={cn("text-[9px] font-bold leading-tight line-clamp-1", isVip ? "text-slate-400" : "text-slate-500")}>
                                {subDescription}
                            </span>
                        </>
                    )}
                </div>
            </CardHeader>

            <CardContent className="px-4 pt-0 pb-4 flex-grow flex flex-col" suppressHydrationWarning>
                <div className="flex border-b border-slate-100 mb-3" onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={() => setActiveTab('included')}
                        className={cn(
                            "flex-1 py-2 text-[8px] font-black uppercase tracking-widest transition-all",
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
                            "flex-1 py-2 text-[8px] font-black uppercase tracking-widest transition-all",
                            activeTab === 'benefits' 
                                ? (isVip ? "text-amber-400 border-b-2 border-amber-400" : "text-primary border-b-2 border-primary")
                                : "text-slate-400"
                        )}
                    >
                        {dictionary.tabs?.benefits || "Nima olasiz"}
                    </button>
                </div>

                {activeTab === 'included' ? (
                    <div className="space-y-1.5 flex-grow animate-fade-in">
                        <ul className="space-y-1.5">
                            {(features || []).map((r: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                    <div className={cn("mt-1 shrink-0 rounded-full p-0.5", isVip ? "bg-amber-400/20" : "bg-primary/10")}>
                                        <CheckCircle className={cn("w-2 h-2", isVip ? "text-amber-400" : "text-primary")} />
                                    </div>
                                    <span className={cn("text-[10px] font-normal leading-tight", isVip ? "text-slate-300" : "text-dark-blue")}>{r}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-2 flex-grow animate-fade-in">
                        {(benefits || []).map((b: any, i: number) => (
                            <div 
                                key={i} 
                                className={cn(
                                    "p-2 rounded-xl border flex items-center gap-3",
                                    isVip ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"
                                )}
                            >
                                <span className="text-sm shrink-0">{b.icon}</span>
                                <div className="space-y-0 min-w-0">
                                    <p className={cn("text-[9px] font-bold leading-tight truncate", isVip ? "text-white" : "text-dark-blue")}>{b.title}</p>
                                    <p className={cn("text-[8px] leading-tight text-slate-500 line-clamp-1", isVip && "text-slate-400")}>{b.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                    {timeline && (
                        <div className={cn("flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest", isVip ? "text-amber-400/50" : "text-slate-400")}>
                            <Clock className="w-3 h-3" />
                            <span>{timeline}</span>
                        </div>
                    )}

                    <Button
                        variant={selected ? "default" : "outline"}
                        className={cn(
                            "w-full py-3 text-[9px] font-bold transition-all duration-300 rounded-full border-2 h-auto uppercase tracking-wider",
                            selected 
                                ? (isVip 
                                    ? "border-none bg-gradient-to-br from-amber-400 to-amber-600 text-blue-950" 
                                    : "border-none bg-primary text-white shadow-md") 
                                : (isVip 
                                    ? "bg-white/5 border-amber-400/20 text-amber-400 hover:bg-amber-400 hover:text-blue-950" 
                                    : "bg-white border-slate-200 text-slate-600 hover:border-primary hover:text-primary")
                        )}
                        onClick={(e) => { e.stopPropagation(); onSelect(); }}
                    >
                        {selected ? dictionary.selected : dictionary.select}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const ServiceGroup = ({ title, children, gridCols = "lg:grid-cols-3" }: { title: string, children: React.ReactNode, gridCols?: string }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-3 px-1">
            <div className="h-5 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
            <h3 className="text-sm sm:text-base font-black text-dark-blue tracking-tight uppercase">{title}</h3>
        </div>
        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", gridCols)}>{children}</div>
    </div>
);

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
            if (namingGroup.includes(id)) namingGroup.forEach(k => { if (k !== id) newState[k] = false; });
            if (logoGroup.includes(id)) logoGroup.forEach(k => { if (k !== id) newState[k] = false; });
            newState[id] = !prev[id];
            return newState;
        });
    };

    const discountOptions = [
        { value: 'none', label: translations.discountSelector.none },
        { value: 'package', label: translations.discountSelector.package },
        { value: 'full', label: translations.discountSelector.full }
    ];

    return (
        <section id="package-builder" className="py-12 bg-white overflow-hidden" suppressHydrationWarning>
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="max-w-4xl mx-auto mb-10 text-center space-y-2">
                    <Badge className="bg-primary/10 text-primary border-none px-5 py-1 rounded-full font-black text-[8px] uppercase tracking-[0.25em]">
                        LOYIHA ME'MORI
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl font-black text-dark-blue leading-tight tracking-tighter">{translations.title}</h2>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-medium">{translations.subtitle}</p>
                </div>

                <div className="space-y-12">
                    <ServiceGroup title={translations.categories.tripwire}>{['namingCheck', 'audit', 'consultation'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.strategy} gridCols="lg:grid-cols-2">{['strategy', 'commStrategy'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.naming}>{['namingVIP', 'namingPremium', 'namingStandard'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.identity}>{['logoVIP', 'logoPremium', 'logoStandard'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="more" className="border-none">
                            <AccordionTrigger className="text-[11px] font-black text-dark-blue justify-center gap-4 hover:no-underline py-4 bg-slate-50 rounded-[1.5rem] border border-dashed border-slate-200 transition-all hover:bg-slate-100 group">
                                {translations.categories.more_services}
                                <ChevronsDown className="w-4 h-4 text-primary animate-bounce" />
                            </AccordionTrigger>
                            <AccordionContent className="pt-8 space-y-12">
                                <ServiceGroup title={translations.categories.addons} gridCols="lg:grid-cols-2">
                                    {['packaging', 'smm', 'urgency', 'nda'].map(id => (
                                        <ServiceCard key={id} id={id} selected={selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />
                                    ))}
                                </ServiceGroup>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <div className="mt-16 max-w-6xl mx-auto">
                    <div id="your-package-card" className="rounded-[2rem] bg-white shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-100">
                        <div className="lg:w-1/2 bg-dark-blue p-8 sm:p-10 text-white relative">
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-84 bg-primary/25 rounded-full blur-[100px]" />
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="space-y-2 mb-6 sm:mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                                            <Box className="w-5 h-5 text-sky-blue" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-black tracking-tight uppercase text-white">{translations.your_package}</h3>
                                    </div>
                                    <p className="text-blue-100/70 font-medium text-xs sm:text-sm max-w-xs">{translations.your_package_desc}</p>
                                </div>
                                <div className="grid grid-cols-1 gap-2.5 overflow-y-auto pr-3 custom-scrollbar flex-grow max-h-[300px]">
                                    {Object.entries(selectedServices).filter(([_,v]) => v).map(([k]) => {
                                        const isSurcharge = k === 'urgency' || k === 'nda';
                                        return (
                                            <div key={k} className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("p-1.5 rounded-full", isSurcharge ? "bg-blue-400/20" : "bg-sky-blue/20")}>
                                                        {isSurcharge ? <Plus className="w-3 h-3 text-blue-400" /> : <Check className="w-3 h-3 text-sky-blue" />}
                                                    </div>
                                                    <span className="text-xs sm:text-sm font-extrabold tracking-tight text-white">{serviceDetails[k]?.label}</span>
                                                </div>
                                                <span className={cn("font-black text-[10px] sm:text-[11px]", isSurcharge ? "text-blue-400" : "text-sky-blue")}>
                                                    {isSurcharge ? "+50%" : formatPrice(serviceDetails[k]?.price || 0, lang as any, currency)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                    {Object.values(selectedServices).every(v => !v) && (
                                        <div className="text-center py-12 px-6 rounded-[1.5rem] bg-white/5 border-2 border-dashed border-white/10">
                                            <TrendingUp className="w-10 h-10 mx-auto text-blue-300/25 mb-3" />
                                            <p className="text-blue-100/50 italic text-sm font-medium">{translations.empty_package_desc}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 bg-slate-50 p-8 sm:p-10 flex flex-col border-l border-slate-100 relative">
                            <div className="space-y-6 sm:space-y-8 flex-grow">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-[8px] font-black uppercase tracking-[0.25em] text-slate-400">{translations.base_price_label}</span>
                                        <span className="text-base sm:text-lg font-bold line-through text-slate-300">{formatPrice(total.base, lang as any, currency)}</span>
                                    </div>

                                    <div className="space-y-2">
                                        {total.surchargesApplied.map((s: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center text-blue-700 text-[10px] font-black bg-blue-50 px-4 py-2.5 rounded-xl border border-blue-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-blue-100 p-1 rounded-full"><Plus className="w-2.5 h-2.5" /></div>
                                                    {s.name}
                                                </div>
                                                <span className="text-sm">+{formatPrice(s.value, lang as any, currency)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        {total.discountApplied.map((d: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center text-green-700 text-[10px] font-black bg-green-50 px-4 py-2.5 rounded-xl border border-green-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-green-100 p-1 rounded-full"><Zap className="w-2.5 h-2.5" /></div>
                                                    {d.name}
                                                </div>
                                                <span className="text-sm">-{formatPrice(d.value, lang as any, currency)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-5 border-t border-slate-200 text-center space-y-1">
                                        <span className="text-slate-400 text-[8px] font-black uppercase tracking-[0.35em]">{translations.final_price}</span>
                                        <div className="flex flex-col items-center">
                                            <span className="text-4xl sm:text-5xl font-black text-primary tracking-tighter drop-shadow-md">
                                                {formatPrice(total.final, lang as any, currency)}
                                            </span>
                                            {total.savings > 0 && (
                                                <div className="mt-3 flex items-center gap-1.5 text-green-600 font-black text-[9px] bg-green-100/60 px-4 py-1 rounded-full border border-green-200">
                                                    <Gift className="w-3 h-3" />
                                                    JAMI TEJALDI: {formatPrice(total.savings, lang as any, currency)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[8px] uppercase font-black text-slate-400 tracking-[0.25em] ml-3">{translations.promo_code_label}</Label>
                                        <div className="relative">
                                            <Input 
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                placeholder={translations.promo_code_placeholder}
                                                className="rounded-full py-2.5 px-5 border-slate-200 h-11 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest bg-white focus:ring-primary shadow-sm"
                                            />
                                            {total.isPromoApplied && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                                                    <CheckCircle className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {!total.isPromoApplied && (
                                        <div className="space-y-2">
                                            <Label className="text-[8px] uppercase font-black text-slate-400 tracking-[0.25em] ml-3">Chegirmalar</Label>
                                            <DynamicToggle 
                                                id="discount-tier"
                                                options={discountOptions}
                                                selected={discountType}
                                                onSelect={(val) => setDiscountType(val as any)}
                                                className="h-11"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Button size="lg" className="w-full py-5 text-base sm:text-lg font-black rounded-full shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-8 border-none" onClick={onOrderNow} disabled={total.base === 0}>
                                <span className="flex items-center gap-3">
                                    Loyiha narxini tasdiqlash
                                    <ChevronsDown className="w-4 h-4 animate-bounce" />
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
