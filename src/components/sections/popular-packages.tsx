'use client';

import { FC, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { calculatePackagePrice, getServiceDetails, formatPrice, SelectedServices } from '@/lib/pricing';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface PopularPackagesProps {
    lang: string;
    onSelectPackage: () => void;
}


const PopularPackages: FC<PopularPackagesProps> = ({ lang, onSelectPackage }) => {
    const [translations, setTranslations] = useState<any>(null);
    const [currency, setCurrency] = useLocalStorage<'uzs' | 'usd'>('currency', 'usd');

    useEffect(() => {
        getDictionary(lang as Locale).then(dict => setTranslations(dict.popularPackages));
    }, [lang]);

    const handleCtaClick = () => {
        onSelectPackage();
        const packageBuilder = document.getElementById('package-builder');
        if (packageBuilder) {
            packageBuilder.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!translations) {
        return null; // Or a loading skeleton
    }

    const sd = getServiceDetails(lang as 'uz'|'ru'|'en'|'zh');
    const namingPrice = sd.namingPremium.price;
    const logoPrice = sd.logoPremium.price;
    const separatePrice = namingPrice + logoPrice;

    const packagePriceDetails = calculatePackagePrice({
        selectedServices: { namingPremium: true, logoPremium: true } as SelectedServices,
        wantsUpfrontPayment: false
    }, lang as 'uz'|'ru'|'en'|'zh');

    const upfrontPriceDetails = calculatePackagePrice({
        selectedServices: { namingPremium: true, logoPremium: true } as SelectedServices,
        wantsUpfrontPayment: true
    }, lang as 'uz'|'ru'|'en'|'zh');

    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue flex items-center justify-center gap-3">
                        <TrendingUp className="w-8 h-8 text-primary" />
                        {translations.title}
                    </h2>
                </div>
                <Card className="max-w-4xl mx-auto bg-gradient-to-tr from-dark-blue via-blue-950 to-black text-white rounded-3xl shadow-2xl p-8 sm:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 opacity-10">
                        <Sparkles className="w-full h-full text-accent" />
                    </div>
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <CardHeader className="p-0">
                                <CardTitle className="text-3xl font-extrabold text-white">
                                    {translations.packageTitle}
                                </CardTitle>
                                <CardDescription className="text-blue-200 mt-2 text-base">
                                    {translations.packageSubtitle}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 mt-6">
                                <ul className="space-y-3">
                                    {translations.features.map((feature: string, index: number) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
                            <div className="text-base text-gray-300 line-through">
                                {translations.separate}: {formatPrice(separatePrice, lang as 'uz'|'ru'|'en'|'zh', currency)}
                            </div>
                            <div className="text-2xl font-bold text-white mt-1">
                                {translations.packagePrice}: <span className="text-green-400">{formatPrice(packagePriceDetails.final, lang as 'uz'|'ru'|'en'|'zh', currency)}</span>
                            </div>
                            <div className="text-xs text-green-400 font-semibold">{translations.packageDiscount}</div>
                            
                            <div className="my-4 w-full h-px bg-white/10"></div>
                            
                            <div className="text-3xl font-extrabold text-white">
                                 {formatPrice(upfrontPriceDetails.final, lang as 'uz'|'ru'|'en'|'zh', currency)}
                            </div>
                            <div className="text-sm font-semibold text-accent">{translations.upfrontDiscount}</div>

                             <Button onClick={handleCtaClick} size="lg" className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg text-base">
                                {translations.ctaButton} <ArrowRight className="w-4 h-4 ml-2"/>
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    );
};

export default PopularPackages;
