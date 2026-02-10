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
import { Sparkles, CheckCircle, Crown, Check, ChevronsDown, Clock, BrainCircuit, Search, Megaphone, Palette, Box, Type, Layers, ClipboardSignature, Info, Flame, ShieldCheck, AlertCircle, TrendingUp } from 'lucide-react';
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
                "group relative h-full transition-all duration-500 cursor-pointer overflow-hidden border-2 flex flex-col rounded-[2.5rem]",
                selected
                    ? (isVip ? 'border-amber-400 bg-blue-950 shadow-[0_20px_50px_rgba(251,191,36,0.3)] scale-[1.02]' : 'border-primary bg-white shadow-2xl scale-[1.02]')
                    : (isVip ? 'bg-blue-950 border-blue-900 hover:border-amber-400/50' : 'bg-white border-slate-100 hover:border-primary/30 hover:shadow-lg')
            )}
        >
            <div className="absolute top-6 right-6 flex flex-col gap-2 items-end z-10">
                {recommended && !isVip && (
                    <Badge className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full border-none uppercase tracking-wider">
                        {dictionary.recommended}
                    </Badge>
                )}
                {isVip && (
                    <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[10px] font-black px-4 py-1.5 rounded-full border-none uppercase flex items-center gap-1.5 shadow-lg">
                        <Crown className="w-3.5 h-3.5" /> LUX VIP
                    </Badge>
                )}
            </div>

            <CardHeader className="p-10 pb-6">
                <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110",
                    selected 
                        ? (isVip ? "bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.5)]" : "bg-primary text-white shadow-lg") 
                        : (isVip ? "bg-white/10 text-amber-400 border border-amber-400/30" : "bg-secondary text-slate-600")
                )}>
                    <Icon className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                    <CardTitle className={cn("text-2xl font-black flex flex-col gap-2 leading-tight", isVip ? "text-white" : "text-dark-blue")}>
                        <span>{label}</span>
                        <span className={cn("text-4xl font-black tracking-tighter", isVip ? "text-amber-400" : "text-primary")}>
                            {formatPrice(price, lang, currency)}
                        </span>
                    </CardTitle>
                    <p className={cn("text-sm leading-relaxed font-medium", isVip ? "text-blue-200/80" : "text-slate-500")}>
                        {description}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="px-10 pt-0 pb-10 flex-grow flex flex-col">
                <div className="space-y-10 flex-grow">
                    {results && (
                        <div className="space-y-5">
                            <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isVip ? "text-amber-400/70" : "text-primary/70")}>
                                {dictionary.results}
                            </p>
                            <ul className="space-y-4">
                                {results.map((r: string, i: number) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className={cn("mt-1 shrink-0 rounded-full p-0.5", isVip ? "bg-amber-400/20" : "bg-primary/10")}>
                                            <CheckCircle className={cn("w-4 h-4", isVip ? "text-amber-400" : "text-primary")} />
                                        </div>
                                        <span className={cn("text-sm font-bold leading-snug", isVip ? "text-white" : "text-dark-blue")}>{r}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {features && (
                        <div className={cn("space-y-5 border-t pt-8", isVip ? "border-white/10" : "border-slate-100")}>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{dictionary.features}</p>
                            <ul className="space-y-3">
                                {features.map((f: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-xs">
                                        <Check className={cn("w-4 h-4 mt-0.5 shrink-0", isVip ? "text-amber-400" : "text-green-500")} />
                                        <span className={isVip ? "text-slate-300" : "text-slate-600"}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mt-10 pt-8 border-t border-transparent space-y-6">
                    <div className="space-y-3">
                        {timeline && (
                            <div className={cn("flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", isVip ? "text-amber-400/50" : "text-slate-400")}>
                                <Clock className="w-3.5 h-3.5" />
                                <span>{timeline}</span>
                            </div>
                        )}
                        {note && (
                            <div className={cn("flex items-start gap-2 text-[10px] italic leading-tight", isVip ? "text-blue-300/40" : "text-slate-400")}>
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{note}</span>
                            </div>
                        )}
                    </div>

                    <Button
                        variant="default"
                        className={cn(
                            "w-full py-8 text-lg font-black transition-all duration-500 rounded-2xl",
                            selected 
                                ? (isVip ? "bg-amber-400 text-black hover:bg-amber-500 shadow-[0_10px_30px_rgba(251,191,36,0.4)]" : "text-white shadow-xl") 
                                : (isVip ? "bg-white/5 border border-amber-400/30 text-amber-400 hover:bg-amber-400 hover:text-black" : "opacity-90")
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
    <div className="space-y-10">
        <div className="flex items-center gap-6">
            <div className="h-12 w-2 bg-primary rounded-full" />
            <h3 className="text-4xl font-black text-dark-blue tracking-tight">{title}</h3>
        </div>
        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-8", gridCols)}>{children}</div>
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
        <section id="package-builder" className="py-24 sm:py-40 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto mb-32 text-center space-y-8">
                    <Badge className="bg-primary/10 text-primary border-none px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.3em]">
                        {translations.categories.tripwire}
                    </Badge>
                    <h2 className="text-6xl sm:text-7xl font-black text-dark-blue leading-[0.9] tracking-tighter">{translations.title}</h2>
                    <p className="text-2xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">{translations.subtitle}</p>
                </div>

                <div className="space-y-40">
                    <ServiceGroup title={translations.categories.tripwire}>{['namingCheck', 'audit', 'consultation'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.strategy} gridCols="lg:grid-cols-2">{['strategy', 'commStrategy'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.naming}>{['namingVIP', 'namingPremium', 'namingStandard'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.identity}>{['logoVIP', 'logoPremium', 'logoStandard'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="more" className="border-none">
                            <AccordionTrigger className="text-2xl font-black text-dark-blue justify-center gap-6 hover:no-underline py-16 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 transition-all hover:bg-slate-100 group">
                                {translations.categories.more_services}
                                <ChevronsDown className="w-8 h-8 text-primary animate-bounce group-hover:text-dark-blue transition-colors" />
                            </AccordionTrigger>
                            <AccordionContent className="pt-24 space-y-40">
                                <ServiceGroup title={translations.categories.addons} gridCols="lg:grid-cols-2">
                                    {['packaging', 'smm'].map(id => (
                                        <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />
                                    ))}
                                </ServiceGroup>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <div className="mt-40 max-w-6xl mx-auto">
                    <Card id="your-package-card" className="p-12 sm:p-20 rounded-[4rem] bg-dark-blue text-white shadow-[0_50px_100px_-20px_rgba(5,5,131,0.5)] overflow-hidden relative border-none">
                        <div className="absolute -bottom-40 -right-40 w-[40rem] h-[40rem] bg-primary/30 rounded-full blur-[120px] pointer-events-none" />
                        <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
                        
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24">
                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <h3 className="text-5xl font-black tracking-tighter">{translations.your_package}</h3>
                                    <p className="text-blue-200/60 font-medium">{translations.your_package_desc}</p>
                                </div>
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                    {Object.entries(selectedServices).filter(([_,v]) => v).map(([k]) => (
                                        <div key={k} className="flex justify-between items-center text-lg font-bold p-6 rounded-[1.5rem] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group">
                                            <span className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent" /> {serviceDetails[k as keyof typeof serviceDetails]?.label}</span>
                                            <span className="text-accent font-black">{formatPrice(serviceDetails[k as keyof typeof serviceDetails]?.price || 0, lang as any, currency)}</span>
                                        </div>
                                    ))}
                                    {Object.values(selectedServices).every(v => !v) && (
                                        <div className="text-center py-16 px-8 rounded-[2.5rem] bg-white/5 border-2 border-dashed border-white/10">
                                            <TrendingUp className="w-12 h-12 mx-auto text-blue-300/30 mb-4" />
                                            <p className="text-blue-200/40 italic text-xl font-medium">{translations.empty_package_desc}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-12 bg-white/5 p-12 sm:p-16 rounded-[3.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
                                <div className="space-y-8">
                                    <div className="flex justify-between items-baseline border-b border-white/10 pb-6">
                                        <span className="text-blue-200 text-xs font-black uppercase tracking-[0.2em]">{translations.base_price_label}</span>
                                        <span className="text-3xl font-black">{formatPrice(total.base, lang as any, currency)}</span>
                                    </div>
                                    <div className="space-y-4">
                                        {total.discountApplied.map((d: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center text-green-400 text-sm font-black bg-green-400/10 px-5 py-4 rounded-2xl border border-green-400/20 animate-fade-in">
                                                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> {d.name}</span>
                                                <span>-{formatPrice(d.value, lang as any, currency)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-8 flex flex-col gap-2">
                                        <span className="text-blue-200 text-xs font-black uppercase tracking-[0.2em] text-center">{translations.final_price}</span>
                                        <span className="text-7xl font-black text-accent tracking-tighter text-center">{formatPrice(total.final, lang as any, currency)}</span>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="flex items-center gap-6 p-6 rounded-[1.5rem] bg-white/5 border border-white/10 cursor-pointer group transition-all hover:bg-white/10" onClick={() => setWantsUpfrontPayment(!wantsUpfrontPayment)}>
                                        <div className={cn("w-16 h-8 rounded-full relative transition-all duration-500", wantsUpfrontPayment ? "bg-accent shadow-[0_0_30px_rgba(0,201,253,0.5)]" : "bg-slate-700")}>
                                            <div className={cn("absolute top-1.5 w-5 h-5 rounded-full bg-white transition-all duration-500 shadow-md", wantsUpfrontPayment ? "left-9" : "left-1.5")} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-white uppercase tracking-wider group-hover:text-accent transition-colors">100% Oldindan to'lov</span>
                                            <span className="text-[10px] font-bold text-green-400">-10% QO'SHIMCHA CHEGIRMA</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-[10px] uppercase font-black text-blue-300 tracking-[0.2em] ml-2">{translations.promo_code_label}</Label>
                                        <Input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="bg-white/5 border-white/10 text-white h-16 rounded-[1.2rem] focus:border-accent focus:ring-accent transition-all text-xl font-black px-6 placeholder:text-blue-200/20" placeholder={translations.promo_code_placeholder} />
                                    </div>
                                </div>
                                <Button size="lg" variant="default" className="w-full py-10 text-2xl font-black rounded-[1.5rem] shadow-[0_20px_40px_rgba(0,201,253,0.3)] hover:scale-[1.02] transition-transform" onClick={onOrderNow} disabled={total.base === 0}>
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