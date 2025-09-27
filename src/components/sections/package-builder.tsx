

'use client';

import { useState, useEffect, FC } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { getServiceDetails, calculatePackagePrice, type PriceDetails, SelectedServices, packageDiscountThreshold, packageDiscount } from '@/lib/pricing';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Gift, Shield, Banknote, Info, ShoppingCart, CheckCircle, Trash2, Flame, ShieldCheck, FileText, ClipboardSignature, Megaphone, Shirt, PenTool, Share2, ClipboardList, Type, Palette, Layers, BookMarked, Box, Repeat, Award, ArrowDown, PercentCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import TiltCard from '../ui/tilt-card';


interface PackageBuilderProps {
    onOrderNow: () => void;
    lang: string;
}


const t = {
    uz: {
        title: "Narxlar va Xizmatlar",
        subtitle: "Bu yerda xizmatlarimizning taxminiy boshlang'ich narxlari ko'rsatilgan. Har bir kompaniya o'ziga xos bo'lgani uchun, yakuniy narx loyihaning murakkabligi, ish hajmi va sizning vazifalaringizga bog'liq.",
        categories: {
            tripwire: "Birinchi qadam (Tezkor xizmatlar)",
            main: "Asosiy xizmatlarimiz",
            additional: "Qo'shimcha xizmatlar",
            options: "Maxsus shartlar"
        },
        discount_alert_title: "Paketli chegirma!",
        discount_alert_desc: "Ushbu bo'limdan <strong>3 yoki undan ko'p</strong> xizmatni tanlang va umumiy summadan <strong>-20% chegirmaga</strong> ega bo'ling!",
        your_package: "Sizning to'plamingiz",
        your_package_desc: "O'zingizga mos xizmatlarni tanlang.",
        select_services: "Xizmatlarni tanlang",
        selected: "Tanlangan",
        select: "Tanlash",
        services_total: "Xizmatlar jami:",
        upfront_discount_title: "Oldindan to'lov uchun -10%",
        upfront_discount_desc: "Loyiha uchun 100% oldindan to'lov qiling",
        final_price: "Yakuniy narx:",
        order_with_discount: "Chegirma bilan buyurtma berish",
        get_free_consultation: "Bepul konsultatsiya olish",
        satisfaction_guarantee: "100% Mamnuniyat Kafolati",
        satisfaction_guarantee_desc: "Agar dastlabki konsepsiyalar yoqmasa, to'lovingizni qaytarib beramiz.",
        not_public_offer: "Bu ommaviy oferta emas",
        not_public_offer_desc: "Narxlar tanishish uchun. Yakuniy narx shartnomada belgilanadi.",
        total_savings: "Umumiy tejagan mablag'ingiz",
        gift_title: "Sovg'a!",
        agreed_price: "Kelishiladi",
        currency: "so'm",
        surcharges: {
            urgency: "Shoshilinch uchun ustama (+50%)",
            nda: "NDA uchun ustama (+25%)"
        }
    },
    ru: {
        title: "Цены и Услуги",
        subtitle: "Здесь указаны примерные стартовые цены на наши услуги. Поскольку каждая компания уникальна, окончательная цена зависит от сложности проекта, объема работы и ваших задач.",
        categories: {
            tripwire: "Первый шаг (Быстрые услуги)",
            main: "Наши основные услуги",
            additional: "Дополнительные услуги",
            options: "Особые условия"
        },
        discount_alert_title: "Пакетная скидка!",
        discount_alert_desc: "Выберите <strong>3 или более</strong> услуг из этого раздела и получите <strong>-20% скидку</strong> от общей суммы!",
        your_package: "Ваш пакет",
        your_package_desc: "Выберите подходящие вам услуги.",
        select_services: "Выберите услуги",
        selected: "Выбрано",
        select: "Выбрать",
        services_total: "Итого по услугам:",
        upfront_discount_title: "Скидка -10% за предоплату",
        upfront_discount_desc: "Внесите 100% предоплату за проект",
        final_price: "Итоговая цена:",
        order_with_discount: "Заказать со скидкой",
        get_free_consultation: "Получить бесплатную консультацию",
        satisfaction_guarantee: "100% Гарантия Удовлетворенности",
        satisfaction_guarantee_desc: "Если вам не понравятся первоначальные концепции, мы вернем вам деньги.",
        not_public_offer: "Это не публичная оферта",
        not_public_offer_desc: "Цены указаны для ознакомления. Окончательная цена будет зафиксирована в договоре.",
        total_savings: "Ваша общая экономия",
        gift_title: "Подарок!",
        agreed_price: "По догов.",
        currency: "сум",
         surcharges: {
            urgency: "Надбавка за срочность (+50%)",
            nda: "Надбавка за NDA (+25%)"
        }
    }
}

