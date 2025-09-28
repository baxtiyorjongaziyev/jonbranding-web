'use client';

import { useState, useEffect, FC } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { getServiceDetails, calculatePackagePrice, type PriceDetails, SelectedServices, formatPrice } from '@/lib/pricing';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Gift, Info, ShoppingCart, CheckCircle, Trash2, Flame, ShieldCheck, FileText, ClipboardSignature, Megaphone, Shirt, PenTool, ClipboardList, Type, Palette, Layers, BookMarked, Box, PercentCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Switch } from '@/components/ui/switch';


interface PackageBuilderProps {
    onOrderNow: () => void;
    lang: string;
    dictionary: any;
}

const formatPriceForDisplay = (price: number, lang: 'uz' | 'ru' | 'en', dictionary: any) => {
    if (price === 0) return dictionary.agreed_price;
    return `${price.toLocaleString('fr-FR')} ${dictionary.currency}`;
}


const serviceIcons: { [key: string]: React.ElementType } = {
    strategy: ClipboardList,
    commStrategy: Megaphone,
    smm: PenTool,
    merch: Shirt,
    illustrations: Palette,
    urgency: Flame,
    nda: ShieldCheck,
    audit: FileText,
    namingCheck: ClipboardSignature,
    consultation: Info,
    naming: Type,
    logo: Layers,
    designSystem: BookMarked,
    brandbook: BookMarked,
    packaging: Box,
    namingStart: Type,
    namingPro: Type,
    namingMax: Type,
    logoStart: Layers,
    logoPro: Layers,
    logoMax: Layers,
};

const ServiceCard = ({ id, onSelect, selected, lang, dictionary }: { id: keyof SelectedServices, onSelect: () => void, selected: boolean, lang: 'uz' | 'ru' | 'en', dictionary: any }) => {
    const serviceDetails = getServiceDetails(lang);
    const detail = serviceDetails[id];
    if (!detail) return null;
    const { label, description, price, note } = detail;
    const isPercentageBased = note && (note.includes('%'));
    const Icon = serviceIcons[id] || Sparkles;

    return (
        <div 
            onClick={onSelect}
            className={cn(
                "relative group overflow-hidden rounded-2xl p-px cursor-pointer transition-all duration-300 h-full",
                "bg-secondary text-foreground"
            )}
        >
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br from-primary/50 to-accent/50 transition-opacity duration-300", 
                selected ? "opacity-100" : "opacity-0 group-hover:opacity-50"
            )} />
            <div className="relative bg-background text-foreground rounded-[15px] h-full p-6 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                         <div className={cn("p-3 rounded-full", selected ? "bg-primary/10" : "bg-secondary")}>
                            <Icon className={cn("w-6 h-6", selected ? "text-primary" : "text-muted-foreground")} />
                        </div>
                    </div>
                    <h4 className="text-xl font-bold leading-tight">{label}</h4>
                    <p className="text-sm text-muted-foreground mt-2 min-h-[40px]" dangerouslySetInnerHTML={{ __html: description }}></p>
                </div>
                <div className="mt-4">
                    <div className="my-2 min-h-[40px] flex items-baseline justify-start">
                        {(price > 0 || note) && (
                        <span className="text-3xl font-bold whitespace-nowrap">
                            {isPercentageBased ? note : formatPrice(price, lang, dictionary)}
                        </span>
                        )}
                        {price === 0 && !note && (
                            <span className="text-xl font-bold whitespace-nowrap">{formatPriceForDisplay(price, lang, dictionary)}</span>
                        )}
                    </div>
                    <Button 
                        className={cn(
                            "w-full text-base py-3 h-auto transition-colors duration-300",
                            selected 
                                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                        variant="secondary"
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
        </div>
    );
};

const ServiceGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-dark-blue">{title}</h3>
        {children}
    </div>
);

const InfoCard = ({ icon: Icon, title, description, className, children }: { icon: React.ElementType, title: string, description: string, className?: string, children?: React.ReactNode }) => (
    <div className={cn("bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-4 text-left", className)}>
        <div className="flex-shrink-0 text-accent p-2 rounded-lg mt-1">
            {Icon && <Icon className="w-5 h-5" />}
        </div>
        <div className="flex-1">
            <h5 className="font-semibold text-white">{title}</h5>
            <p className="text-sm text-blue-200">{description}</p>
        </div>
        {children}
    </div>
);

