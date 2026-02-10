
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
                "group relative h-full transition-all duration-500 cursor-pointer overflow-visible border-2 flex flex-col rounded-3xl mt-4",
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

            <CardHeader className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 flex-shrink-0",
                        selected 
                            ? (isVip ? "bg-amber-400 text-blue-950 shadow-[0_0_20px_rgba(251,191,36,0.5)]" : "bg-primary text-white shadow-lg") 
                            : (isVip ? "bg-white/10 text-amber-400 border border-amber-400/30" : "bg-secondary text-slate-600")
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className={cn("text-xl font-bold leading-tight", isVip ? "text-white" : "text-dark-blue")}>
                        {label}
                    </CardTitle>
                </div>
                <div className="space-y-2">
                    <span className={cn("text-2xl font-black tracking-tighter block", isVip ? "text-amber-400" : "text-primary")}>
                        {formatPrice(price, lang, currency)}
                    </span>
                    <p className={cn("text-xs leading-relaxed font-medium", isVip ? "text-blue-100/70" : "text-slate-500")}>
                        {description}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="px-6 pt-0 pb-6 flex-grow flex flex-col">
                <div className="space-y-6 flex-grow">
                    {results && (
                        <div className="space-y-3">
                            <p className={cn("text-[9px] font-black uppercase tracking-[0.2em]", isVip ? "text-amber-400/70" : "text-primary/70")}>
                                {dictionary.results}
                            </p>
                            <ul className="space-y-2">
                                {results.map((r: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                        <div className={cn("mt-1 shrink-0 rounded-full p-0.5", isVip ? "bg-amber-400/20" : "bg-primary/10")}>
                                            <CheckCircle className={cn("w-3 h-3", isVip ? "text-amber-400" : "text-primary")} />
                                        </div>
                                        <span className={cn("text-sm font-semibold leading-snug", isVip ? "text-white" : "text-dark-blue")}>{r}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {features && (
                        <div className={cn("space-y-3 border-t pt-4", isVip ? "border-white/10" : "border-slate-100")}>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{dictionary.features}</p>
                            <ul className="space-y-1.5">
                                {features.map((f: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-xs">
                                        <Check className={cn("w-3 h-3 mt-0.5 shrink-0", isVip ? "text-amber-400" : "text-green-500")} />
                                        <span className={isVip ? "text-slate-300" : "text-slate-600"}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-4 space-y-4">
                    <div className="space-y-1.5">
                        {timeline && (
                            <div className={cn("flex items-center gap-2 text-[9px] font-black uppercase tracking-widest", isVip ? "text-amber-400/50" : "text-slate-400")}>
                                <Clock className="w-2.5 h-2.5" />
                                <span>{timeline}</span>
                            </div>
                        )}
                        {note && (
                            <div className={cn("flex items-start gap-2 text-[9px] italic leading-tight", isVip ? "text-blue-300/40" : "text-slate-400")}>
                                <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                                <span>{note}</span>
                            </div>
                        )}
                    </div>

                    <Button
                        className={cn(
                            "w-full py-5 text-sm font-bold transition-all duration-500 rounded-full border-none",
                            selected 
                                ? (isVip 
                                    ? "bg-amber-400 text-blue-950 hover:bg-amber-500 shadow-[0_10px_30px_rgba(251,191,36,0.4)]" 
                                    : "bg-primary text-white shadow-xl") 
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
    <div className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h3 className="text-2xl font-black text-dark-blue tracking-tight">{title}</h3>
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
        return <div className="py-20 min-h-screen bg-white text-center text-gray-400">Yuklanmoqda...</div>;
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
        <section id="package-builder" className="py-16 sm:py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto mb-16 text-center space-y-4">
                    <Badge className="bg-primary/10 text-primary border-none px-4 py-1 rounded-full font-black text-[9px] uppercase tracking-[0.2em]">
                        {translations.categories.tripwire}
                    </Badge>
                    <h2 className="text-4xl sm:text-5xl font-black text-dark-blue leading-tight tracking-tighter">{translations.title}</h2>
                    <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">{translations.subtitle}</p>
                </div>

                <div className="space-y-24">
                    <ServiceGroup title={translations.categories.tripwire}>{['namingCheck', 'audit', 'consultation'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.strategy} gridCols="lg:grid-cols-2">{['strategy', 'commStrategy'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.naming}>{['namingVIP', 'namingPremium', 'namingStandard'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.identity}>{['logoVIP', 'logoPremium', 'logoStandard'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="more" className="border-none">
                            <AccordionTrigger className="text-lg font-black text-dark-blue justify-center gap-3 hover:no-underline py-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 transition-all hover:bg-slate-100 group">
                                {translations.categories.more_services}
                                <ChevronsDown className="w-5 h-5 text-primary animate-bounce group-hover:text-dark-blue transition-colors" />
                            </AccordionTrigger>
                            <AccordionContent className="pt-12 space-y-24">
                                <ServiceGroup title={translations.categories.addons} gridCols="lg:grid-cols-2">
                                    {['packaging', 'smm'].map(id => (
                                        <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />
                                    ))}
                                </ServiceGroup>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* HYBRID SUMMARY CARD */}
                <div className="mt-24 max-w-6xl mx-auto">
                    <div id="your-package-card" className="rounded-[3rem] bg-white shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-200">
                        {/* Left Side: Dark-Blue */}
                        <div className="lg:w-3/5 bg-dark-blue p-8 sm:p-12 text-white relative">
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                            
                            <div className="relative z-10 space-y-8">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                                            <Box className="w-6 h-6 text-sky-blue" />
                                        </div>
                                        <h3 className="text-3xl font-black tracking-tighter uppercase text-white">Sizning paketingiz</h3>
                                    </div>
                                    <p className="text-blue-200/70 font-medium text-base max-w-md">{translations.your_package_desc}</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                    {Object.entries(selectedServices).filter(([_,v]) => v).map(([k]) => (
                                        <div key={k} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group/item">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-sky-blue/20 p-1 rounded-full">
                                                    <Check className="w-3 h-3 text-sky-blue" />
                                                </div>
                                                <span className="text-sm font-bold tracking-tight text-white">{serviceDetails[k as keyof typeof serviceDetails]?.label}</span>
                                            </div>
                                            <span className="text-sky-blue font-black text-xs">{formatPrice(serviceDetails[k as keyof typeof serviceDetails]?.price || 0, lang as any, currency)}</span>
                                        </div>
                                    ))}
                                    {Object.values(selectedServices).every(v => !v) && (
                                        <div className="col-span-2 text-center py-20 px-6 rounded-3xl bg-white/5 border-2 border-dashed border-white/10">
                                            <TrendingUp className="w-12 h-12 mx-auto text-blue-300/30 mb-4" />
                                            <p className="text-blue-200/50 italic text-lg font-medium">{translations.empty_package_desc}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Light */}
                        <div className="lg:w-2/5 bg-slate-50 p-8 sm:p-12 flex flex-col justify-between border-l border-slate-200">
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{translations.base_price_label}</span>
                                        <span className="text-xl font-bold line-through text-slate-300">{formatPrice(total.base, lang as any, currency)}</span>
                                    </div>

                                    <div className="space-y-3">
                                        {total.discountApplied.map((d: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center text-green-700 text-[11px] font-black bg-green-50 px-4 py-3 rounded-2xl border border-green-100 animate-fade-in shadow-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-green-100 p-1 rounded-full"><Zap className="w-3 h-3" /></div>
                                                    {d.name}
                                                </div>
                                                <span className="text-sm">-{formatPrice(d.value, lang as any, currency)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-8 border-t border-slate-200 text-center space-y-2">
                                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">{translations.final_price}</span>
                                        <div className="flex flex-col items-center">
                                            <span className="text-6xl font-black text-primary tracking-tighter">
                                                {formatPrice(total.final, lang as any, currency)}
                                            </span>
                                            {total.savings > 0 && (
                                                <div className="mt-4 flex items-center gap-2 text-green-600 font-black text-[11px] bg-green-100/50 px-4 py-2 rounded-full border border-green-200">
                                                    <Gift className="w-4 h-4" />
                                                    {lang === 'uz' ? 'TEJALDI:' : 'SAVED:'} {formatPrice(total.savings, lang as any, currency)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div 
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2",
                                            wantsUpfrontPayment ? "bg-primary/5 border-primary shadow-md" : "bg-white border-slate-200 hover:border-slate-300"
                                        )}
                                        onClick={() => setWantsUpfrontPayment(!wantsUpfrontPayment)}
                                    >
                                        <div className={cn(
                                            "w-12 h-6 rounded-full relative transition-all duration-500 p-1",
                                            wantsUpfrontPayment ? "bg-primary" : "bg-slate-200"
                                        )}>
                                            <div className={cn(
                                                "w-4 h-4 rounded-full bg-white transition-all duration-500 shadow-sm",
                                                wantsUpfrontPayment ? "translate-x-6" : "translate-x-0"
                                            )} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-dark-blue uppercase tracking-wider">100% Oldindan to'lov</span>
                                            <span className="text-[10px] font-bold text-green-600 uppercase">Extra -10% chegirma</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] ml-2">{translations.promo_code_label}</Label>
                                        <div className="relative">
                                            <Input 
                                                value={promoCode} 
                                                onChange={(e) => setPromoCode(e.target.value)} 
                                                className="bg-white border-slate-200 text-dark-blue h-12 rounded-2xl focus:border-primary focus:ring-primary transition-all font-bold px-4" 
                                                placeholder={translations.promo_code_placeholder} 
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                                                <Sparkles className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button 
                                size="lg" 
                                className="w-full py-8 text-xl font-black rounded-full shadow-2xl hover:scale-[1.02] active:scale-95 transition-all mt-10 group" 
                                onClick={onOrderNow} 
                                disabled={total.base === 0}
                            >
                                <span className="flex items-center gap-2">
                                    To'lov qilishga tayyorman
                                    <ChevronsDown className="w-6 h-6 animate-bounce" />
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
