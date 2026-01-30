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
import { Sparkles, ShoppingCart, CheckCircle, Crown, Check, ChevronsDown, Ticket, Clock, BrainCircuit, Search, Megaphone, PenTool, Shirt, Palette, Box, Type, Layers, BookMarked, ClipboardSignature, Info, Flame, ShieldCheck, PercentCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import PopularPackages from './popular-packages';
import { event as gtagEvent } from '@/lib/gtag';
import DiscountSelector, { type DiscountOption } from '@/components/ui/DiscountSelector';
import GuaranteeBlock from '../ui/GuaranteeBlock';

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

const FeatureBenefitAccordion = ({ items, isVip }: { items: { feature: string; benefit: string }[], isVip: boolean }) => {
    if (!items || items.length === 0) return null;

    return (
        <Accordion type="single" collapsible className="w-full space-y-2">
            {items.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index} className={cn("border-b-0 rounded-lg", isVip ? "bg-white/5" : "bg-gray-50")}>
                    <AccordionTrigger
                        onClick={(e) => e.stopPropagation()}
                        className={cn("text-left text-sm font-medium hover:no-underline p-3", isVip ? "text-gray-200" : "text-gray-700")}>
                        <div className="flex items-start gap-3">
                             <Check className={cn("w-5 h-5 flex-shrink-0 mt-0.5", isVip ? "text-amber-400" : "text-green-500")} />
                             <span>{item.feature}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 text-sm" onClick={(e) => e.stopPropagation()}>
                       <div className={cn("border-l-2 ml-5 pl-4 py-2", isVip ? "border-amber-400/50 text-amber-200" : "border-primary/50 text-primary-dark")}>
                         {item.benefit}
                       </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

const ServiceCard = ({ id, onSelect, selected, lang, dictionary, currency }: { id: keyof SelectedServices, onSelect: () => void, selected: boolean, lang: 'uz' | 'ru' | 'en' | 'zh', dictionary: any, currency: 'uzs' | 'usd' }) => {
    const serviceDetails = getServiceDetails(lang);
    const detail = serviceDetails[id];
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    if (!detail) return null;

    const { label, description, price, features, timeline, note, oldPrice, discount, recommended } = detail;
    const Icon = serviceIcons[id] || Sparkles;

    const isTariff = ['naming', 'logo'].some(prefix => id.toLowerCase().startsWith(prefix));
    const isVip = id.toLowerCase().includes('vip');
    const isPremium = id.toLowerCase().includes('premium') && !isVip;

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const selectButton = (
        <Button
            className={cn(
                "w-full text-base py-3 h-auto transition-all duration-300",
                selected
                    ? "shadow-lg"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                isVip && !selected && "bg-white/10 hover:bg-white/20 text-white",
                isVip && selected && "bg-amber-400 hover:bg-amber-500 text-black"
            )}
            variant={selected ? 'default' : 'secondary'}
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
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
    );

    const cardContent = (
        <>
            {(isPremium || isVip) && !selected && (
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

                <div className="my-6 space-y-6 flex-grow">
                    {features && features.length > 0 && (
                         <div>
                            <p className="font-semibold text-sm mb-3 text-center text-muted-foreground">{dictionary.features}</p>
                             <FeatureBenefitAccordion items={features} isVip={!!isVip} />
                         </div>
                    )}
                </div>
                {timeline && (
                    <div className={cn("text-center text-xs mb-4 flex items-center justify-center gap-2", isVip ? "text-gray-400" : "text-muted-foreground")}>
                        <Clock className="w-4 h-4" />
                        <span>{timeline}</span>
                    </div>
                )}
                <div className="mt-auto">{selectButton}</div>
            </div>
        </>
    );

    const cardProps = {
        onClick: onSelect,
        onMouseMove: handleMouseMove,
        className: cn(
            "group relative rounded-2xl h-full border-2 transition-all duration-300 cursor-pointer overflow-hidden",
            selected
                ? (isVip ? 'border-amber-400 bg-gray-900' : 'border-primary bg-primary/5')
                : (isVip ? 'bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 border-gray-700 hover:border-amber-400' : (isPremium ? 'bg-white border-primary/30 hover:border-primary' : 'bg-white border-gray-200 hover:border-gray-300')),
            (isPremium || recommended) && !isVip && "shadow-lg",
            isVip && "shadow-2xl"
        )
    };
    
    const glowStyle = useMotionTemplate`
        radial-gradient(
            350px circle at ${mouseX}px ${mouseY}px,
            ${isVip ? 'rgba(252, 211, 77, 0.15)' : 'rgba(0, 201, 253, 0.15)'},
            transparent 80%
        )
    `;
    
    if (isTariff) {
        return (
            <div {...cardProps}>
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: glowStyle }}
                />
                 {cardContent}
            </div>
        );
    }
    
    return (
        <div {...cardProps}>
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: glowStyle }}
            />
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
                
                <div className="my-6 space-y-6 flex-grow">
                    {features && features.length > 0 && (
                         <div>
                            <p className="font-semibold text-sm mb-3 text-center text-muted-foreground">{dictionary.features}</p>
                             <FeatureBenefitAccordion items={features} isVip={false} />
                         </div>
                    )}
                </div>

                <div className="mt-auto pt-4">
                     {discount && oldPrice && oldPrice > 0 ? (
                        <div className="mb-4 text-left">
                            <div className="inline-block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md mb-1">-{discount * 100}%</div>
                            <div className="text-3xl font-extrabold text-dark-blue">{formatPrice(price, lang, currency)}</div>
                            <div className="text-base text-gray-400 line-through">{formatPrice(oldPrice, lang, currency)}</div>
                        </div>
                    ) : (
                        <div className="text-3xl font-extrabold text-dark-blue mb-4">
                            {price > 0 || note ? (
                                <span>
                                    {note ? note : formatPrice(price, lang, currency)}
                                </span>
                            ) : (
                                <span className="text-xl">{dictionary.agreed_price}</span>
                            )}
                        </div>
                    )}
                    {selectButton}
                </div>
            </div>
        </div>
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
    
    const [discountOption, setDiscountOption] = useLocalStorage<DiscountOption>('discountOption', 'none');
    const [promoCode, setPromoCode] = useLocalStorage<string>('promoCode', '');
    const [isClient, setIsClient] = useState(false);
    const [currency, setCurrency] = useLocalStorage<'uzs' | 'usd'>('currency', 'usd');

    useEffect(() => { setIsClient(true); }, []);

    const [total, setTotal] = useState<PriceDetails>({ base: 0, final: 0, discountApplied: [], savings: 0, bonus: null, surcharges: [], canApplyPackageDiscount: false });
    const [hasDiscountBeenApplied, setHasDiscountBeenApplied] = useState(false);

    useEffect(() => {
        if (isClient) {
            const wantsUpfrontPayment = discountOption === 'full';
            const isPackageDiscountEnabled = discountOption === 'package' || discountOption === 'full';
            
            const result = calculatePackagePrice({ 
                selectedServices, 
                wantsUpfrontPayment, 
                isPackageDiscountEnabled,
                promoCode 
            }, lang as 'uz' | 'ru' | 'en' | 'zh');
            setTotal(result);

            const hasActiveDiscount = result.discountApplied.length > 0;
            const justAppliedDiscount = hasActiveDiscount && !hasDiscountBeenApplied;
            if (justAppliedDiscount) {
                 confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, colors: ['#00C9FD', '#ADFFFE', '#FFFFFF', '#050583'] });
                setHasDiscountBeenApplied(true);
            }
            if(!hasActiveDiscount && hasDiscountBeenApplied) {
                setHasDiscountBeenApplied(false);
            }
        }
    }, [selectedServices, discountOption, isClient, lang, hasDiscountBeenApplied, promoCode]);

    const handleServiceToggle = (serviceId: keyof SelectedServices) => {
        const isCurrentlySelected = selectedServices[serviceId];
        
        const service = serviceDetails[serviceId];
        if (service && service.price > 0) {
            gtagEvent(isCurrentlySelected ? 'remove_from_cart' : 'add_to_cart', {
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

        const namingGroup: (keyof SelectedServices)[] = ['namingStandard', 'namingPremium', 'namingVIP'];
        const logoGroup: (keyof SelectedServices)[] = ['logoStandard', 'logoPremium', 'logoVIP'];

        const isNamingTariff = namingGroup.includes(serviceId);
        const isLogoTariff = logoGroup.includes(serviceId);

        setSelectedServices(prev => {
            const newState = { ...prev };
            if (isNamingTariff) {
                namingGroup.forEach(id => {
                    if (id !== serviceId) newState[id] = false;
                });
            }
            if (isLogoTariff) {
                logoGroup.forEach(id => {
                    if (id !== serviceId) newState[id] = false;
                });
            }
            newState[serviceId] = !isCurrentlySelected;
            return newState;
        });
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
    
    const handleOrder = () => {
        // Promokod bo'lsa yoki oldindan to'lov tanlangan bo'lsa majburiy upfront
        const isUpfront = total.isPromoValid || discountOption === 'full';
        localStorage.setItem('wantsUpfrontPayment', JSON.stringify(isUpfront));
        localStorage.setItem('isPackageDiscountEnabled', JSON.stringify(discountOption === 'package' || discountOption === 'full'));
        localStorage.setItem('appliedPromoCode', promoCode);
        onOrderNow();
    }
    
     const availableDiscountOptions: DiscountOption[] = ['none', 'full'];
     if (total.canApplyPackageDiscount) {
        availableDiscountOptions.splice(1, 0, 'package');
     }

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
                             const isNaming = groupKey === 'naming';
                             const isIdentity = groupKey === 'identity';
                             return (
                                 <React.Fragment key={groupKey}>
                                     {isIdentity && (
                                         <div className="py-8">
                                             <PopularPackages lang={lang} onSelectPackage={handlePopularPackageSelect} />
                                         </div>
                                     )}
                                     <ServiceGroup title={translations.categories[group.titleKey]} gridCols={undefined}>
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
                                     {isNaming && <GuaranteeBlock dictionary={translations.namingGuarantee} />}
                                     {isIdentity && <GuaranteeBlock dictionary={translations.designGuarantee} />}
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
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            <div>
                                <CardHeader className="p-0 text-left mb-6">
                                    <CardTitle className="text-2xl font-bold text-white">{translations.your_package}</CardTitle>
                                    <p className="text-blue-200 text-sm mt-1">{translations.your_package_desc}</p>
                                </CardHeader>
                                <CardContent className="p-0">
                                   {selectedServiceKeys.length > 0 ? (
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-white text-lg">{translations.selected_services_title}</h4>
                                            <div className="space-y-2">
                                                {selectedServiceKeys.map((key) => {
                                                    const service = serviceDetails[key];
                                                    return (
                                                        <div key={key} className="flex justify-between items-center text-lg animate-fade-in group">
                                                            <span className="text-white flex-1 pr-2">{service.label}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold font-mono text-gray-300">
                                                                    {service.price > 0 ? `${formatPrice(service.price, lang, currency, false)}` : service.note}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
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
                                </CardContent>
                            </div>

                             <div className="bg-black/20 p-6 rounded-2xl border border-white/10 space-y-4">
                                <h4 className="font-semibold text-white text-lg">{translations.cost_calculation_title}</h4>
                                
                                {total.base > 0 && (
                                    <div className="flex justify-between items-baseline text-base">
                                        <span className="text-blue-200">{translations.base_price}</span>
                                        <div className="text-lg font-mono">{formatPrice(total.base, lang, currency)}</div>
                                    </div>
                                )}

                                {total.surcharges.map(s => (
                                    <div key={s.name} className="flex justify-between items-center text-base text-amber-300">
                                        <span>{s.name}</span>
                                        <span className="font-mono">+ {formatPrice(s.value, lang, currency)}</span>
                                    </div>
                                ))}

                                {total.discountApplied.map(d => (
                                     <div key={d.name} className="space-y-1">
                                        <div className="flex justify-between items-baseline text-base text-green-300">
                                            <span className={cn(d.isPromoDiscount && "font-bold")}>{d.name}</span>
                                            <span className="font-mono">- {formatPrice(d.value, lang, currency)}</span>
                                        </div>
                                         {d.isPackageDiscount && (
                                            <p className="text-xs text-green-400/80">{translations.discountSelector.package_desc}</p>
                                        )}
                                        {/* Har bir chegirma turi uchun tushuntirish */}
                                        {(d.name.includes('10%') || d.name.includes('Oldindan') || d.name.includes('предоплату') || d.name.includes('upfront') || d.name.includes('预付款')) ? (
                                            <p className="text-xs text-green-400/80">{translations.discountSelector.full_desc}</p>
                                        ) : null}
                                        {d.isPromoDiscount && (
                                            <p className="text-xs text-amber-300 font-bold mt-1">
                                                {lang === 'ru' ? '⚠️ Требуется 100% предоплата' : (lang === 'en' ? '⚠️ 100% upfront payment required' : (lang === 'zh' ? '⚠️ 需要 100% 预付款' : '⚠️ 100% oldindan to\'lov talab qilinadi'))}
                                            </p>
                                        )}
                                    </div>
                                ))}

                                {total.savings > 0 && (
                                    <div className="bg-green-500/10 p-2 rounded-lg text-center text-sm font-semibold text-green-300 mt-2">
                                        {translations.total_savings}: {formatPrice(total.savings, lang, currency)}
                                    </div>
                                )}

                                <div className="pt-4 border-t border-white/10">
                                     <div className="flex justify-between items-baseline text-white">
                                        <span className="text-lg font-semibold">{translations.final_price}</span>
                                        <p className="text-4xl sm:text-5xl font-bold tracking-tight">
                                            {total.final > 0 ? formatPrice(total.final, lang, currency) : translations.agreed_price}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="pt-4 border-t border-white/10 space-y-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="promo-code" className="text-xs text-blue-200 flex items-center gap-2">
                                            <Ticket className="w-3 h-3" />
                                            {translations.promo_code_label}
                                        </Label>
                                        <div className="relative">
                                            <Input 
                                                id="promo-code"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                placeholder={translations.promo_code_placeholder}
                                                className="bg-white/10 border-white/20 text-white placeholder:text-white/30 h-9 text-sm focus-visible:ring-accent"
                                            />
                                            {promoCode && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    {total.isPromoValid ? (
                                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                                    ) : (
                                                        <span className="text-[10px] text-red-400 font-bold uppercase">{translations.promo_code_invalid}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                     </div>

                                     <div className={cn("transition-all duration-300", total.isPromoValid ? "opacity-50 pointer-events-none" : "opacity-100")}>
                                         <DiscountSelector 
                                             selectedOption={discountOption}
                                             onSelectOption={setDiscountOption}
                                             availableOptions={availableDiscountOptions}
                                             dictionary={translations.discountSelector}
                                         />
                                         {total.isPromoValid && (
                                             <p className="text-[10px] text-accent font-bold mt-2 text-center uppercase tracking-tight">
                                                 {lang === 'ru' ? 'Скидки не суммируются с промокодом' : (lang === 'en' ? 'Discounts do not stack with promo code' : (lang === 'zh' ? '折扣不与优惠码叠加' : 'Chegirmalar promokod bilan qo\'shilmaydi'))}
                                             </p>
                                         )}
                                     </div>
                                </div>
                                
                                <Button id="package-builder-cta" onClick={handleOrder} variant="default" size="lg" className="w-full text-lg py-3 mt-4" disabled={total.base === 0}>
                                    {translations.get_free_consultation}
                                </Button>
                             </div>
                        </div>
                    </Card>
                </div>
            </section>
        </>
    );
};

export default PackageBuilder;
