
'use client';

const USD_TO_UZS_RATE = 12700;

export type SelectedServices = {
    audit?: boolean;
    namingCheck?: boolean;
    consultation?: boolean;
    strategy?: boolean;
    commStrategy?: boolean;
    namingVIP?: boolean;
    namingPremium?: boolean;
    namingStandard?: boolean;
    logoVIP?: boolean;
    logoPremium?: boolean;
    logoStandard?: boolean;
    packaging?: boolean;
    smm?: boolean;
    urgency?: boolean;
    nda?: boolean;
};

const basePricesUSD = {
    audit: 59,
    namingCheck: 79,
    consultation: 51,
    strategy: 4750,
    commStrategy: 3950,
    namingVIP: 1450,
    namingPremium: 980,
    namingStandard: 650,
    logoVIP: 2950,
    logoPremium: 1550,
    logoStandard: 780,
    packaging: 1150,
    smm: 980,
    urgency: 0,
    nda: 0
};

export const getServiceDetails = (lang: string = 'uz') => {
    const isRu = lang === 'ru';
    const isEn = lang === 'en';

    return {
        audit: {
            label: isRu ? "Аудит логотипа" : (isEn ? "Logo Audit" : "Logo Auditi"),
            description: isRu ? "Анализ существующего логотипа и рекомендации." : (isEn ? "Analysis of existing logo." : "Mavjud logotipni tahlil qilish."),
            price: basePricesUSD.audit,
            timeline: "2-3 ish kuni"
        },
        namingCheck: {
            label: isRu ? "Проверка нейминга" : (isEn ? "Naming Check" : "Neyming Tekshiruvi"),
            description: isRu ? "Проверка доступности названия." : (isEn ? "Checking name availability." : "Brend nomining bo'shligini tekshirish."),
            price: basePricesUSD.namingCheck,
            timeline: "1-2 ish kuni"
        },
        consultation: {
            label: isRu ? "Консультация" : (isEn ? "Consultation" : "Konsultatsiya"),
            description: isRu ? "Профессиональный совет по брендингу." : (isEn ? "Professional branding advice." : "Brending bo'yicha professional maslahat."),
            price: basePricesUSD.consultation,
            timeline: "Kelishilgan vaqtda"
        },
        strategy: {
            label: isRu ? "Бренд-стратегия" : (isEn ? "Brand strategy" : "Brend-strategiya va platforma"),
            description: isRu ? "Фундамент для бизнеса." : (isEn ? "Foundation for business." : "Biznesingiz uchun natija keltiradigan poydevor."),
            price: basePricesUSD.strategy,
            timeline: "20-30 ish kuni"
        },
        commStrategy: {
            label: isRu ? "Комм. стратегия" : (isEn ? "Comm. strategy" : "Kommunikatsion strategiya"),
            description: isRu ? "Стратегия общения." : (isEn ? "Communication strategy." : "Mijozlar bilan muloqot strategiyasi."),
            price: basePricesUSD.commStrategy,
            timeline: "15-20 ish kuni"
        },
        namingVIP: {
            label: "Naming VIP",
            description: "Nom emas — aktiv",
            subDescription: "Jiddiy investitsiya qiladiganlar uchun",
            price: basePricesUSD.namingVIP,
            timeline: "⏱ 15 ish kuni",
            features: [
                "15 ta nom varianti tayyorlanadi",
                "Har bir nom uchun to'liq strategik izoh",
                "Talaffuz, jarang va esda qolishi tekshiriladi",
                "O'zbekiston va xalqaro bazalarda patent tekshiruvi (WIPO) va patentga topshirib berish xizmati (birinchi bosqich to'liq)",
                "Domen va Username tekshiruvi",
                "Cheksiz tuzatish (30 kun ichida)",
                "Logoning to'liq mulkchilik huquqi sertifikati"
            ],
            benefits: [
                { icon: "🌍", title: "Xalqaro bozorga tayyorsiz", description: "Nom xalqaro talablar asosida tekshiriladi." },
                { icon: "🔒", title: "Nom to'liq sizniki", description: "Rasmiy patent himoyasi bilan ta'minlanadi." },
                { icon: "💎", title: "Biznes uchun real aktiv", description: "Himoyalangan nom biznesning qimmatli mulki." },
                { icon: "🎯", title: "Eng to'g'ri yo'l", description: "Bozorda adashmasligingiz uchun strategik tanlov." }
            ]
        },
        namingPremium: {
            label: "Naming Premium",
            description: "To'g'ri nom, to'g'ri asos",
            price: basePricesUSD.namingPremium,
            recommended: true,
            timeline: "⏱ 7 ish kuni",
            results: ["10 ta nom varianti", "O'zbekiston bazasida patent tekshiruvi"],
            benefits: [{ icon: "⚖️", title: "Huquqiy xavfsizlik", description: "Kelajakdagi muammolardan saqlanasiz." }]
        },
        namingStandard: {
            label: "Naming Standart",
            description: "Tez va ishonchli start",
            price: basePricesUSD.namingStandard,
            timeline: "⏱ 5 ish kuni",
            results: ["5 ta nom varianti", "Domen tekshiruvi"],
            benefits: [{ icon: "⚡", title: "Tejamkorlik", description: "Tekshirilgan nomga tezkor ega bo'lasiz." }]
        },
        logoStandard: {
            label: "Unikal Logo",
            description: "Endigina boshlamoqchi bo'lganlar uchun",
            subDescription: "Sifatli start uchun",
            price: basePricesUSD.logoStandard,
            timeline: "⏱ 5 ish kuni",
            features: [
                "2 ta logo varianti — ikkalasidan birini tanlaysiz",
                "Har bir variant uchun izoh beriladi",
                "Logo 4 xil ko'rinishda (hamma formatlar)",
                "Ijtimoiy tarmoqlar uchun profil rasmi",
                "3 xil fayl formati (PNG, SVG, AI)",
                "8 ta aloqa nuqtasida vizual namoyish",
                "2 ta tuzatish imkoniyati"
            ],
            benefits: [
                { icon: "🎯", title: "Universal qo'llanilish", description: "Logongiz hamma joyga — sayt, Instagramga tayyor." },
                { icon: "✅", title: "Professional ko'rinish", description: "Mijozlar birinchi qarashda ishonch his qiladi." },
                { icon: "👁️", title: "Real ko'rinish", description: "8 ta nuqtada logongiz qandayligini ko'rasiz." },
                { icon: "🛡️", title: "Fayllar to'liq sizniki", description: "Barcha manba fayllar topshiriladi." }
            ]
        },
        logoPremium: {
            label: "Logo + Firma uslubi",
            description: "O'sishni rejalashtiraganlar uchun",
            subDescription: "Vizual tizim va tanilish",
            price: basePricesUSD.logoPremium,
            recommended: true,
            timeline: "⏱ 10 ish kuni",
            features: [
                "3 ta logo varianti — uchtalasidan birini tanlaysiz",
                "Rasmiy ranglar to'plami va kodlari",
                "Rasmiy brend shrifti",
                "15 ta aloqa nuqtasida vizual namoyish",
                "3 ta tuzatish imkoniyati"
            ],
            benefits: [
                { icon: "🏆", title: "Har joyda bir xil ko'rinasiz", description: "Sayt, Instagram, vizitka — hammasi bir uslubda." },
                { icon: "💼", title: "Xodimlaringiz ham to'g'ri ishlatadi", description: "Aniq ranglar va shrift bo'lgach, hech kim adashmaydi." },
                { icon: "📸", title: "Mijozlarga ko'rsatishga tayyor", description: "15 ta nuqtada brendingizni vizual ko'rasiz." },
                { icon: "📈", title: "Brend qiymati oshadi", description: "Izchil ko'rinish professional biznes belgisidir." }
            ]
        },
        logoVIP: {
            label: "Logo + Stil + Brandbook",
            description: "Hamma narsani to'g'ri qilmoqchilar uchun",
            subDescription: "To'liq brend konstitutsiyasi",
            price: basePricesUSD.logoVIP,
            timeline: "⏱ 15–20 ish kuni",
            features: [
                "3 ta logo varianti + strategik izoh",
                "To'liq Brandbook (30-50 sahifa)",
                "25 ta aloqa nuqtasida professional vizual",
                "Cheksiz tuzatish (30 kun ichida)",
                "Logoning to'liq mulkchilik huquqi sertifikati"
            ],
            benefits: [
                { icon: "📖", title: "Istalgan odamga bera olasiz", description: "Qo'llanma bilan dizayner yoki xodim to'g'ri ishlaydi." },
                { icon: "🔒", title: "Brend buzilmaydi", description: "Brendingiz 10 yildan keyin ham kuchli ko'rinadi." },
                { icon: "🌍", title: "Xalqaro daraja", description: "Investor yoki sheriklar jiddiy kompaniya ekaningizni biladi." },
                { icon: "💎", title: "Bir marta qilinadigan investitsiya", description: "Har yili qayta dizayn qilish o'rniga, bir marta to'g'ri qiling." }
            ]
        },
        packaging: { label: "Qadoq dizayni", price: basePricesUSD.packaging, timeline: "10-15 ish kuni" },
        smm: { label: "Ijtimoiy tarmoqlar uchun stil", price: basePricesUSD.smm, timeline: "5-7 ish kuni" },
        urgency: { label: "Shoshilinch loyiha (+50%)", price: 0 },
        nda: { label: "NDA — Maxfiylik (+50%)", price: 0 }
    };
};

