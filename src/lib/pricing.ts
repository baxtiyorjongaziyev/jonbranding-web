
'use client';

const USD_TO_UZS_RATE = 12700;

const convertToUzs = (usd: number) => {
    if (usd === 0) return 0;
    return Math.round(usd * USD_TO_UZS_RATE / 100000) * 100000;
}

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

const uzServiceDetails = {
    audit: {
        label: "Logo Auditi",
        description: "Mavjud logotipni tahlil qilish va yaxshilash bo'yicha tavsiyalar.",
        price: basePricesUSD.audit,
        features: ["Kuchli va zaif tomonlar tahlili", "Raqobatchilar bilan solishtirish", "Yaxshilash rejasini tuzish"],
        results: ["Xatoliklar ro'yxati", "Yaxshilash strategiyasi"],
        timeline: "2-3 ish kuni",
        note: "Faqat mavjud logo uchun."
    },
    namingCheck: {
        label: "Neyming Tekshiruvi",
        description: "Brend nomining O'zbekiston va xalqaro bazalarda bo'shligini tekshirish.",
        price: basePricesUSD.namingCheck,
        features: ["IMA bazasi (O'zbekiston)", "WIPO bazasi (Xalqaro)", "Domen va ijtimoiy tarmoqlar"],
        results: ["Huquqiy tozalik hisoboti", "Xatarlar tahlili"],
        timeline: "1-2 ish kuni"
    },
    consultation: {
        label: "30 daqiqalik konsultatsiya",
        description: "Brending bo'yicha Baxtiyorjon Gaziyevdan professional maslahat.",
        price: basePricesUSD.consultation,
        features: ["Muammoni aniqlashtirish", "Strategik tavsiyalar", "Savollarga javoblar"],
        results: ["Aniq harakatlar rejasi"],
        timeline: "Kelishilgan vaqtda",
        note: "Onlayn formatda."
    },
    strategy: {
        label: "Brend-strategiya va platforma",
        description: "Biznesingiz uchun natija keltiradigan poydevor.",
        price: basePricesUSD.strategy,
        features: ["Bozor tahlili", "Pozitsiyalash", "Brend platformasi", "Tone of Voice"],
        results: ["Brend platformasi hujjati", "Pozitsiyalash strategiyasi"],
        timeline: "20-30 ish kuni"
    },
    commStrategy: {
        label: "Kommunikatsion strategiya",
        description: "Mijozlar bilan muloqot strategiyasi va Tone of Voice.",
        price: basePricesUSD.commStrategy,
        features: ["Asosiy xabarlar", "Kanallarni rejalashtirish", "Content-pillerlar"],
        results: ["Muloqot qo'llanmasi"],
        timeline: "15-20 ish kuni"
    },
    namingVIP: {
        label: "👑 Naming VIP",
        description: "Katta va xalqaro bozorga mo'ljallangan strategik neyming.",
        price: basePricesUSD.namingVIP,
        features: ["Baxtiyorjon Gaziyev nazorati", "10+ eksklyuziv nomlar", "6 tilda tahlil", "Patent tekshiruvi"],
        results: ["Xalqaro darajadagi nom", "100% to'lov qaytarish kafolati"],
        timeline: "20–25 ish kuni"
    },
    namingPremium: {
        label: "Naming PREMIUM",
        description: "O'rta va rivojlanayotgan biznes uchun eng maqbul tanlov.",
        price: basePricesUSD.namingPremium,
        features: ["5 ta strategik nom", "Bir nechta tilda tahlil", "2 ta klass bo'yicha patent tekshiruvi"],
        results: ["Biznes maqsadga mos nom", "100% to'lov qaytarish kafolati"],
        recommended: true,
        timeline: "14–20 ish kuni"
    },
    namingStandard: {
        label: "Naming STANDARD",
        description: "Kichik biznes va startaplar uchun tezkor yechim.",
        price: basePricesUSD.namingStandard,
        features: ["3 ta jarangli nom", ".uz domen tekshiruvi", "Bitta klass bo'yicha patent tekshiruvi"],
        results: ["Tez start uchun nom", "Eslab qolish oson"],
        timeline: "7–10 ish kuni"
    },
    logoVIP: {
        label: "👑 VIP — Logo + Stil + Brandbook",
        description: "Katta va o'sishga yo'naltirilgan bizneslar uchun to'liq upakovka.",
        price: basePricesUSD.logoVIP,
        features: ["Baxtiyorjon Gaziyev nazorati", "8+ logotip konsepsiyasi", "25+ touchpoint dizayn", "To'liq Brandbook"],
        results: ["Mustahkam vizual tizim", "100% to'lov qaytarish kafolati"],
        timeline: "20–30 ish kuni"
    },
    logoPremium: {
        label: "Logo + Firma uslubi PREMIUM",
        description: "Brendini jiddiy rivojlantirayotganlar uchun vizual tizim.",
        price: basePricesUSD.logoPremium,
        features: ["5 ta logotip konsepsiyasi", "Firma uslubi (ranglar, shriftlar)", "15+ touchpoint dizayn"],
        results: ["Yaxlit vizual obraz", "100% to'lov qaytarish kafolati"],
        recommended: true,
        timeline: "14–20 ish kuni"
    },
    logoStandard: {
        label: "Logotip STANDARD",
        description: "Startaplar uchun sifatli va tezkor logotip.",
        price: basePricesUSD.logoStandard,
        features: ["3 ta logotip konsepsiyasi", "5 ta asosiy touchpoint", "Ranglar kodi"],
        results: ["Tayyor logotip", "Raqobatchilardan ajralib turish"],
        timeline: "7–10 ish kuni"
    },
    packaging: {
        label: "Qadoq dizayni",
        description: "3 SKU uchun professional qadoq ishlab chiqish.",
        price: basePricesUSD.packaging,
        features: ["Bozor tahlili", "2 ta dizayn konsepsiyasi", "Chopga tayyor fayllar"],
        results: ["Sotuvchi qadoq dizayni"],
        timeline: "10-15 ish kuni"
    },
    smm: {
        label: "Ijtimoiy tarmoqlar uchun stil",
        description: "Postlar va storislarni brendingda bezash tizimi.",
        price: basePricesUSD.smm,
        features: ["6 ta post shabloni", "6 ta stories shabloni", "Highlight coverlar"],
        results: ["Tayyor dizayn shablonlari"],
        timeline: "5-7 ish kuni"
    }
};