const formatPriceForDisplay = (price: number, lang: 'uz' | 'ru') => {
    const translations = t[lang];
    if (price === 0) return translations.agreed_price;
    return `${price.toLocaleString('fr-FR')} ${translations.currency}`;
}


type ServiceCategory = 'tripwire' |'main' | 'additional' | 'options';

const serviceCategories: Record<ServiceCategory, { title: string; services: (keyof SelectedServices)[] }> = {
    tripwire: {
        title: "Birinchi qadam (Tezkor xizmatlar)",
        services: ['audit', 'namingCheck', 'consultation']
    },
    main: {
        title: "Asosiy xizmatlarimiz",
        services: ['naming', 'logo', 'designSystem', 'brandbook', 'packaging']
    },
    additional: {
        title: "Qo'shimcha xizmatlar",
        services: ['strategy', 'commStrategy', 'smm', 'merch', 'illustrations']
    },
    options: {
        title: "Maxsus shartlar",
        services: ['urgency', 'nda']
    }
};

const serviceIcons: { [key in keyof SelectedServices]?: React.ElementType } = {
    strategy: ClipboardList,
    commStrategy: Megaphone,
    smm: Share2,
    merch: Shirt,
    illustrations: PenTool,
    urgency: Flame,
    nda: ShieldCheck,
    audit: FileText,
    namingCheck: ClipboardSignature,
    consultation: Info,
    naming: Type,
    logo: Palette,
    designSystem: Layers,
    brandbook: BookMarked,
    packaging: Box
};


const ServiceCard = ({ id, onSelect, selected, lang }: { id: keyof SelectedServices, onSelect: () => void, selected: boolean, lang: 'uz' | 'ru' }) => {
    const serviceDetails = getServiceDetails(lang);
    const detail = serviceDetails[id];
    const translations = t[lang];
    if (!detail) return null;
    const { label, description, price, note, timeline } = detail;
    const isPercentageBased = note && (note.includes('Narxga qo\'shiladi') || note.includes('к цене'));

    const Icon = serviceIcons[id];

    return (
        <Card 
            onClick={onSelect}
            className={cn(
                "rounded-2xl shadow-sm transition-all duration-300 relative overflow-hidden flex flex-col justify-between bg-white cursor-pointer hover:shadow-md h-full",
                selected && 'border-accent ring-2 ring-accent shadow-lg'
            )}
        >
            <div className="p-5 flex-grow">
                <div className="flex items-start gap-4">
                    {Icon && <Icon className={cn("h-8 w-8 flex-shrink-0 mt-1", id === 'urgency' ? 'text-red-500' : 'text-primary' )} />}
                    <div className='flex-1'>
                        <h4 className="text-lg font-bold text-dark-blue leading-tight">{label}</h4>
                        <p className="text-sm text-muted-foreground mt-2" dangerouslySetInnerHTML={{ __html: description }}></p>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-secondary/50 border-t mt-auto">
                 <div className="my-2 text-center">
                    {price > 0 && (
                    <span className="text-2xl font-bold text-primary whitespace-nowrap">{`+${formatPriceForDisplay(price, lang)}`}</span>
                    )}
                    {isPercentageBased && (
                        <span className="text-lg font-semibold text-primary whitespace-nowrap">{note}</span>
                    )}
                    {price === 0 && !isPercentageBased && (
                        <span className="text-xl font-bold text-primary whitespace-nowrap">{formatPriceForDisplay(price, lang)}</span>
                    )}
                </div>
                <Button 
                    className="w-full text-base py-3 h-auto"
                    variant={selected ? 'default' : 'outline'}
                    tabIndex={-1}
                >
                    {selected ? (
                        <>
                            <CheckCircle className="h-5 w-5 mr-2" />
                            {translations.selected}
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            {translations.select}
                        </>
                    )}
                </Button>
            </div>
        </Card>
    );
};

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