export function formatPrice(priceInUSD: number, lang: string = 'uz', currency: 'uzs' | 'usd' = 'usd') {
    if (priceInUSD === 0) return lang === 'uz' ? "Kelishiladi" : "Agreed";
    let price = currency === 'uzs' ? Math.round(priceInUSD * USD_TO_UZS_RATE / 100000) * 100000 : priceInUSD;
    let currencyString = currency === 'uzs' ? "so'm" : "$";
    return `${price.toLocaleString('fr-FR')} ${currencyString}`;
}

export const calculatePackagePrice = (selections: any, lang: string = 'uz'): any => {
    const { selectedServices, discountType = 'none', promoCode = '' } = selections;
    const sd = getServiceDetails(lang) as any;
    
    let basePrice = 0;
    let mainServicesCount = 0;
    const mainKeys = ['strategy', 'commStrategy', 'namingStandard', 'namingPremium', 'namingVIP', 'logoStandard', 'logoPremium', 'logoVIP', 'packaging'];

    for (const key in selectedServices) {
        if (selectedServices[key] && sd[key] && key !== 'urgency' && key !== 'nda') {
            basePrice += sd[key].price;
            if (mainKeys.includes(key)) mainServicesCount++;
        }
    }

    const surchargesApplied = [];
    let surchargesTotal = 0;

    if (selectedServices.urgency) {
        const val = basePrice * 0.5;
        surchargesTotal += val;
        surchargesApplied.push({ name: 'Shoshilinch loyiha (+50%)', value: val });
    }
    if (selectedServices.nda) {
        const val = basePrice * 0.5;
        surchargesTotal += val;
        surchargesApplied.push({ name: 'NDA (Maxfiylik) (+50%)', value: val });
    }

    const totalBeforeDiscounts = basePrice + surchargesTotal;
    let finalPrice = totalBeforeDiscounts;
    const discountsApplied = [];

    const isPromoApplied = ['RAMAZON', 'PCG', 'KURSDOSH', 'TEZ NATIJA'].includes(promoCode?.toUpperCase());

    if (isPromoApplied) {
        const val = totalBeforeDiscounts * 0.50;
        discountsApplied.push({ name: 'Maxsus chegirma (-50%)', value: val });
        finalPrice -= val;
    } else {
        if (discountType === 'package' && mainServicesCount >= 2) {
            const val = totalBeforeDiscounts * 0.20;
            discountsApplied.push({ name: 'Paketli chegirma (-20%)', value: val });
            finalPrice -= val;
        } else if (discountType === 'full') {
            if (mainServicesCount >= 2) {
                const packageVal = totalBeforeDiscounts * 0.20;
                discountsApplied.push({ name: 'Paketli chegirma (-20%)', value: packageVal });
                finalPrice -= packageVal;
                const upfrontVal = finalPrice * 0.10;
                discountsApplied.push({ name: "Oldindan to'lov (-10%)", value: upfrontVal });
                finalPrice -= upfrontVal;
            } else {
                const upfrontVal = totalBeforeDiscounts * 0.10;
                discountsApplied.push({ name: "Oldindan to'lov (-10%)", value: upfrontVal });
                finalPrice -= upfrontVal;
            }
        }
    }

    return { base: basePrice, surchargesTotal, final: finalPrice, discountApplied: discountsApplied, surchargesApplied, savings: totalBeforeDiscounts - finalPrice, isPromoApplied };
}

export const comparisonData = (lang: 'uz' | 'ru' | 'en' = 'uz') => {
    return [
        { feature: "Strategik yondashuv", competitors: { jon: true, mano: true, abba: true, mountain: true } },
        { feature: "Bozor tahlili", competitors: { jon: true, mano: true, abba: true, mountain: true } },
        { feature: "Patent tekshiruvi", competitors: { jon: true, mano: "Kelishiladi", abba: false, mountain: false } },
        { feature: "Premium dizayn sifati", competitors: { jon: true, mano: true, abba: true, mountain: true } },
        { feature: "Narx (o'rtacha)", competitors: { jon: "$1,500+", mano: "$5,000+", abba: "$3,000+", mountain: "$2,500+" } },
        { feature: "Tezkor aloqa (24/7)", competitors: { jon: true, mano: false, abba: false, mountain: false } },
        { feature: "Bajarish muddati", competitors: { jon: "2-4 hafta", mano: "2-3 oy", abba: "1-2 oy", mountain: "1-2 oy" } }
    ];
};
