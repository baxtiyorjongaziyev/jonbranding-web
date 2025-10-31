

'use client';

import React, { useState, useEffect, FC } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { getServiceDetails, calculatePackagePrice, type PriceDetails, SelectedServices, formatPrice, packageDiscountThreshold } from '@/lib/pricing';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Gift, Info, ShoppingCart, CheckCircle, Flame, ShieldCheck, FileText, ClipboardSignature, Megaphone, Shirt, PenTool, ClipboardList, Type, Palette, Layers, BookMarked, Box, PercentCircle, Check, Search, BrainCircuit, Paintbrush, Clock, Crown, ArrowRight, ChevronsRight, Loader2, ChevronsDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion, useMotionValue } from 'framer-motion';
import PopularPackages from './popular-packages';
import { event as gtagEvent } from '@/lib/gtag';


interface PackageBuilderProps {
    onOrderNow: () => void;
    lang: string;
    dictionary: any;
}

const serviceIcons: { [key: string]: React.ElementType } = {
    audit: Search, namingCheck: ClipboardSignature, consultation: Info,
    strategy: BrainCircuit, commStrategy: Megaphone, smm: PenTool,
    merch: Shirt, illustrations: Palette, urgency: Flame, nda: ShieldCheck,
    packaging: Box,
};

const introIcons: { [key: string]: React.ElementType } = {
    research: Search,
    strategy: BrainCircuit,
    identity: Paintbrush,
    communication: Megaphone
};

const KnobToggle = ({ isOn, onToggle }: { isOn: boolean, onToggle: (value: boolean) => void }) => {
    const x = useMotionValue(isOn ? 20 : 0);

    useEffect(() => {
        x.set(isOn ? 20 : 0);
    }, [isOn, x]);

    return (
        <motion.div
            className={cn(
                "w-12 h-8 flex items-center p-1 rounded-full cursor-pointer transition-colors",
                isOn ? "bg-primary" : "bg-white/10"
            )}
            onClick={() => onToggle(!isOn)}
        >
            <motion.div
                className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center bg-white"
                )}
                drag="x"
                dragConstraints={{ left: 0, right: 20 }}
                style={{ x }}
                onDragEnd={() => onToggle(x.get() > 10)}
            >
                {isOn && <Check className="w-4 h-4 text-primary" />}
            </motion.div>
        </motion.div>
    );
};

