
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
import { Sparkles, CheckCircle, Crown, Check, ChevronsDown, Clock, BrainCircuit, Search, Megaphone, Palette, Box, Type, Layers, ClipboardSignature, Info, Flame, ShieldCheck, AlertCircle, TrendingUp, Zap, Gift, Moon } from 'lucide-react';
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
    const serviceDetails = getServiceDetails(lang);
    const detail = serviceDetails[id as keyof typeof serviceDetails];
    if (!detail) return null;

    const { label, price, description, features, results, timeline, recommended, note } = detail;
    const Icon = serviceIcons[id] || Sparkles;
    const isVip = id.toLowerCase().includes('vip');

    return (
        <Card
            onClick={onSelect}
            className={cn(
                "group relative h-full transition-all duration-500 cursor-pointer overflow-visible border-2 flex flex-col rounded-[2.5rem] mt-6",
                selected
                    ? (isVip ? 'border-amber-400 bg-blue-950 shadow-[0_25px_60px_rgba(251,191,36,0.3)] scale-[1.02]' : 'border-primary bg-white shadow-2xl scale-[1.02]')
                    : (isVip ? 'bg-blue-950 border-blue-900 hover:border-amber-400/50 shadow-lg' : 'bg-white border-slate-100 hover:border-primary/30 hover:shadow-lg')
            )}
        >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                {recommended && !isVip && (
                    <Badge className="bg-primary text-white text-[10px] font-bold px-5 py-1.5 rounded-full border-none uppercase tracking-wider whitespace-nowrap shadow-xl">
                        {dictionary.recommended}
                    </Badge>
                )}
                {isVip && (
                    <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-blue-950 text-[10px] font-black px-6 py-2 rounded-full border-none uppercase flex items-center gap-1.5 shadow-2xl whitespace-nowrap">
                        <Crown className="w-4 h-4" /> LUX VIP
                    </Badge>
                )}
            </div>

            <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-4 mb-6">
                    <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 flex-shrink-0",
                        selected 
                            ? (isVip ? "bg-amber-400 text-blue-950" : "bg-primary text-white shadow-xl") 
                            : (isVip ? "bg-white/10 text-amber-400 border border-amber-400/30" : "bg-secondary text-slate-600")
                    )}>
                        <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex flex-col">
                        <CardTitle className={cn("text-2xl font-black leading-tight tracking-tighter", isVip ? "text-white" : "text-dark-blue")}>
                            {label}
                        </CardTitle>
                        <span className={cn("text-xl font-black mt-1", isVip ? "text-amber-400" : "text-primary")}>
                            {formatPrice(price, lang, currency)}
                        </span>
                    </div>
                </div>
                <p className={cn("text-sm leading-relaxed font-medium", isVip ? "text-blue-100/70" : "text-slate-500")}>
                    {description}
                </p>
            </CardHeader>

            <CardContent className="px-8 pt-4 pb-8 flex-grow flex flex-col">
                <div className="space-y-8 flex-grow">
                    {results && (
                        <div className="space-y-4">
                            <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isVip ? "text-amber-400/70" : "text-primary/70")}>
                                {dictionary.results}
                            </p>
                            <ul className="space-y-3">
                                {results.map((r: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className={cn("mt-1 shrink-0 rounded-full p-0.5", isVip ? "bg-amber-400/20" : "bg-primary/10")}>
                                            <CheckCircle className={cn("w-4 h-4", isVip ? "text-amber-400" : "text-primary")} />
                                        </div>
                                        <span className={cn("text-base font-bold leading-tight", isVip ? "text-white" : "text-dark-blue")}>{r}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {features && (
                        <div className={cn("space-y-4 border-t pt-6", isVip ? "border-white/10" : "border-slate-100")}>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{dictionary.features}</p>
                            <ul className="space-y-2">
                                {features.map((f: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm">
                                        <Check className={cn("w-4 h-4 mt-0.5 shrink-0", isVip ? "text-amber-400" : "text-green-500")} />
                                        <span className={isVip ? "text-slate-300" : "text-slate-600"}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 space-y-5">
                    <div className="space-y-2">
                        {timeline && (
                            <div className={cn("flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", isVip ? "text-amber-400/50" : "text-slate-400")}>
                                <Clock className="w-3 h-3" />
                                <span>{timeline}</span>
                            </div>
                        )}
                        {note && (
                            <div className={cn("flex items-start gap-2 text-[10px] italic leading-tight", isVip ? "text-blue-300/40" : "text-slate-400")}>
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                <span>{note}</span>
                            </div>
                        )}
                    </div>

                    <Button
                        variant={selected ? "default" : "outline"}
                        className={cn(
                            "w-full py-6 text-base font-bold transition-all duration-500 rounded-full border-none",
                            selected 
                                ? (isVip 
                                    ? "bg-amber-400 text-blue-950 hover:bg-amber-500 shadow-[0_15px_40px_rgba(251,191,36,0.5)]" 
                                    : "bg-primary text-white shadow-2xl") 
                                : (isVip 
                                    ? "bg-white/5 border border-amber-400/30 text-amber-400 hover:bg-amber-400 hover:text-blue-950" 
                                    : "bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary")
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
    <div className="space-y-8">
        <div className="flex items-center gap-4">
            <div className="h-10 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
            <h3 className="text-3xl font-black text-dark-blue tracking-tight uppercase">{title}</h3>
        </div>
        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-8", gridCols)}>{children}</div>
    </div>
);

const PackageBuilder: FC<PackageBuilderProps> = ({ onOrderNow, lang, dictionary }) => {
    const [selectedServices, setSelectedServices] = useLocalStorage<SelectedServices>('selectedServices', { 
        namingPremium: true, logoPremium: true
    });
    const [discountType, setDiscountType] = useLocalStorage<'none' | 'package' | 'full'>('discountOption', 'none');
    const [promoCode, setPromoCode] = useLocalStorage<string>('promoCode', '');
    const [currency] = useLocalStorage<'uzs' | 'usd'>('currency', 'usd');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => { setIsClient(true); }, []);
    if (!isClient || !dictionary || !dictionary.servicesPage?.packageBuilder) return null;

    const translations = dictionary.servicesPage.packageBuilder;
    const serviceDetails = getServiceDetails(lang as any);
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
        <section id="package-builder" className="py-20 sm:py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto mb-20 text-center space-y-6">
                    <Badge className="bg-primary/10 text-primary border-none px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.3em]">
                        {translations.categories.tripwire}
                    </Badge>
                    <h2 className="text-5xl sm:text-6xl font-black text-dark-blue leading-tight tracking-tighter">{translations.title}</h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">{translations.subtitle}</p>
                </div>

                <div className="space-y-32">
                    <ServiceGroup title={translations.categories.tripwire}>{['namingCheck', 'audit', 'consultation'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.strategy} gridCols="lg:grid-cols-2">{['strategy', 'commStrategy'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.naming}>{['namingVIP', 'namingPremium', 'namingStandard'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.identity}>{['logoVIP', 'logoPremium', 'logoStandard'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="more" className="border-none">
                            <AccordionTrigger className="text-xl font-black text-dark-blue justify-center gap-4 hover:no-underline py-12 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 transition-all hover:bg-slate-100 group shadow-sm">
                                {translations.categories.more_services}
                                <ChevronsDown className="w-6 h-6 text-primary animate-bounce group-hover:text-dark-blue transition-colors" />
                            </AccordionTrigger>
                            <AccordionContent className="pt-16 space-y-32">
                                <ServiceGroup title={translations.categories.addons} gridCols="lg:grid-cols-2">
                                    {['packaging', 'smm'].map(id => (
                                        <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />
                                    ))}
                                </ServiceGroup>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <div className="mt-32 max-w-6xl mx-auto">
                    <div id="your-package-card" className="rounded-[4rem] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col lg:flex-row border border-slate-100">
                        <div className="lg:w-1/2 bg-dark-blue p-10 sm:p-16 text-white relative">
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
                            <div className="relative z-10 space-y-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/10 p-3 rounded-2xl border border-white/10 shadow-lg">
                                            <Box className="w-8 h-8 text-sky-blue" />
                                        </div>
                                        <h3 className="text-3xl font-black tracking-tighter uppercase text-white">{translations.your_package}</h3>
                                    </div>
                                    <p className="text-blue-100/60 font-medium text-lg max-w-sm">{translations.your_package_desc}</p>
                                </div>
                                <div className="grid grid-cols-1 gap-4 max-h-[450px] overflow-y-auto pr-6 custom-scrollbar">
                                    {Object.entries(selectedServices).filter(([_,v]) => v).map(([k]) => (
                                        <div key={k} className="flex items-center justify-between p-5 rounded-[1.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group/item shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-sky-blue/20 p-1.5 rounded-full">
                                                    <Check className="w-4 h-4 text-sky-blue" />
                                                </div>
                                                <span className="text-base font-extrabold tracking-tight text-white">{serviceDetails[k as keyof typeof serviceDetails]?.label}</span>
                                            </div>
                                            <span className="text-sky-blue font-black text-sm">{formatPrice(serviceDetails[k as keyof typeof serviceDetails]?.price || 0, lang as any, currency)}</span>
                                        </div>
                                    ))}
                                    {Object.values(selectedServices).every(v => !v) && (
                                        <div className="text-center py-24 px-8 rounded-[3rem] bg-white/5 border-2 border-dashed border-white/10">
                                            <TrendingUp className="w-16 h-16 mx-auto text-blue-300/20 mb-6" />
                                            <p className="text-blue-100/40 italic text-xl font-medium">{translations.empty_package_desc}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 bg-slate-50 p-10 sm:p-16 flex flex-col justify-between border-l border-slate-100 relative">
                            <div className="space-y-10">
                                <div className="space-y-8">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">{translations.base_price_label}</span>
                                        <span className="text-2xl font-bold line-through text-slate-300">{formatPrice(total.base, lang as any, currency)}</span>
                                    </div>
                                    <div className="space-y-4">
                                        {total.discountApplied.map((d: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center text-green-700 text-[12px] font-black bg-green-50 px-6 py-4 rounded-[1.5rem] border border-green-100 animate-fade-in shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-green-100 p-1.5 rounded-full"><Zap className="w-4 h-4" /></div>
                                                    {d.name}
                                                </div>
                                                <span className="text-base">-{formatPrice(d.value, lang as any, currency)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-10 border-t border-slate-200 text-center space-y-3">
                                        <span className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em]">{translations.final_price}</span>
                                        <div className="flex flex-col items-center">
                                            <span className="text-7xl sm:text-8xl font-black text-primary tracking-tighter drop-shadow-sm">
                                                {formatPrice(total.final, lang as any, currency)}
                                            </span>
                                            {total.savings > 0 && (
                                                <div className="mt-6 flex items-center gap-3 text-green-600 font-black text-[12px] bg-green-100/50 px-6 py-3 rounded-full border border-green-200 shadow-sm">
                                                    <Gift className="w-5 h-5" />
                                                    JAMI TEJALDI: {formatPrice(total.savings, lang as any, currency)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-[11px] uppercase font-black text-slate-400 tracking-[0.3em] ml-4">Promokod</Label>
                                        <div className="relative">
                                            <Input 
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                placeholder={translations.promo_code_placeholder}
                                                className="rounded-full py-6 px-6 border-slate-200 focus:ring-primary h-14 text-base font-bold uppercase tracking-widest bg-white"
                                            />
                                            {total.isPromoApplied && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 animate-fade-in">
                                                    <CheckCircle className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        {promoCode && !total.isPromoApplied && (
                                            <p className="text-[10px] text-red-400 font-bold ml-4 uppercase tracking-tighter">{translations.promo_code_invalid}</p>
                                        )}
                                    </div>

                                    {!total.isPromoApplied && (
                                        <div className="space-y-3">
                                            <Label className="text-[11px] uppercase font-black text-slate-400 tracking-[0.3em] ml-4">Chegirmalar</Label>
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
                            <Button size="lg" className="w-full py-10 text-2xl font-black rounded-full shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:scale-[1.03] active:scale-95 transition-all mt-14 group border-none" onClick={onOrderNow} disabled={total.base === 0}>
                                <span className="flex items-center gap-3">
                                    Loyiha narxini tasdiqlash
                                    <ChevronsDown className="w-8 h-8 animate-bounce" />
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
