'use client';

import React, { useState, useEffect, FC } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getServiceDetails, calculatePackagePrice, type SelectedServices, formatPrice } from '@/lib/pricing';
import { Sparkles, CheckCircle, Crown, Check, ChevronsDown, Clock, BrainCircuit, Search, Megaphone, Palette, Box, Type, Layers, ClipboardSignature, Info, Flame, ShieldCheck, AlertCircle, TrendingUp, Gift, Zap } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

    const { label, description, price, features, results, timeline, recommended, note } = detail;
    const Icon = serviceIcons[id] || Sparkles;
    const isVip = id.toLowerCase().includes('vip');

    return (
        <Card
            onClick={onSelect}
            className={cn(
                "group relative h-full transition-all duration-500 cursor-pointer overflow-visible border-2 flex flex-col rounded-[2.5rem] mt-4",
                selected
                    ? (isVip ? 'border-amber-400 bg-blue-950 shadow-[0_20px_50px_rgba(251,191,36,0.3)] scale-[1.02]' : 'border-primary bg-white shadow-2xl scale-[1.02]')
                    : (isVip ? 'bg-blue-950 border-blue-900 hover:border-amber-400/50 shadow-lg' : 'bg-white border-slate-100 hover:border-primary/30 hover:shadow-lg')
            )}
        >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                {recommended && !isVip && (
                    <Badge className="bg-primary text-white text-[10px] font-bold px-4 py-1 rounded-full border-none uppercase tracking-wider whitespace-nowrap shadow-md">
                        {dictionary.recommended}
                    </Badge>
                )}
                {isVip && (
                    <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[10px] font-black px-5 py-1.5 rounded-full border-none uppercase flex items-center gap-1.5 shadow-xl whitespace-nowrap">
                        <Crown className="w-3.5 h-3.5" /> LUX VIP
                    </Badge>
                )}
            </div>

            <CardHeader className="p-8 pb-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 flex-shrink-0",
                        selected 
                            ? (isVip ? "bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.5)]" : "bg-primary text-white shadow-lg") 
                            : (isVip ? "bg-white/10 text-amber-400 border border-amber-400/30" : "bg-secondary text-slate-600")
                    )}>
                        <Icon className="w-7 h-7" />
                    </div>
                    <CardTitle className={cn("text-2xl font-black leading-tight", isVip ? "text-white" : "text-dark-blue")}>
                        {label}
                    </CardTitle>
                </div>
                <div className="space-y-3">
                    <span className={cn("text-3xl font-black tracking-tighter block", isVip ? "text-amber-400" : "text-primary")}>
                        {formatPrice(price, lang, currency)}
                    </span>
                    <p className={cn("text-sm leading-relaxed font-medium", isVip ? "text-blue-200/80" : "text-slate-500")}>
                        {description}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="px-8 pt-0 pb-8 flex-grow flex flex-col">
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
                                            <CheckCircle className={cn("w-3.5 h-3.5", isVip ? "text-amber-400" : "text-primary")} />
                                        </div>
                                        <span className={cn("text-sm font-bold leading-snug", isVip ? "text-white" : "text-dark-blue")}>{r}</span>
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
                                    <li key={i} className="flex items-start gap-2 text-xs">
                                        <Check className={cn("w-3.5 h-3.5 mt-0.5 shrink-0", isVip ? "text-amber-400" : "text-green-500")} />
                                        <span className={isVip ? "text-slate-300" : "text-slate-600"}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 space-y-6">
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
                            "w-full py-6 text-base font-black transition-all duration-500 rounded-full",
                            selected 
                                ? (isVip ? "bg-amber-400 text-black hover:bg-amber-500 border-none shadow-[0_10px_30px_rgba(251,191,36,0.4)] text-black" : "text-white shadow-xl") 
                                : (isVip ? "bg-white/5 border-amber-400/30 text-amber-400 hover:bg-amber-400 hover:text-black" : "border-slate-200 text-slate-600 hover:border-primary hover:text-primary")
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
            <div className="h-10 w-1.5 bg-primary rounded-full" />
            <h3 className="text-3xl font-black text-dark-blue tracking-tight">{title}</h3>
        </div>
        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", gridCols)}>{children}</div>
    </div>
);