const PackageBuilder: FC<PackageBuilderProps> = ({ onOrderNow, lang, dictionary }) => {
    const translations = dictionary;
    const serviceDetails = getServiceDetails(lang as 'uz' | 'ru' | 'en');
    
    const [selectedServices, setSelectedServices] = useLocalStorage<SelectedServices>('selectedServices', {
        audit: false, namingCheck: false, consultation: false, strategy: false, commStrategy: false,
        namingStart: false, namingPro: true, namingMax: false,
        logoStart: false, logoPro: true, logoMax: false,
        brandbook: false, packaging: false,
        smm: false, merch: false, illustrations: false, urgency: false, nda: false,
    });
    const [wantsUpfrontPayment, setWantsUpfrontPayment] = useLocalStorage('wantsUpfrontPayment', false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => { setIsClient(true); }, []);

    const [total, setTotal] = useState<PriceDetails>({ base: 0, final: 0, discountApplied: [], savings: 0, bonus: null, surcharges: [] });
    const [hasDiscountBeenApplied, setHasDiscountBeenApplied] = useState(false);

    useEffect(() => {
        if (isClient) {
            const result = calculatePackagePrice({ selectedServices, wantsUpfrontPayment }, lang as 'uz' | 'ru' | 'en');
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

    const handleTariffSelect = (group: ('namingStart' | 'namingPro' | 'namingMax')[] | ('logoStart' | 'logoPro' | 'logoMax')[], serviceId: keyof SelectedServices) => {
        setSelectedServices(prev => {
            const newState = { ...prev };
            // First, deselect all other services in the group
            group.forEach(id => {
                if (id !== serviceId) newState[id] = false;
            });
            // Then, toggle the selected one
            newState[serviceId] = !newState[serviceId];
            return newState;
        });
    };

    const handleServiceToggle = (serviceId: keyof SelectedServices) => {
        if (['namingStart', 'namingPro', 'namingMax'].includes(serviceId)) {
            handleTariffSelect(['namingStart', 'namingPro', 'namingMax'], serviceId);
        } else if (['logoStart', 'logoPro', 'logoMax'].includes(serviceId)) {
            handleTariffSelect(['logoStart', 'logoPro', 'logoMax'], serviceId);
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
        tripwire: { titleKey: "tripwire", services: ['audit', 'namingCheck', 'consultation'] },
        strategy: { titleKey: "strategy", services: ['strategy', 'commStrategy'] },
        naming: { titleKey: "naming", services: ['namingStart', 'namingPro', 'namingMax'] },
        identity: { titleKey: "identity", services: ['logoStart', 'logoPro', 'logoMax', 'brandbook', 'packaging'] },
        additional: { titleKey: "additional", services: ['smm', 'merch', 'illustrations'] },
        options: { titleKey: "options", services: ['urgency', 'nda'] }
    };

    return (
        <>
            <section id="package-builder" className="py-16 sm:py-24 bg-secondary pt-32">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <div className="prose prose-lg mx-auto text-left">
                            <h3 className="font-bold text-dark-blue">{translations.introTitle}</h3>
                            <p className="text-muted-foreground">{translations.introP1}</p>
                            <p className="text-muted-foreground">{translations.introP2}</p>
                            <h4 className="font-bold text-dark-blue">{translations.introSubtitle}</h4>
                            <p className="text-muted-foreground">{translations.introP3}</p>
                            <ul className="text-muted-foreground">
                                {translations.introList.map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold">{translations.title}</h2>
                        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">{translations.subtitle}</p>
                    </div>
                    
                    <div className="space-y-16">
                        {Object.values(serviceGroups).map((group, index) => (
                           <ServiceGroup key={index} title={translations.categories[group.titleKey]}>
                               {group.titleKey === 'identity' && (
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
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                     {group.services.map((serviceId) => {
                                        const typedServiceId = serviceId as keyof SelectedServices;
                                        if (!serviceDetails[typedServiceId]) return null;
                                        return (
                                            <ServiceCard
                                                key={typedServiceId}
                                                id={typedServiceId}
                                                selected={selectedServices[typedServiceId] || false}
                                                onSelect={() => handleServiceToggle(typedServiceId)}
                                                lang={lang as 'uz' | 'ru' | 'en'}
                                                dictionary={translations}
                                            />
                                        );
                                    })}
                                </div>
                           </ServiceGroup>
                        ))}
                    </div>
                </div>
            </section>
        
            <section className="bg-secondary py-16">
                <div className="container mx-auto px-4">
                    <Card className="p-6 sm:p-8 rounded-2xl shadow-xl bg-gradient-to-br from-dark-blue to-primary text-white">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                            
                            <div className="lg:col-span-2">
                                <CardHeader className="p-0 text-left mb-6">
                                    <CardTitle className="text-2xl font-bold text-white">{translations.your_package}</CardTitle>
                                    <p className="text-blue-200 text-sm mt-1">{translations.your_package_desc}</p>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                        <div className="space-y-3 border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0 sm:pr-8">
                                            <h4 className="font-semibold text-white">{translations.selected_services_title}</h4>
                                            {selectedServiceKeys.length > 0 ? (
                                                selectedServiceKeys
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
                                                                        {service.price > 0 ? `${formatPrice(service.price, lang as 'uz' | 'ru' | 'en')}` : service.note}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                            ) : (
                                                <div className="text-center text-blue-200 text-sm py-4 flex flex-col items-center gap-2">
                                                    <ShoppingCart className="w-8 h-8"/>
                                                    <p>{translations.select_services}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-white">{translations.cost_calculation_title}</h4>
                                            {total.base > 0 && (
                                                <>
                                                    <div className="flex justify-between items-center text-sm font-medium">
                                                        <span className="text-blue-200">{translations.services_total}</span>
                                                        <span className="font-mono">{total.base.toLocaleString('fr-FR')} {translations.currency}</span>
                                                    </div>
                                                    {total.surcharges.map(s => (
                                                        <div key={s.name} className="flex justify-between items-center text-sm text-amber-300">
                                                            <span>{s.name}</span>
                                                            <span className="font-mono">+ {s.value.toLocaleString('fr-FR')} {translations.currency}</span>
                                                        </div>
                                                    ))}
                                                    {total.discountApplied.map(d => (
                                                        <div key={d.name} className="flex justify-between items-center text-sm text-green-300">
                                                            <span>{d.name}</span>
                                                            <span className="font-mono">- {formatPriceForDisplay(d.value, lang as 'uz' | 'ru' | 'en', translations)}</span>
                                                        </div>
                                                    ))}
                                                </>
                                            )}
                                            {total.savings > 0 && (
                                                <div className="flex justify-between items-center text-sm font-bold text-green-300 pt-2 border-t border-green-400/20">
                                                    <span>{translations.total_savings}</span>
                                                    <span className="font-mono">{formatPriceForDisplay(total.savings, lang as 'uz' | 'ru' | 'en', translations)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

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
                                        <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                                        {total.final > 0 ? (
                                            <>
                                                {formatPrice(total.final, lang as 'uz' | 'ru' | 'en')}
                                            </>
                                        ) : (
                                            translations.agreed_price
                                        )}
                                    </p>
                                </div>
                                
                                <div className="mt-4 flex items-center justify-between w-full max-w-xs">
                                   <Label htmlFor="upfront-payment" className="flex flex-col cursor-pointer flex-1 pr-4 text-left">
                                        <span className="font-semibold text-white">{translations.upfront_discount_title}</span>
                                        <span className="text-xs text-blue-200">{translations.upfront_discount_desc}</span>
                                   </Label>
                                   <Switch
                                        id="upfront-payment"
                                        checked={wantsUpfrontPayment}
                                        onCheckedChange={setWantsUpfrontPayment}
                                        aria-label={translations.upfront_discount_title}
                                        className="flex-shrink-0"
                                    />
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

export default PackageBuilder;
    
    

    