export const getServiceDetails = (lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz') => {
    return uzServiceDetails;
};

export function formatPrice(priceInUSD: number, lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz', currency: 'uzs' | 'usd' = 'usd') {
    if (priceInUSD === 0) return "Kelishiladi";
    let price = currency === 'uzs' ? convertToUzs(priceInUSD) : priceInUSD;
    let currencyString = currency === 'uzs' ? "so'm" : "$";
    return `${price.toLocaleString('fr-FR')} ${currencyString}`;
}

export type SelectedServices = { [key: string]: boolean; };

export const calculatePackagePrice = (selections: any, lang: string = 'uz'): any => {
    const { selectedServices, discountType = 'none', isRamadan } = selections;
    const sd = getServiceDetails(lang as any);
    let basePrice = 0;
    let mainServicesCount = 0;
    const mainKeys = ['strategy', 'commStrategy', 'namingStandard', 'namingPremium', 'namingVIP', 'logoStandard', 'logoPremium', 'logoVIP', 'packaging'];

    for (const key in selectedServices) {
        if (selectedServices[key] && sd[key as keyof typeof sd]) {
            basePrice += sd[key as keyof typeof sd].price;
            if (mainKeys.includes(key)) mainServicesCount++;
        }
    }

    const discountsApplied = [];
    let finalPrice = basePrice;

    // 1. Ramadan Discount (-50%) - Stackable or special toggle
    if (isRamadan) {
        const val = finalPrice * 0.50;
        discountsApplied.push({ name: 'Ramazon tuhfasi (-50%)', value: val });
        finalPrice -= val;
    } else {
        // Normal Discount Tiers
        if (discountType === 'package' && mainServicesCount >= 2) {
            const val = finalPrice * 0.20;
            discountsApplied.push({ name: 'Paketli chegirma (-20%)', value: val });
            finalPrice -= val;
        } else if (discountType === 'full') {
            // Full Upfront Payment: 20% (package) + 10% (upfront) = ~28% cumulative
            if (mainServicesCount >= 2) {
                const packageVal = finalPrice * 0.20;
                discountsApplied.push({ name: 'Paketli chegirma (-20%)', value: packageVal });
                finalPrice -= packageVal;
                
                const upfrontVal = finalPrice * 0.10;
                discountsApplied.push({ name: "Oldindan to'lov (-10%)", value: upfrontVal });
                finalPrice -= upfrontVal;
            } else {
                const upfrontVal = finalPrice * 0.10;
                discountsApplied.push({ name: "Oldindan to'lov (-10%)", value: upfrontVal });
                finalPrice -= upfrontVal;
            }
        }
    }

    return { base: basePrice, final: finalPrice, discountApplied: discountsApplied, savings: basePrice - finalPrice };
}

export const generateSummary = (selections: any, lang: string = 'uz'): string => {
    const { selectedServices } = selections;
    const sd = getServiceDetails(lang as any);
    return Object.entries(selectedServices).filter(([_, active]) => active).map(([key]) => sd[key as keyof typeof sd]?.label).filter(Boolean).join(', ');
}

export const comparisonData = (lang: 'uz' | 'ru' | 'en') => {
    const t = {
        uz: [
            { feature: "Strategik yondashuv", competitors: { jon: true, mano: true, abba: true, mountain: false } },
            { feature: "100% Pulni qaytarish kafolati", competitors: { jon: true, mano: false, abba: false, mountain: false } },
            { feature: "Narx va sifat mutanosibligi", competitors: { jon: "Yuqori", mano: "Premium", abba: "Premium", mountain: "O'rta" } },
            { feature: "Amaliy tajriba (1000+ loyiha)", competitors: { jon: true, mano: true, abba: true, mountain: true } }
        ],
        ru: [
            { feature: "Стратегический подход", competitors: { jon: true, mano: true, abba: true, mountain: false } },
            { feature: "100% Гарантия возврата", competitors: { jon: true, mano: false, abba: false, mountain: false } },
            { feature: "Цена и качество", competitors: { jon: "Высокое", mano: "Premium", abba: "Premium", mountain: "Средне" } },
            { feature: "Опыт (1000+ проектов)", competitors: { jon: true, mano: true, abba: true, mountain: true } }
        ],
        en: [
            { feature: "Strategic approach", competitors: { jon: true, mano: true, abba: true, mountain: false } },
            { feature: "100% Refund guarantee", competitors: { jon: true, mano: false, abba: false, mountain: false } },
            { feature: "Value for money", competitors: { jon: "High", mano: "Premium", abba: "Premium", mountain: "Medium" } },
            { feature: "Experience (1000+ projects)", competitors: { jon: true, mano: true, abba: true, mountain: true } }
        ]
    };
    return t[lang] || t.uz;
};