const PackageBuilder: FC<PackageBuilderProps> = ({ onOrderNow, lang }) => {
    const translations = t[lang as 'uz' | 'ru'];
    const serviceDetails = getServiceDetails(lang as 'uz' | 'ru');
    
    const [selectedServices, setSelectedServices] = useLocalStorage<SelectedServices>('selectedServices', {
        audit: false, namingCheck: false, consultation: false, strategy: false, commStrategy: false,
        naming: false, logo: false, designSystem: false, brandbook: false, packaging: false,
        smm: false, merch: false, illustrations: false, urgency: false, nda: false,
    });
    const [wantsUpfrontPayment, setWantsUpfrontPayment] = useLocalStorage('wantsUpfrontPayment', false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => { setIsClient(true); }, []);

    const [total, setTotal] = useState<PriceDetails>({ base: 0, final: 0, discountApplied: [], savings: 0, bonus: null, surcharges: [] });
    const [hasDiscountBeenApplied, setHasDiscountBeenApplied] = useState(false);

    useEffect(() => {
        if (isClient) {
            const result = calculatePackagePrice({ selectedServices, wantsUpfrontPayment }, lang as 'uz' | 'ru');
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

    const handleServiceToggle = (service: keyof SelectedServices) => {
        setSelectedServices(prev => {
            const newState = { ...prev };
            newState[service] = !newState[service];
            if (service === 'logo' && newState.logo) newState.designSystem = false;
            else if (service === 'designSystem' && newState.designSystem) newState.logo = false;
            return newState;
        });
    };
    
    if (!isClient) {
        return (
            <section id="package-builder" className="py-16 sm:py-24 bg-secondary pt-32">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                         <h2 className="text-3xl sm:text-4xl font-bold">{translations.title}</h2>
                         <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">{translations.subtitle}</p>
                    </div>
                     <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-8">
                           <Skeleton className="h-64 w-full" />
                           <Skeleton className="h-64 w-full" />
                        </div>
                        <div className="lg:col-span-1 sticky top-24">
                             <Skeleton className="h-64 w-full" />
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    const selectedServiceKeys = Object.entries(selectedServices)
                                .filter(([, value]) => value)
                                .map(([key]) => key as keyof SelectedServices);

    const translatedServiceCategories = {
        tripwire: { title: translations.categories.tripwire, services: serviceCategories.tripwire.services },
        main: { title: translations.categories.main, services: serviceCategories.main.services },
        additional: { title: translations.categories.additional, services: serviceCategories.additional.services },
        options: { title: translations.categories.options, services: serviceCategories.options.services }
    };

    return (
        <section id="package-builder" className="py-16 sm:py-24 bg-secondary pt-32">
             <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                     <h2 className="text-3xl sm:text-4xl font-bold">{translations.title}</h2>
                     <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">{translations.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                    <div className="lg:col-span-2 space-y-12">
                        {Object.entries(translatedServiceCategories).map(([key, category]) => (
                            <div key={key}>
                                <h3 className="text-2xl font-bold text-dark-blue mb-6">{category.title}</h3>
                                {key === 'main' && (
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     {category.services.map((serviceId) => {
                                        if (!serviceDetails[serviceId]) return null;
                                        return (
                                            <TiltCard key={serviceId} strength={10}>
                                                <ServiceCard
                                                    id={serviceId}
                                                    selected={selectedServices[serviceId] || false}
                                                    onSelect={() => handleServiceToggle(serviceId)}
                                                    lang={lang as 'uz' | 'ru'}
                                                />
                                            </TiltCard>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
    
                    <div className="lg:col-span-1 lg:sticky top-24">
                        <Card className="p-6 sm:p-8 rounded-2xl shadow-xl bg-gradient-to-br from-dark-blue to-primary text-white">
                            <CardHeader className="p-0 text-left">
                               <CardTitle className="text-2xl font-bold text-white">{translations.your_package}</CardTitle>
                               <p className="text-blue-200 text-sm mt-1">{translations.your_package_desc}</p>
                            </CardHeader>
                            <CardContent className="p-0 mt-6">
                                <div className="space-y-3 min-h-[100px] border-b border-white/10 pb-4 mb-4">
                                    {selectedServiceKeys.length > 0 ? (
                                        selectedServiceKeys
                                            .filter(key => serviceDetails[key]?.price > 0 || serviceDetails[key]?.note?.includes('qo\'shiladi') || serviceDetails[key]?.note?.includes('к цене'))
                                            .map((key) => {
                                                const service = serviceDetails[key];
                                                return (
                                                    <div key={key} className="flex justify-between items-center text-sm animate-fade-in group">
                                                        <span className="text-white flex-1 pr-2">{service.label}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-gray-300">
                                                                {service.price > 0 ? `+${formatPriceForDisplay(service.price, lang as 'uz' | 'ru')}` : service.note}
                                                            </span>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-6 w-6 text-gray-400 hover:bg-red-500/20 hover:text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={() => handleServiceToggle(key)}
                                                            >
                                                                <Trash2 className="h-4 w-4"/>
                                                            </Button>
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
                                
                                {total.base > 0 && (
                                    <div className="py-4 space-y-3 border-b border-white/10 mb-4">
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
                                                <span className="font-mono">- {d.value.toLocaleString('fr-FR')} {translations.currency}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {total.savings > 0 && (
                                    <div className="text-center py-4 my-4 bg-green-500/20 rounded-lg animate-fade-in border border-green-400/30">
                                        <p className="text-sm text-green-200">{translations.total_savings}</p>
                                        <p className="text-3xl font-bold text-green-300 animate-pulse">{formatPriceForDisplay(total.savings, lang as 'uz' | 'ru')}</p>
                                    </div>
                                )}
                                
                                {total.bonus && (
                                    <InfoCard
                                        icon={Gift}
                                        title={translations.gift_title}
                                        description={total.bonus}
                                        className="my-4 bg-accent/10 border-accent/20 text-accent-light"
                                    />
                                )}

                                <div className="mt-4 flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                                   <Label htmlFor="upfront-payment" className="flex flex-col cursor-pointer">
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

                                <div className='mt-6 text-center'>
                                     <p className="text-sm text-blue-200">{translations.final_price}</p>
                                      <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight flex justify-center items-baseline">
                                        {total.final > 0 ? (
                                            <>
                                                {total.final.toLocaleString('fr-FR')}
                                                <span className="text-2xl font-medium text-blue-200 ml-2">{translations.currency}</span>
                                            </>
                                        ) : (
                                            translations.agreed_price
                                        )}
                                    </p>
                                </div>


                                <Button onClick={onOrderNow} variant="default" size="lg" className="w-full mt-6 text-lg py-3" disabled={total.base === 0}>
                                    {total.discountApplied.length > 0 ? translations.order_with_discount : translations.get_free_consultation}
                                </Button>
                                
                                <div className="mt-8 space-y-4 text-left">
                                   <InfoCard
                                        icon={Sparkles}
                                        title={translations.satisfaction_guarantee}
                                        description={translations.satisfaction_guarantee_desc}
                                    />
                                    <InfoCard
                                        icon={Info}
                                        title={translations.not_public_offer}
                                        description={translations.not_public_offer_desc}
                                    />
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PackageBuilder;
