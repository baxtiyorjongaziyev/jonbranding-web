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

    const { label, price, description, subDescription, features, benefits, results, timeline, recommended } = detail;
    const Icon = serviceIcons[id] || Sparkles;
    const isVip = id.toLowerCase().includes('vip');
    const isPremium = id.toLowerCase().includes('premium');
    const isSurcharge = id === 'urgency' || id === 'nda';

    return (
        <Card
            onClick={onSelect}
            className={cn(
                "group relative h-full transition-all duration-500 cursor-pointer overflow-visible border-2 flex flex-col rounded-[2rem] mt-4",
                selected
                    ? (isVip ? 'border-amber-400 bg-blue-950 shadow-[0_20px_50px_rgba(251,191,36,0.25)] scale-[1.01]' : 'border-primary bg-white shadow-xl scale-[1.01]')
                    : (isVip ? 'bg-blue-950 border-blue-900 hover:border-amber-400/50 shadow-md' : 
                       isPremium ? 'bg-gradient-to-br from-white to-blue-50/50 border-slate-100 hover:border-primary/30' : 
                       'bg-white border-slate-100 hover:border-primary/30 hover:shadow-md')
            )}
        >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                {recommended && !isVip && (
                    <Badge className="bg-primary text-white text-[9px] font-bold px-4 py-1 rounded-full border-none uppercase tracking-wider whitespace-nowrap shadow-lg">
                        {dictionary.recommended}
                    </Badge>
                )}
                {isVip && (
                    <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-blue-950 text-[9px] font-black px-5 py-1.5 rounded-full border-none uppercase flex items-center gap-1 shadow-xl whitespace-nowrap">
                        VIP
                    </Badge>
                )}
            </div>

            <CardHeader className="p-4 pb-1 sm:p-5 sm:pb-2">
                <div className="flex items-center gap-3 mb-2 sm:mb-3">
                    <div className={cn(
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 flex-shrink-0",
                        selected 
                            ? (isVip ? "bg-gradient-to-br from-amber-300 to-amber-500 text-blue-950" : "bg-primary text-white shadow-lg") 
                            : (isVip ? "bg-white/10 text-amber-400 border border-amber-400/30" : "bg-secondary text-slate-600")
                    )}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex flex-col">
                        <CardTitle className={cn("text-lg sm:text-xl font-black leading-none tracking-tighter", isVip ? "text-white" : "text-dark-blue")}>
                            {label}
                        </CardTitle>
                        {subDescription && (
                            <span className={cn("text-[8px] sm:text-[9px] font-bold uppercase tracking-wider mt-0.5", isVip ? "text-amber-400/60" : "text-primary/60")}>
                                {subDescription}
                            </span>
                        )}
                        <span className={cn("text-base sm:text-lg font-black mt-0.5", isVip ? "text-amber-400" : "text-primary")}>
                            {isSurcharge ? "+50%" : formatPrice(price, lang, currency)}
                        </span>
                    </div>
                </div>
                {description && (
                    <p className={cn("text-[11px] sm:text-xs leading-tight font-medium", isVip ? "text-blue-100/70" : "text-slate-500")}>
                        {description}
                    </p>
                )}
            </CardHeader>

            <CardContent className="px-4 pt-1 pb-4 sm:px-5 sm:pt-2 sm:pb-5 flex-grow flex flex-col">
                <div className="flex border-b border-slate-100 mb-2 sm:mb-3" onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={() => setActiveTab('included')}
                        className={cn(
                            "flex-1 py-1.5 sm:py-2 text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all",
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
                            "flex-1 py-1.5 sm:py-2 text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all",
                            activeTab === 'benefits' 
                                ? (isVip ? "text-amber-400 border-b-2 border-amber-400" : "text-primary border-b-2 border-primary")
                                : "text-slate-400"
                        )}
                    >
                        {dictionary.tabs?.benefits || "Nima olasiz"}
                    </button>
                </div>

                {activeTab === 'included' ? (
                    <div className="space-y-2 sm:space-y-3 flex-grow">
                        {(results || features) && (
                            <div className="space-y-1.5 sm:space-y-2">
                                <ul className="space-y-1 sm:space-y-1.5">
                                    {(results || features || []).map((r: string, i: number) => (
                                        <li key={i} className="flex items-start gap-1.5 sm:gap-2">
                                            <div className={cn("mt-0.5 shrink-0 rounded-full p-0.5", isVip ? "bg-amber-400/20" : "bg-primary/10")}>
                                                <CheckCircle className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5", isVip ? "text-amber-400" : "text-primary")} />
                                            </div>
                                            <span className={cn("text-[12px] sm:text-[13px] font-normal leading-tight", isVip ? "text-slate-300" : "text-dark-blue")}>{r}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-1.5 sm:gap-2 flex-grow animate-fade-in">
                        {benefits && benefits.map((b: any, i: number) => (
                            <div 
                                key={i} 
                                className={cn(
                                    "p-2 sm:p-3 rounded-xl border flex flex-col gap-0.5 transition-all duration-300",
                                    isVip ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"
                                )}
                            >
                                <span className="text-sm sm:text-base">{b.icon}</span>
                                <div className="space-y-0">
                                    <p className={cn("text-[11px] sm:text-xs font-bold leading-tight", isVip ? "text-white" : "text-dark-blue")}>{b.title}</p>
                                    <p className={cn("text-[9px] sm:text-[10px] leading-tight", isVip ? "text-slate-400" : "text-slate-500")}>{b.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-3 pt-2 sm:mt-4 sm:pt-3 space-y-3">
                    <div className="space-y-1">
                        {timeline && (
                            <div className={cn("flex items-center gap-1.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest", isVip ? "text-amber-400/50" : "text-slate-400")}>
                                <Clock className="w-2.5 h-2.5" />
                                <span>{timeline}</span>
                            </div>
                        )}
                    </div>

                    <Button
                        variant={selected ? "default" : "outline"}
                        className={cn(
                            "w-full py-4 sm:py-5 text-xs sm:text-sm font-bold transition-all duration-500 rounded-full border-2 h-auto",
                            selected 
                                ? (isVip 
                                    ? "border-none bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-blue-950 hover:from-amber-500 shadow-lg" 
                                    : "border-none bg-primary text-white shadow-xl") 
                                : (isVip 
                                    ? "bg-white/5 border-amber-400/30 text-amber-400 hover:bg-amber-400 hover:text-blue-950" 
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
    <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3">
            <div className="h-6 sm:h-8 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
            <h3 className="text-xl sm:text-2xl font-black text-dark-blue tracking-tight uppercase">{title}</h3>
        </div>
        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6", gridCols)}>{children}</div>
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
        <section id="package-builder" className="py-12 sm:py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto mb-12 sm:mb-16 text-center space-y-3 sm:space-y-4">
                    <Badge className="bg-primary/10 text-primary border-none px-5 py-1.5 rounded-full font-black text-[9px] uppercase tracking-[0.25em]">
                        LOYIHA ME'MORI
                    </Badge>
                    <h2 className="text-3xl sm:text-5xl font-black text-dark-blue leading-tight tracking-tighter">{translations.title}</h2>
                    <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto font-medium">{translations.subtitle}</p>
                </div>

                <div className="space-y-16 sm:space-y-24">
                    <ServiceGroup title={translations.categories.tripwire}>{['namingCheck', 'audit', 'consultation'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.strategy} gridCols="lg:grid-cols-2">{['strategy', 'commStrategy'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.naming}>{['namingVIP', 'namingPremium', 'namingStandard'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.identity}>{['logoVIP', 'logoPremium', 'logoStandard'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="more" className="border-none">
                            <AccordionTrigger className="text-lg font-black text-dark-blue justify-center gap-3 hover:no-underline py-8 sm:py-10 bg-slate-50 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-dashed border-slate-200 transition-all hover:bg-slate-100 group shadow-sm">
                                {translations.categories.more_services}
                                <ChevronsDown className="w-5 h-5 text-primary animate-bounce group-hover:text-dark-blue transition-colors" />
                            </AccordionTrigger>
                            <AccordionContent className="pt-10 sm:pt-12 space-y-16 sm:space-y-24">
                                <ServiceGroup title={translations.categories.addons} gridCols="lg:grid-cols-2">
                                    {['packaging', 'smm', 'urgency', 'nda'].map(id => (
                                        <ServiceCard key={id} id={id} selected={selectedServices[id as keyof SelectedServices]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />
                                    ))}
                                </ServiceGroup>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <div className="mt-16 sm:mt-24 max-w-6xl mx-auto">
                    <div id="your-package-card" className="rounded-[2.5rem] sm:rounded-[3rem] bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col lg:flex-row border border-slate-100">
                        <div className="lg:w-1/2 bg-dark-blue p-6 sm:p-12 text-white relative">
                            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="space-y-3 mb-6 sm:mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 shadow-lg">
                                            <Box className="w-6 h-6 text-sky-blue" />
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-black tracking-tighter uppercase text-white">{translations.your_package}</h3>
                                    </div>
                                    <p className="text-blue-100/60 font-medium text-sm sm:text-base max-w-xs">{translations.your_package_desc}</p>
                                </div>
                                <div className="grid grid-cols-1 gap-2.5 sm:gap-3 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                                    {Object.entries(selectedServices).filter(([_,v]) => v).map(([k]) => {
                                        const isSurcharge = k === 'urgency' || k === 'nda';
                                        return (
                                            <div key={k} className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group/item shadow-sm">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={cn("p-1 rounded-full", isSurcharge ? "bg-blue-400/20" : "bg-sky-blue/20")}>
                                                        {isSurcharge ? <Plus className="w-3.5 h-3.5 text-blue-400" /> : <Check className="w-3.5 h-3.5 text-sky-blue" />}
                                                    </div>
                                                    <span className="text-xs sm:text-sm font-extrabold tracking-tight text-white">{serviceDetails[k]?.label}</span>
                                                </div>
                                                <span className={cn("font-black text-[10px] sm:text-xs", isSurcharge ? "text-blue-400" : "text-sky-blue")}>
                                                    {isSurcharge ? "+50%" : formatPrice(serviceDetails[k]?.price || 0, lang as any, currency)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                    {Object.values(selectedServices).every(v => !v) && (
                                        <div className="text-center py-12 sm:py-20 px-6 rounded-[2rem] sm:rounded-[2.5rem] bg-white/5 border-2 border-dashed border-white/10">
                                            <TrendingUp className="w-10 h-10 sm:w-14 h-14 mx-auto text-blue-300/20 mb-4" />
                                            <p className="text-blue-100/40 italic text-base sm:text-lg font-medium">{translations.empty_package_desc}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 bg-slate-50 p-6 sm:p-12 flex flex-col border-l border-slate-100 relative">
                            <div className="space-y-6 sm:space-y-8 flex-grow">
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{translations.base_price_label}</span>
                                        <span className="text-lg sm:text-xl font-bold line-through text-slate-300">{formatPrice(total.base, lang as any, currency)}</span>
                                    </div>

                                    <div className="space-y-2 sm:space-y-3">
                                        {total.surchargesApplied.map((s: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center text-blue-700 text-[10px] sm:text-[11px] font-black bg-blue-50 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-blue-100 shadow-sm">
                                                <div className="flex items-center gap-2 sm:gap-2.5">
                                                    <div className="bg-blue-100 p-1 rounded-full"><Plus className="w-3 h-3" /></div>
                                                    {s.name}
                                                </div>
                                                <span className="text-xs sm:text-sm">+{formatPrice(s.value, lang as any, currency)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2 sm:space-y-3">
                                        {total.discountApplied.map((d: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center text-green-700 text-[10px] sm:text-[11px] font-black bg-green-50 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-green-100 animate-shine shadow-sm">
                                                <div className="flex items-center gap-2 sm:gap-2.5">
                                                    <div className="bg-green-100 p-1 rounded-full"><Zap className="w-3 h-3" /></div>
                                                    {d.name}
                                                </div>
                                                <span className="text-xs sm:text-sm">-{formatPrice(d.value, lang as any, currency)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-6 sm:pt-8 border-t border-slate-200 text-center space-y-1.5 sm:space-y-2">
                                        <span className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.35em]">{translations.final_price}</span>
                                        <div className="flex flex-col items-center">
                                            <span className="text-4xl sm:text-7xl font-black text-primary tracking-tighter drop-shadow-sm">
                                                {formatPrice(total.final, lang as any, currency)}
                                            </span>
                                            {total.savings > 0 && (
                                                <div className="mt-3 sm:mt-4 flex items-center gap-2 text-green-600 font-black text-[10px] sm:text-[11px] bg-green-100/50 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-green-200 shadow-sm">
                                                    <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    JAMI TEJALDI: {formatPrice(total.savings, lang as any, currency)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 sm:space-y-5">
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <Label className="text-[9px] sm:text-[10px] uppercase font-black text-slate-400 tracking-[0.25em] ml-3">{translations.promo_code_label}</Label>
                                        <div className="relative">
                                            <Input 
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                placeholder={translations.promo_code_placeholder}
                                                className="rounded-full py-4 sm:py-5 px-5 border-slate-200 focus:ring-primary h-10 sm:h-12 text-xs sm:text-sm font-bold uppercase tracking-widest bg-white"
                                            />
                                            {total.isPromoApplied && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 animate-fade-in">
                                                    <CheckCircle className="w-4 h-4 sm:w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                        {promoCode && !total.isPromoApplied && (
                                            <p className="text-[8px] sm:text-[9px] text-red-400 font-bold ml-3 uppercase tracking-tighter">{translations.promo_code_invalid}</p>
                                        )}
                                    </div>

                                    {!total.isPromoApplied && (
                                        <div className="space-y-1.5 sm:space-y-2">
                                            <Label className="text-[9px] sm:text-[10px] uppercase font-black text-slate-400 tracking-[0.25em] ml-3">Chegirmalar</Label>
                                            <DynamicToggle 
                                                id="discount-tier"
                                                options={discountOptions}
                                                selected={discountType}
                                                onSelect={(val) => setDiscountType(val as any)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Button size="lg" className="w-full py-6 sm:py-8 text-lg sm:text-xl font-black rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition-all mt-8 sm:mt-10 group border-none" onClick={onOrderNow} disabled={total.base === 0}>
                                <span className="flex items-center gap-2.5">
                                    Loyiha narxini tasdiqlash
                                    <ChevronsDown className="w-5 h-5 sm:w-6 h-6 animate-bounce" />
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