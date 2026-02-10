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
import { Sparkles, CheckCircle, Crown, Check, ChevronsDown, Clock, BrainCircuit, Search, Megaphone, Palette, Box, Type, Layers, ClipboardSignature, Info, Flame, ShieldCheck, AlertCircle } from 'lucide-react';
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
                "group relative h-full transition-all duration-500 cursor-pointer overflow-hidden border-2 flex flex-col rounded-3xl",
                selected
                    ? (isVip ? 'border-amber-400 bg-dark-blue shadow-2xl scale-[1.02]' : 'border-primary bg-white shadow-2xl scale-[1.02]')
                    : (isVip ? 'bg-dark-blue/90 border-slate-800' : 'bg-white border-slate-100 hover:border-primary/30 hover:shadow-lg')
            )}
        >
            <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
                {recommended && !isVip && (
                    <Badge className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full border-none uppercase">
                        {dictionary.recommended}
                    </Badge>
                )}
                {isVip && (
                    <Badge className="bg-amber-400 text-black text-[10px] font-bold px-3 py-1 rounded-full border-none uppercase flex items-center gap-1">
                        <Crown className="w-3 h-3" /> VIP
                    </Badge>
                )}
            </div>

            <CardHeader className="p-8 pb-6">
                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors",
                    selected ? "bg-primary text-white" : (isVip ? "bg-amber-400 text-black" : "bg-secondary text-slate-600")
                )}>
                    <Icon className="w-7 h-7" />
                </div>
                <div className="space-y-3">
                    <CardTitle className={cn("text-2xl font-extrabold flex flex-col gap-1", isVip ? "text-white" : "text-dark-blue")}>
                        <span>{label}</span>
                        <span className="text-primary text-3xl font-black">{formatPrice(price, lang, currency)}</span>
                    </CardTitle>
                    <p className={cn("text-sm leading-relaxed font-medium", isVip ? "text-blue-200" : "text-slate-500")}>
                        {description}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="px-8 pt-0 pb-8 flex-grow flex flex-col">
                <div className="space-y-8 flex-grow">
                    {results && (
                        <div className="space-y-4">
                            <p className={cn("text-xs font-black uppercase tracking-widest", isVip ? "text-amber-400" : "text-primary")}>
                                {dictionary.results}
                            </p>
                            <ul className="space-y-3">
                                {results.map((r: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle className={cn("w-5 h-5 shrink-0 mt-0.5", isVip ? "text-amber-400" : "text-primary")} />
                                        <span className={cn("text-sm font-bold", isVip ? "text-white" : "text-dark-blue")}>{r}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {features && (
                        <div className="space-y-4 border-t border-slate-100 dark:border-white/10 pt-6">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{dictionary.features}</p>
                            <ul className="space-y-2">
                                {features.map((f: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-xs">
                                        <Check className={cn("w-4 h-4 mt-0.5 shrink-0", isVip ? "text-amber-400" : "text-green-500")} />
                                        <span className={isVip ? "text-slate-200" : "text-slate-700"}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 space-y-6">
                    <div className="space-y-3">
                        {timeline && (
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{timeline}</span>
                            </div>
                        )}
                        {note && (
                            <div className="flex items-start gap-2 text-[10px] text-slate-400 italic leading-tight">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{note}</span>
                            </div>
                        )}
                    </div>

                    <Button
                        variant={selected ? "default" : "outline"}
                        className={cn(
                            "w-full py-7 text-lg font-black transition-all duration-300",
                            selected ? "text-white shadow-xl scale-[1.02]" : (isVip ? "border-amber-400/50 text-amber-400 hover:bg-amber-400 hover:text-black" : "border-primary/20 text-primary hover:bg-primary/5")
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
        <h3 className="text-3xl font-black text-dark-blue flex items-center gap-4"><span className="w-2.5 h-10 bg-primary rounded-full" />{title}</h3>
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
        return <div className="py-20 min-h-screen bg-slate-50 text-center text-gray-400">Ko'rinmayapti hech narsa</div>;
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
        <section id="package-builder" className="py-20 sm:py-32 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto mb-24 text-center space-y-6">
                    <h2 className="text-5xl font-black text-dark-blue leading-tight">{translations.title}</h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">{translations.subtitle}</p>
                </div>

                <div className="space-y-32">
                    <ServiceGroup title={translations.categories.tripwire}>{['namingCheck', 'audit', 'consultation'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.strategy} gridCols="lg:grid-cols-2">{['strategy', 'commStrategy'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.naming}>{['namingVIP', 'namingPremium', 'namingStandard'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    <ServiceGroup title={translations.categories.identity}>{['logoVIP', 'logoPremium', 'logoStandard'].map(id => <ServiceCard key={id} id={id} selected={selectedServices[id]} onSelect={() => handleServiceToggle(id)} lang={lang} dictionary={translations} currency={currency} />)}</ServiceGroup>
                    
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="more" className="border-none">
                            <AccordionTrigger className="text-2xl font-black text-dark-blue justify-center gap-4 hover:no-underline py-12 bg-white rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
                                {translations.categories.more_services}
                                <ChevronsDown className="w-6 h-6 text-primary animate-bounce" />
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

                <div className="mt-32 max-w-5xl mx-auto">
                    <Card id="your-package-card" className="p-10 sm:p-16 rounded-[3rem] bg-dark-blue text-white shadow-[0_30px_100px_-20px_rgba(5,5,131,0.4)] overflow-hidden relative border-none">
                        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute -top-20 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
                        
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
                            <div className="space-y-10">
                                <h3 className="text-4xl font-black">{translations.your_package}</h3>
                                <div className="space-y-4">
                                    {Object.entries(selectedServices).filter(([_,v]) => v).map(([k]) => (
                                        <div key={k} className="flex justify-between items-center text-base font-bold p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                            <span>{serviceDetails[k as keyof typeof serviceDetails]?.label}</span>
                                            <span className="text-accent">{formatPrice(serviceDetails[k as keyof typeof serviceDetails]?.price || 0, lang as any, currency)}</span>
                                        </div>
                                    ))}
                                    {Object.values(selectedServices).every(v => !v) && <p className="text-blue-200/50 italic py-6 text-lg">{translations.empty_package_desc}</p>}
                                </div>
                            </div>
                            <div className="space-y-10 bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-blue-200 text-sm font-black uppercase tracking-widest">{translations.base_price_label}</span>
                                        <span className="text-2xl font-bold">{formatPrice(total.base, lang as any, currency)}</span>
                                    </div>
                                    {total.discountApplied.map((d: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center text-green-400 text-sm font-bold bg-green-400/10 p-3 rounded-xl border border-green-400/20">
                                            <span>{d.name}</span>
                                            <span>-{formatPrice(d.value, lang as any, currency)}</span>
                                        </div>
                                    ))}
                                    <div className="pt-8 border-t border-white/10 flex justify-between items-center">
                                        <span className="text-2xl font-black">{translations.final_price}</span>
                                        <span className="text-5xl font-black text-accent">{formatPrice(total.final, lang as any, currency)}</span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 py-2 cursor-pointer group" onClick={() => setWantsUpfrontPayment(!wantsUpfrontPayment)}>
                                        <div className={cn("w-14 h-7 rounded-full relative transition-all duration-300", wantsUpfrontPayment ? "bg-accent shadow-[0_0_20px_rgba(0,201,253,0.4)]" : "bg-slate-700")}>
                                            <div className={cn("absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md", wantsUpfrontPayment ? "left-8" : "left-1")} />
                                        </div>
                                        <span className="text-xs font-black text-blue-100 uppercase tracking-widest group-hover:text-accent transition-colors">100% Pre-payment (-10%)</span>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] uppercase font-black text-blue-300 tracking-widest ml-1">{translations.promo_code_label}</Label>
                                        <Input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="bg-white/5 border-white/10 text-white h-14 rounded-2xl focus:border-accent focus:ring-accent transition-all text-lg font-bold" placeholder={translations.promo_code_placeholder} />
                                    </div>
                                </div>
                                <Button size="lg" variant="default" className="w-full py-9 text-2xl font-black rounded-3xl" onClick={onOrderNow} disabled={total.base === 0}>
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