const PackageBuilder: FC<PackageBuilderProps> = ({ onOrderNow, lang, dictionary }) => {
    const [selectedServices, setSelectedServices] = useLocalStorage<SelectedServices>('selectedServices', { audit: false, namingCheck: false, consultation: false, strategy: false, commStrategy: false, namingVIP: false, namingPremium: false, namingStandard: false, logoVIP: false, logoPremium: false, logoStandard: false, packaging: false, smm: false });
    const [wantsUpfrontPayment, setWantsUpfrontPayment] = useLocalStorage<boolean>('wantsUpfrontPayment', false);
    const [promoCode, setPromoCode] = useState('');
    const [currency] = useLocalStorage<'uzs' | 'usd'>('currency', 'usd');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => { setIsClient(true); }, []);
    
    if (!isClient || !dictionary || !dictionary.servicesPage?.packageBuilder) {
        return <div className="py-20 min-h-screen bg-white text-center text-gray-400">Ko'rinmayapti hech narsa</div>;
    }

    const translations = dictionary.servicesPage.packageBuilder;
    const serviceDetails = getServiceDetails(lang as any);
    const total = calculatePackagePrice({ selectedServices, wantsUpfrontPayment, promoCode }, lang as any);

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

    return (
        <section id="package-builder" className="py-20 sm:py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto mb-24 text-center space-y-6">
                    <Badge className="bg-primary/10 text-primary border-none px-5 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.25em]">
                        {translations.categories.tripwire}
                    </Badge>
                    <h2 className="text-5xl sm:text-6xl font-black text-dark-blue leading-[1] tracking-tighter">{translations.title}</h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">{translations.subtitle}</p>
                </div>

                <div className="space-y-32">
                    <ServiceGroup title={translations.categories.tripwire}>{['namingCheck', 'audit', 'consultation'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.strategy} gridCols="lg:grid-cols-2">{['strategy', 'commStrategy'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.naming}>{['namingVIP', 'namingPremium', 'namingStandard'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.identity}>{['logoVIP', 'logoPremium', 'logoStandard'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="more" className="border-none">
                            <AccordionTrigger className="text-xl font-black text-dark-blue justify-center gap-4 hover:no-underline py-12 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 transition-all hover:bg-slate-100 group">
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

                {/* MODERNISED SUMMARY CARD */}
                <div className="mt-32 max-w-6xl mx-auto">
                    <div id="your-package-card" className="relative group p-1 rounded-[4rem] bg-gradient-to-br from-blue-400 via-primary to-dark-blue shadow-[0_50px_100px_-20px_rgba(5,5,131,0.5)] transition-all duration-700 hover:scale-[1.01]">
                        <Card className="p-8 sm:p-16 rounded-[3.8rem] bg-[#02024d]/95 backdrop-blur-3xl text-white border-none overflow-hidden relative">
                            {/* Abstract Glow Elements */}
                            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse" />
                            
                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
                                {/* Left: Selection Details */}
                                <div className="lg:col-span-3 space-y-12">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-accent/20 p-2 rounded-xl">
                                                <Box className="w-6 h-6 text-accent" />
                                            </div>
                                            <h3 className="text-4xl font-black tracking-tighter uppercase">{translations.your_package}</h3>
                                        </div>
                                        <p className="text-blue-200/50 font-medium text-lg max-w-md">{translations.your_package_desc}</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                        {Object.entries(selectedServices).filter(([_,v]) => v).map(([k]) => (
                                            <div key={k} className="group/item flex items-center justify-between p-5 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-accent/30 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-accent/10 p-1.5 rounded-full group-hover/item:bg-accent/20 transition-colors">
                                                        <Check className="w-3.5 h-3.5 text-accent" />
                                                    </div>
                                                    <span className="text-sm font-bold tracking-tight">{serviceDetails[k as keyof typeof serviceDetails]?.label}</span>
                                                </div>
                                                <span className="text-accent/80 font-black text-xs">{formatPrice(serviceDetails[k as keyof typeof serviceDetails]?.price || 0, lang as any, currency)}</span>
                                            </div>
                                        ))}
                                        {Object.values(selectedServices).every(v => !v) && (
                                            <div className="col-span-2 text-center py-20 px-6 rounded-[3rem] bg-white/5 border-2 border-dashed border-white/10">
                                                <TrendingUp className="w-12 h-12 mx-auto text-blue-300/20 mb-4" />
                                                <p className="text-blue-200/30 italic text-xl font-medium">{translations.empty_package_desc}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Calculations & CTA */}
                                <div className="lg:col-span-2 space-y-8 flex flex-col">
                                    <div className="flex-grow space-y-8 bg-gradient-to-b from-white/10 to-transparent p-8 sm:p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center text-blue-200/60">
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{translations.base_price_label}</span>
                                                <span className="text-xl font-bold line-through opacity-50">{formatPrice(total.base, lang as any, currency)}</span>
                                            </div>

                                            <div className="space-y-3">
                                                {total.discountApplied.map((d: any, i: number) => (
                                                    <div key={i} className="flex justify-between items-center text-green-400 text-[11px] font-black bg-green-400/10 px-5 py-3.5 rounded-2xl border border-green-400/20 animate-in fade-in slide-in-from-right-4 duration-500">
                                                        <div className="flex items-center gap-2">
                                                            <div className="bg-green-400/20 p-1 rounded-md"><Zap className="w-3 h-3" /></div>
                                                            {d.name}
                                                        </div>
                                                        <span className="text-sm">-{formatPrice(d.value, lang as any, currency)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="pt-8 border-t border-white/10 space-y-2 text-center">
                                                <span className="text-blue-200/40 text-[10px] font-black uppercase tracking-[0.4em]">{translations.final_price}</span>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-7xl sm:text-8xl font-black text-ocean-blue tracking-tighter drop-shadow-[0_0_30px_rgba(0,201,253,0.4)]">
                                                        {formatPrice(total.final, lang as any, currency)}
                                                    </span>
                                                    <div className="mt-4 flex items-center gap-2 text-green-400 font-black text-xs bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20">
                                                        <Gift className="w-4 h-4" />
                                                        {lang === 'uz' ? 'JAMI TEJALDI:' : 'TOTAL SAVED:'} {formatPrice(total.savings, lang as any, currency)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6 pt-4">
                                            {/* Modern Toggle */}
                                            <div 
                                                className="group/toggle flex items-center gap-5 p-6 rounded-[2.5rem] bg-white/5 border border-white/10 cursor-pointer transition-all hover:bg-white/10 hover:border-accent/50"
                                                onClick={() => setWantsUpfrontPayment(!wantsUpfrontPayment)}
                                            >
                                                <div className={cn(
                                                    "w-16 h-8 rounded-full relative transition-all duration-500 p-1",
                                                    wantsUpfrontPayment ? "bg-accent shadow-[0_0_25px_rgba(0,201,253,0.6)]" : "bg-slate-800"
                                                )}>
                                                    <div className={cn(
                                                        "w-6 h-6 rounded-full bg-white transition-all duration-500 shadow-xl flex items-center justify-center",
                                                        wantsUpfrontPayment ? "translate-x-8" : "translate-x-0"
                                                    )}>
                                                        {wantsUpfrontPayment && <Check className="w-4 h-4 text-accent" />}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs font-black text-white uppercase tracking-widest group-hover/toggle:text-accent transition-colors">100% Oldindan to'lov</span>
                                                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-tighter">Ekstra -10% chegirma</span>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-[10px] uppercase font-black text-blue-300/50 tracking-[0.3em] ml-4">{translations.promo_code_label}</Label>
                                                <div className="relative">
                                                    <Input 
                                                        value={promoCode} 
                                                        onChange={(e) => setPromoCode(e.target.value)} 
                                                        className="bg-white/5 border-white/10 text-white h-16 rounded-[2rem] focus:border-accent focus:ring-accent transition-all text-xl font-black px-8 placeholder:text-blue-200/10" 
                                                        placeholder={translations.promo_code_placeholder} 
                                                    />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-200/20">
                                                        <Gift className="w-6 h-6" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button 
                                        size="lg" 
                                        variant="default" 
                                        className="w-full py-10 text-2xl font-black rounded-full shadow-[0_20px_40px_-10px_rgba(0,201,253,0.5)] hover:scale-[1.02] active:scale-95 transition-all text-white border-none group" 
                                        onClick={onOrderNow} 
                                        disabled={total.base === 0}
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            {translations.get_free_consultation}
                                            <ChevronsDown className="w-6 h-6 animate-bounce" />
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PackageBuilder;