const CurrencyToggle = ({ currency, onCurrencyChange }: { currency: 'uzs' | 'usd', onCurrencyChange: (c: 'uzs' | 'usd') => void }) => (
    <div className="relative flex w-auto rounded-full bg-secondary p-1">
        {(['uzs', 'usd'] as const).map(c => (
            <div key={c} className="relative flex-1">
                {currency === c && (
                    <motion.div
                        layoutId="currency-toggle-bg"
                        className="absolute inset-0 rounded-full bg-primary shadow-md"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                <button
                    onClick={() => onCurrencyChange(c)}
                    className={cn(
                        "relative w-full rounded-full py-2 px-6 text-center text-sm font-semibold transition-colors",
                        currency === c ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {c.toUpperCase()}
                </button>
            </div>
        ))}
    </div>
);


const TariffCard = ({ id, onSelect, selected, lang, dictionary, currency }: { id: keyof SelectedServices, onSelect: () => void, selected: boolean, lang: 'uz' | 'ru' | 'en' | 'zh', dictionary: any, currency: 'uzs' | 'usd' }) => {
    const serviceDetails = getServiceDetails(lang);
    const detail = serviceDetails[id];
    if (!detail) return null;
    const { label, description, price, features, timeline } = detail;

    const isVip = id.toLowerCase().includes('vip');
    const isPremium = id.toLowerCase().includes('premium') && !isVip;
    
    return (
        <Card 
            onClick={onSelect}
            className={cn(
                "relative rounded-2xl h-full border-2 transition-all duration-300 cursor-pointer overflow-hidden",
                selected
                    ? (isVip ? 'border-amber-400 bg-gray-900 ring-4 ring-amber-400/30' : 'border-primary ring-4 ring-primary/20 bg-primary/5')
                    : (isVip ? 'bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 border-gray-700 hover:border-amber-400' : (isPremium ? 'bg-white border-primary/30 hover:border-primary' : 'bg-white border-gray-200 hover:border-gray-300')),
                 isPremium && !isVip && "shadow-lg",
                 isVip && "shadow-2xl"
            )}
        >
             {isPremium && !selected && (
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl z-0" />
             )}
            <div className='relative p-6 flex flex-col h-full z-10'>
                 <div className="text-center mb-4 -mt-2 min-h-[34px]">
                    {(isPremium || isVip) && (
                         <div className={cn(
                             "inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg",
                             isVip ? "bg-amber-400 text-black" : "bg-primary text-primary-foreground"
                        )}>
                             {isVip ? <><Crown className="w-4 h-4" /> VIP</> : dictionary.recommended}
                        </div>
                    )}
                </div>
                <div className="text-center">
                    <h3 className={cn("font-bold text-xl", isVip ? "text-white" : "text-dark-blue")}>{label}</h3>
                    <p className={cn("text-sm mt-1 h-10", isVip ? "text-gray-300" : "text-muted-foreground")}>{description}</p>
                    <p className={cn("text-4xl font-extrabold mt-4", isVip ? "text-white" : "text-dark-blue")}>{formatPrice(price, lang, currency)}</p>
                </div>
                
                <div className="mt-6 mb-8 flex-grow">
                    <ul className="space-y-3">
                        {features?.map((feature: any, index: number) => (
                             <li key={index} className="flex items-start gap-3">
                                <Check className={cn("w-5 h-5  flex-shrink-0 mt-0.5", isVip ? "text-amber-400" : "text-green-500")} />
                                <span className={cn("text-sm", isVip ? "text-gray-200" : "text-gray-700")}>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                {timeline && (
                    <div className={cn("text-center text-xs mb-4 flex items-center justify-center gap-2", isVip ? "text-gray-400" : "text-muted-foreground")}>
                        <Clock className="w-4 h-4" />
                        <span>{timeline}</span>
                    </div>
                )}
                
                <div className="mt-auto">
                     <Button 
                        className={cn(
                            "w-full text-base py-3 h-auto transition-all duration-300",
                            selected 
                                ? "shadow-lg" 
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                             isVip && !selected && "bg-white/10 hover:bg-white/20 text-white",
                             isVip && selected && "bg-amber-400 hover:bg-amber-500 text-black"
                        )}
                        variant={selected ? (isVip ? 'default' : 'default') : 'secondary'}
                        tabIndex={-1}
                    >
                         {selected ? (
                            <>
                                <CheckCircle className="h-5 w-5 mr-2" />
                                {dictionary.selected}
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                {dictionary.select}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    );
};


const ServiceCard = ({ id, onSelect, selected, lang, dictionary, currency }: { id: keyof SelectedServices, onSelect: () => void, selected: boolean, lang: 'uz' | 'ru' | 'en' | 'zh', dictionary: any, currency: 'uzs' | 'usd' }) => {
    const serviceDetails = getServiceDetails(lang);
    const detail = serviceDetails[id];
    if (!detail) return null;
    const { label, description, price, note, features, oldPrice, discount } = detail;
    const Icon = serviceIcons[id] || Sparkles;

    return (
        <Card 
            onClick={onSelect}
            className={cn(
                "relative rounded-2xl h-full border-2 transition-all duration-300 cursor-pointer",
                selected ? 'border-primary ring-4 ring-primary/20 bg-primary/5' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            )}
        >
            <div className='p-6 flex flex-col h-full'>
                <div className="flex items-start gap-4 mb-4">
                     <div className={cn("p-3 rounded-full flex-shrink-0", selected ? "bg-primary/10" : "bg-secondary")}>
                        <Icon className={cn("w-6 h-6", selected ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div>
                         <h4 className="text-lg font-bold leading-tight text-dark-blue">{label}</h4>
                         <p className="text-sm text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: description }}></p>
                    </div>
                </div>
                
                 {features && features.length > 0 && (
                     <div className="mt-4 mb-6 flex-grow">
                         <ul className="space-y-3">
                            {features?.map((feature: any, index: number) => (
                                 <li key={index} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-gray-700">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                <div className="mt-auto pt-4">
                     {discount && oldPrice && oldPrice > 0 ? (
                        <div className="my-4 text-left">
                            <div className="inline-block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md mb-1">-{discount * 100}%</div>
                            <div className="text-3xl font-extrabold text-dark-blue">{formatPrice(price, lang, currency)}</div>
                            <div className="text-base text-gray-400 line-through">{formatPrice(oldPrice, lang, currency)}</div>
                        </div>
                    ) : (
                        <div className="text-3xl font-extrabold text-dark-blue my-4">
                            {price > 0 || note ? (
                                <span>
                                    {note ? note : formatPrice(price, lang, currency)}
                                </span>
                            ) : (
                                <span className="text-xl">{dictionary.agreed_price}</span>
                            )}
                        </div>
                    )}
                     <Button 
                        className={cn(
                            "w-full text-base py-3 h-auto transition-all duration-300",
                            selected 
                                ? "shadow-lg" 
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                        variant={selected ? 'default' : 'secondary'}
                        tabIndex={-1}
                    >
                        {selected ? (
                            <>
                                <CheckCircle className="h-5 w-5 mr-2" />
                                {dictionary.selected}
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                {dictionary.select}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    );
};


const ServiceGroup = ({ title, children, gridCols = "lg:grid-cols-3" }: { title: string, children: React.ReactNode, gridCols?: string }) => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-dark-blue">{title}</h3>
        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", gridCols)}>
            {children}
        </div>
    </div>
);

const PackageBuilder: FC<PackageBuilderProps> = ({ onOrderNow, lang, dictionary }) => {
    const translations = dictionary;
    const serviceDetails = getServiceDetails(lang as 'uz' | 'ru' | 'en' | 'zh');
    
    const [selectedServices, setSelectedServices] = useLocalStorage<SelectedServices>('selectedServices', {
        audit: false, namingCheck: false, consultation: false, 
        strategy: false, commStrategy: false,
        namingStandard: false, namingPremium: false, namingVIP: false,
        logoStandard: false, logoPremium: false, logoVIP: false,
        packaging: false,
        smm: false, merch: false, illustrations: false, urgency: false, nda: false,
    });
    const [wantsUpfrontPayment, setWantsUpfrontPayment] = useLocalStorage('wantsUpfrontPayment', false);
    const [currency, setCurrency] = useLocalStorage<'uzs' | 'usd'>('currency', 'usd');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => { setIsClient(true); }, []);

    const [total, setTotal] = useState<PriceDetails>({ base: 0, final: 0, discountApplied: [], savings: 0, bonus: null, surcharges: [] });
    const [hasDiscountBeenApplied, setHasDiscountBeenApplied] = useState(false);

    useEffect(() => {
        if (isClient) {
            const result = calculatePackagePrice({ selectedServices, wantsUpfrontPayment }, lang as 'uz' | 'ru' | 'en' | 'zh');
            setTotal(result);
            const justAppliedDiscount = result.discountApplied.length > 0 && !hasDiscountBeenApplied;
            if (justAppliedDiscount) {
                 confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, colors: ['#00C9FD', '#ADFFFE', '#FFFFFF', '#050583'] });
                setHasDiscountBeenApplied(true);
            }
            if(result.discountApplied.length === 0 && hasDiscountBeenApplied) {
                setHasDiscountBeenApplied(false);
            }
        }
    }, [selectedServices, wantsUpfrontPayment, isClient, hasDiscountBeenApplied, lang]);

    const trackGtagEvent = (serviceId: keyof SelectedServices, isSelected: boolean) => {
        const service = serviceDetails[serviceId];
        if (service && service.price > 0) {
            gtagEvent(isSelected ? 'remove_from_cart' : 'add_to_cart', {
                currency: 'USD',
                value: service.price,
                items: [{
                    item_id: serviceId,
                    item_name: service.label,
                    price: service.price,
                    quantity: 1
                }]
            });
        }
    };

    const handleTariffSelect = (group: (keyof SelectedServices)[], serviceId: keyof SelectedServices) => {
        const isCurrentlySelected = selectedServices[serviceId];
        trackGtagEvent(serviceId, isCurrentlySelected);

        setSelectedServices(prev => {
            const newState = { ...prev };
            group.forEach(id => {
                if (id !== serviceId) newState[id] = false;
            });
            newState[serviceId] = !newState[serviceId];
            return newState;
        });
    };

    const handleServiceToggle = (serviceId: keyof SelectedServices) => {
        const isCurrentlySelected = selectedServices[serviceId];
        trackGtagEvent(serviceId, isCurrentlySelected);

        const namingGroup: (keyof SelectedServices)[] = ['namingStandard', 'namingPremium', 'namingVIP'];
        const logoGroup: (keyof SelectedServices)[] = ['logoStandard', 'logoPremium', 'logoVIP'];

        if (namingGroup.includes(serviceId)) {
            handleTariffSelect(namingGroup, serviceId);
        } else if (logoGroup.includes(serviceId)) {
            handleTariffSelect(logoGroup, serviceId);
        } else {
             setSelectedServices(prev => ({...prev, [serviceId]: !prev[serviceId]}));
        }
    };
    
    if (!isClient || !translations) {
        return (
            <section id="package-builder" className="py-16 sm:py-24 bg-secondary pt-32">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                         <Skeleton className="h-10 w-1/2 mx-auto" />
                         <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
                    </div>
                     <div className="mt-12 space-y-8">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-64 w-full" />
                     </div>
                </div>
            </section>
        )
    }

    const selectedServiceKeys = Object.entries(selectedServices)
                                .filter(([, value]) => value)
                                .map(([key]) => key as keyof SelectedServices);
    
    const serviceGroups = {
        tripwire: { titleKey: "tripwire", services: ['namingCheck', 'audit', 'consultation'], gridCols: "lg:grid-cols-3" },
        strategy: { titleKey: "strategy", services: ['strategy', 'commStrategy'], gridCols: "lg:grid-cols-2" },
        naming: { titleKey: "naming", services: ['namingVIP', 'namingPremium', 'namingStandard'], isTariff: true },
        identity: { titleKey: "identity", services: ['logoVIP', 'logoPremium', 'logoStandard'], isTariff: true },
        addons: { titleKey: "addons", services: ['packaging', 'smm', 'merch', 'illustrations'], gridCols: "lg:grid-cols-2" },
        options: { titleKey: "options", services: ['urgency', 'nda'], gridCols: "lg:grid-cols-2" }
    };
    
    const handlePopularPackageSelect = () => {
        const isNamingPremiumSelected = selectedServices['namingPremium'];
        const isLogoPremiumSelected = selectedServices['logoPremium'];

        if (!isNamingPremiumSelected) trackGtagEvent('namingPremium', false);
        if (!isLogoPremiumSelected) trackGtagEvent('logoPremium', false);

        setSelectedServices(prev => ({
            ...prev,
            namingStandard: false,
            namingPremium: true,
            namingVIP: false,
            logoStandard: false,
            logoPremium: true,
            logoVIP: false,
        }));
        const card = document.getElementById('your-package-card');
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <>
            <section id="package-builder" className="py-16 sm:py-24 bg-secondary pt-32">
                <div className="container mx-auto px-4">
                     <div className="max-w-4xl mx-auto mb-16 grid grid-cols-1 gap-8">
                        <Card className="p-6 sm:p-8 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-dark-blue text-xl mb-3">{translations.introTitle}</h3>
                            <p className="text-muted-foreground">{translations.introP1}</p>
                            <p className="text-muted-foreground mt-2">{translations.introP2}</p>
                        </Card>
                        <Card className="p-6 sm:p-8 rounded-2xl shadow-sm">
                            <h4 className="font-bold text-dark-blue text-xl mb-4">{translations.introSubtitle}</h4>
                             <Accordion type="single" collapsible className="w-full">
                                {translations.introList.map((item: any, index: number) => {
                                     const Icon = introIcons[item.icon] || Sparkles;
                                     return (
                                        <AccordionItem value={`item-${index}`} key={index}>
                                            <AccordionTrigger className="font-semibold text-lg py-4">
                                                 <div className="flex items-center gap-4">
                                                    <Icon className="w-6 h-6 text-primary" />
                                                    <span>{item.title}</span>
                                                 </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="text-base text-muted-foreground pl-14">
                                                {item.description}
                                            </AccordionContent>
                                        </AccordionItem>
                                     )
                                })}
                            </Accordion>
                        </Card>
                    </div>

                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold">{translations.title}</h2>
                        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">{translations.subtitle}</p>
                    </div>

                    <div className="flex justify-center mb-12">
                        <CurrencyToggle currency={currency} onCurrencyChange={setCurrency} />
                    </div>
                    
                    <div className="space-y-16">
                         {['tripwire', 'strategy'].map((groupKey) => {
                             const group = serviceGroups[groupKey as keyof typeof serviceGroups];
                             return (
                                 <ServiceGroup key={groupKey} title={translations.categories[group.titleKey]} gridCols={group.gridCols}>
                                     {group.services.map((serviceId) => (
                                         <ServiceCard
                                             key={serviceId}
                                             id={serviceId as keyof SelectedServices}
                                             selected={selectedServices[serviceId as keyof SelectedServices] || false}
                                             onSelect={() => handleServiceToggle(serviceId as keyof SelectedServices)}
                                             lang={lang as 'uz' | 'ru' | 'en' | 'zh'}
                                             dictionary={translations}
                                             currency={currency}
                                         />
                                     ))}
                                 </ServiceGroup>
                             );
                         })}

                        <div className="py-8">
                            <div className="mb-6 rounded-2xl bg-gradient-to-br from-dark-blue to-primary p-6 text-white shadow-xl">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/10 p-3 rounded-full">
                                        <PercentCircle className="h-8 w-8 text-accent flex-shrink-0"/>
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-lg text-white">{translations.discount_alert_title}</h4>
                                        <p className="text-blue-200" dangerouslySetInnerHTML={{ __html: translations.discount_alert_desc }}></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {['naming', 'identity'].map((groupKey) => {
                             const group = serviceGroups[groupKey as keyof typeof serviceGroups];
                             return (
                                 <React.Fragment key={groupKey}>
                                     {groupKey === 'identity' && (
                                         <div className="py-8">
                                             <PopularPackages lang={lang} onSelectPackage={handlePopularPackageSelect} />
                                         </div>
                                     )}
                                     <ServiceGroup title={translations.categories[group.titleKey]} gridCols={group.gridCols}>
                                         {group.services.map((serviceId) => (
                                             <TariffCard
                                                 key={serviceId}
                                                 id={serviceId as keyof SelectedServices}
                                                 selected={selectedServices[serviceId as keyof SelectedServices] || false}
                                                 onSelect={() => handleServiceToggle(serviceId as keyof SelectedServices)}
                                                 lang={lang as 'uz' | 'ru' | 'en' | 'zh'}
                                                 dictionary={translations}
                                                 currency={currency}
                                             />
                                         ))}
                                     </ServiceGroup>
                                 </React.Fragment>
                             );
                         })}
                        
                         <Accordion type="single" collapsible className="w-full">
                           <AccordionItem value="item-1" className="border-none">
                               <AccordionTrigger className="text-xl font-bold text-dark-blue hover:no-underline justify-center gap-2">
                                 {translations.categories.more_services}
                                 <ChevronsDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                               </AccordionTrigger>
                               <AccordionContent className="pt-8">
                                 <div className="space-y-16">
                                     {['addons', 'options'].map((groupKey) => {
                                         const group = serviceGroups[groupKey as keyof typeof serviceGroups];
                                         return (
                                             <ServiceGroup key={groupKey} title={translations.categories[group.titleKey]} gridCols={group.gridCols}>
                                                 {group.services.map((serviceId) => (
                                                     <ServiceCard
                                                         key={serviceId}
                                                         id={serviceId as keyof SelectedServices}
                                                         selected={selectedServices[serviceId as keyof SelectedServices] || false}
                                                         onSelect={() => handleServiceToggle(serviceId as keyof SelectedServices)}
                                                         lang={lang as 'uz' | 'ru' | 'en' | 'zh'}
                                                         dictionary={translations}
                                                         currency={currency}
                                                     />
                                                 ))}
                                             </ServiceGroup>
                                         );
                                     })}
                                 </div>
                               </AccordionContent>
                           </AccordionItem>
                         </Accordion>
                    </div>
                </div>
            </section>
        
            <section className="bg-secondary py-16">
                <div className="container mx-auto px-4">
                    <Card id="your-package-card" className="p-6 sm:p-8 rounded-2xl shadow-xl bg-gradient-to-br from-dark-blue to-primary text-white">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                            
                            <div className="lg:col-span-2">
                                <CardHeader className="p-0 text-left mb-6">
                                    <CardTitle className="text-2xl font-bold text-white">{translations.your_package}</CardTitle>
                                    <p className="text-blue-200 text-sm mt-1">{translations.your_package_desc}</p>
                                </CardHeader>
                                <CardContent className="p-0">
                                   {selectedServiceKeys.length > 0 ? (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                          <div className="space-y-3 border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0 sm:pr-8">
                                              <h4 className="font-semibold text-white">{translations.selected_services_title}</h4>
                                                  {selectedServiceKeys
                                                      .filter(key => {
                                                          const service = serviceDetails[key];
                                                          return service && (service.price > 0 || service.note?.includes('%'));
                                                      })
                                                      .map((key) => {
                                                          const service = serviceDetails[key];
                                                          return (
                                                              <div key={key} className="flex justify-between items-center text-sm animate-fade-in group">
                                                                  <span className="text-white flex-1 pr-2">{service.label}</span>
                                                                  <div className="flex items-center gap-2">
                                                                      <span className="font-mono text-gray-300">
                                                                          {service.price > 0 ? `${formatPrice(service.price, lang as 'uz' | 'ru' | 'en' | 'zh', currency, false)}` : service.note}
                                                                      </span>
                                                                  </div>
                                                              </div>
                                                          );
                                                      })}
                                          </div>

                                          <div className="space-y-3">
                                              <h4 className="font-semibold text-white">{translations.cost_calculation_title}</h4>
                                              {total.base > 0 && (
                                                  <>
                                                      <div className="flex justify-between items-center text-lg">
                                                          <span className="text-blue-200 line-through text-base">{translations.base_price}</span>
                                                          <span className="font-mono line-through text-base">{formatPrice(total.base, lang as 'uz' | 'ru' | 'en' | 'zh', currency)}</span>
                                                      </div>
                                                      {total.surcharges.map(s => (
                                                          <div key={s.name} className="flex justify-between items-center text-sm text-amber-300">
                                                              <span>{s.name}</span>
                                                              <span className="font-mono">+ {formatPrice(s.value, lang as 'uz' | 'ru' | 'en' | 'zh', currency)}</span>
                                                          </div>
                                                      ))}
                                                      {total.discountApplied.map(d => (
                                                          <div key={d.name} className="flex justify-between items-center text-sm text-green-300">
                                                              <span>{d.name}</span>
                                                              <span className="font-mono">- {formatPrice(d.value, lang as 'uz' | 'ru' | 'en' | 'zh', currency)}</span>
                                                          </div>
                                                      ))}
                                                  </>
                                              )}
                                              {total.savings > 0 && (
                                                  <div className="flex justify-between items-center text-lg font-bold text-green-300 pt-2 border-t border-green-400/20">
                                                      <span>{translations.total_savings}</span>
                                                      <span className="font-mono">{formatPrice(total.savings, lang as 'uz' | 'ru' | 'en' | 'zh', currency)}</span>
                                                  </div>
                                              )}
                                          </div>
                                      </div>
                                   ) : (
                                       <div className="text-center text-blue-200 text-sm py-4 flex flex-col items-center gap-2">
                                           <div className="text-lg font-bold text-white mb-2">{translations.empty_package_title}</div>
                                           <p className="mb-4">{translations.empty_package_desc}</p>
                                           <Button 
                                               onClick={handlePopularPackageSelect} 
                                               variant="secondary" 
                                               className="bg-white/10 text-white hover:bg-white/20"
                                           >
                                               <Sparkles className="w-4 h-4 mr-2" />
                                               {translations.empty_package_cta}
                                           </Button>
                                       </div>
                                   )}

                                    {total.bonus && (
                                        <InfoCard
                                            icon={Gift}
                                            title={translations.gift_title}
                                            description={total.bonus}
                                            className="mt-6 bg-accent/10 border-accent/20 text-accent-light"
                                        />
                                    )}

                                </CardContent>
                            </div>

                            <div className="flex flex-col justify-center items-center text-center bg-white/5 rounded-xl p-6 border border-white/10">
                                <div className='text-center'>
                                        <p className="text-sm text-blue-200">{translations.final_price}</p>
                                        <p className="text-4xl sm:text-5xl font-bold text-white tracking-normal">
                                        {total.final > 0 ? (
                                            <>
                                                {formatPrice(total.final, lang as 'uz' | 'ru' | 'en' | 'zh', currency)}
                                            </>
                                        ) : (
                                            translations.agreed_price
                                        )}
                                    </p>
                                </div>
                                
                               <div className="mt-4 w-full max-w-xs space-y-2">
                                     <Label htmlFor="upfront-payment" className="flex flex-col text-left items-center">
                                        <span className="font-semibold text-white">{translations.upfront_discount_title}</span>
                                        <span className="text-xs text-blue-200 mb-2">{translations.upfront_discount_desc}</span>
                                         <KnobToggle 
                                            isOn={wantsUpfrontPayment}
                                            onToggle={setWantsUpfrontPayment}
                                        />
                                   </Label>
                               </div>

                                <Button id="package-builder-cta" onClick={onOrderNow} variant="default" size="lg" className="w-full mt-6 text-lg py-3" disabled={total.base === 0}>
                                    {total.discountApplied.length > 0 ? translations.order_with_discount : translations.get_free_consultation}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>
        </>
    );
};


const InfoCard = ({ icon: Icon, title, description, className }: { icon: React.ElementType, title: string, description: string, className?: string }) => (
    <div className={cn("bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-4 text-left", className)}>
        <div className="flex-shrink-0 text-accent p-2 rounded-lg mt-1">
            {Icon && <Icon className="w-5 h-5" />}
        </div>
        <div className="flex-1">
            <h5 className="font-semibold text-white">{title}</h5>
            <p className="text-sm text-blue-200">{description}</p>
        </div>
    </div>
);

export default PackageBuilder;



