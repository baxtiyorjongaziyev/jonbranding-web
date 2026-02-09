
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
    merch: 0,
    illustrations: 0,
    urgency: 0,
    nda: 0,
};

const uzServiceDetails = {
    audit: {
        label: "Logo Auditi",
        description: "Mavjud logotipni tahlil qilish va yaxshilash bo'yicha tavsiyalar.",
        price: basePricesUSD.audit,
        features: ["Logotipning kuchli va zaif tomonlari tahlili", "Raqobatchilarga nisbatan tahlil", "Yaxshilash bo'yicha tavsiyalar"]
    },
    namingCheck: {
        label: "Neyming Tekshiruvi",
        description: "Brend nomining O'zbekiston va xalqaro bazalarda bo'shligini tekshirish.",
        price: basePricesUSD.namingCheck,
        features: ["O'zbekiston bazasi bo'yicha tekshiruv", "Xalqaro WIPO bazasi bo'yicha tekshiruv", "Domen va ijtimoiy tarmoqlar tekshiruvi"]
    },
    consultation: {
        label: "30 daqiqalik konsultatsiya",
        description: "Brending bo'yicha professional maslahat.",
        price: basePricesUSD.consultation,
        features: ["Muammoni aniqlashtirish", "Savollarga javoblar", "Tavsiyalar"]
    },
    strategy: {
        label: "Brend-strategiya va platforma",
        description: "Biznesingiz uchun natija keltiradigan poydevor.",
        price: basePricesUSD.strategy,
        features: ["Bozor tahlili", "Maqsadli auditoriya xaritasi", "Brend platformasi", "Pozitsiyalash"]
    },
    commStrategy: {
        label: "Kommunikatsion strategiya",
        description: "Mijozlar bilan muloqot strategiyasi.",
        price: basePricesUSD.commStrategy,
        features: ["Brend ovozi (Tone of Voice)", "Asosiy xabarlar", "Kanallarni rejalashtirish"]
    },
    namingVIP: {
        label: "👑 Naming VIP",
        description: "Katta va xalqaro bozorga mo'ljallangan loyihalar uchun.",
        price: basePricesUSD.namingVIP,
        features: [
            "Baxtiyorjon Gaziyev shaxsiy nazorati",
            "10+ eksklyuziv nom variantlari",
            "6 tilda fonetik va semantik tahlil",
            "3 tagacha klass bo'yicha patent tekshiruvi"
        ],
        results: ["Xalqaro darajadagi kuchli nom", "Maksimal huquqiy xotirjamlik"],
        timeline: "20–25 ish kuni"
    },
    namingPremium: {
        label: "Naming PREMIUM",
        description: "O'rta va rivojlanayotgan biznes uchun.",
        price: basePricesUSD.namingPremium,
        features: [
            "5 ta strategik nom variantlari",
            "Bir nechta tilda tahlil",
            "2 ta klass bo'yicha patent tekshiruvi"
        ],
        results: ["Biznes maqsadga mos nom", "Huquqiy toza brend"],
        recommended: true,
        timeline: "14–20 ish kuni"
    },
    namingStandard: {
        label: "Naming STANDARD",
        description: "Kichik biznes va startaplar uchun.",
        price: basePricesUSD.namingStandard,
        features: [
            "3 ta jarangli nom variantlari",
            ".uz domen bo'shligi tekshiruvi"
        ],
        results: ["Tez start uchun nom", "Eslab qolish oson"],
        timeline: "7–10 ish kuni"
    },
    logoVIP: {
        label: "👑 VIP — Logo + Stil + Brandbook",
        description: "Katta va o'sishga yo'naltirilgan bizneslar uchun.",
        price: basePricesUSD.logoVIP,
        features: [
            "Baxtiyorjon Gaziyev ishtiroki va nazorati",
            "Brend strategiyasi asosida 8+ logotip konsepsiyasi",
            "25+ touchpoint dizayn",
            "To'liq Vizual Brandbook",
            "Logotip animatsiyasi"
        ],
        results: ["Mustahkam vizual tizim", "Aniq marketing qo'llanmasi"],
        timeline: "20–30 ish kuni"
    },
    logoPremium: {
        label: "Logo + Firma uslubi PREMIUM",
        description: "Brendini jiddiy rivojlantirayotganlar uchun.",
        price: basePricesUSD.logoPremium,
        features: [
            "5 ta strategik logotip konsepsiyasi",
            "Firma uslubi (ranglar, shriftlar)",
            "15+ touchpoint vizualizatsiyasi"
        ],
        results: ["Yaxlit vizual obraz", "Marketingda tartib"],
        recommended: true,
        timeline: "14–20 ish kuni"
    },
    logoStandard: {
        label: "Logotip STANDARD",
        description: "Startaplar uchun tezkor yechim.",
        price: basePricesUSD.logoStandard,
        features: [
            "3 ta logotip konsepsiyasi",
            "5 ta asosiy touchpoint vizualizatsiyasi"
        ],
        results: ["Tayyor logotip", "Raqobatchilardan ajralib turish"],
        timeline: "7–10 ish kuni"
    },
    packaging: {
        label: "Qadoq dizayni",
        description: "3 SKU uchun qadoq ishlab chiqish.",
        price: basePricesUSD.packaging,
        features: ["Bozor tahlili", "2 ta dizayn konsepsiyasi", "3 tagacha SKU adaptatsiyasi"]
    },
    smm: {
        label: "Ijtimoiy tarmoqlar uchun stil",
        description: "Postlar va storislarni brendingda bezash.",
        price: basePricesUSD.smm,
        features: ["6 ta post shabloni", "6 ta stories shabloni"]
    }
};

export const getServiceDetails = (lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz') => {
    return uzServiceDetails;
};

export function formatPrice(priceInUSD: number, lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz', currency: 'uzs' | 'usd' = 'usd') {
    if (priceInUSD === 0) return "Kelishiladi";
    let price = currency === 'uzs' ? convertToUzs(priceInUSD) : priceInUSD;
    let currencyString = currency === 'uzs' ? "so'm" : '$';
    return `${price.toLocaleString('fr-FR')} ${currencyString}`;
}

const PROMO_CODES: Record<string, number> = { 'JON2025': 0.05, 'BAXTIYOR': 0.05 };

export const calculatePackagePrice = (selections: any, lang: string = 'uz'): any => {
    const { selectedServices, wantsUpfrontPayment, promoCode } = selections;
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
    if (mainServicesCount >= 2) {
        const val = basePrice * 0.20;
        discountsApplied.push({ name: 'Paketli chegirma (-20%)', value: val });
        finalPrice -= val;
    }
    if (wantsUpfrontPayment) {
        const val = finalPrice * 0.10;
        discountsApplied.push({ name: 'Oldindan to\'lov (-10%)', value: val });
        finalPrice -= val;
    }
    const normalizedPromo = promoCode?.trim().toUpperCase();
    if (PROMO_CODES[normalizedPromo]) {
        const val = finalPrice * PROMO_CODES[normalizedPromo];
        discountsApplied.push({ name: `Promokod (${normalizedPromo})`, value: val });
        finalPrice -= val;
    }

    return { base: basePrice, final: finalPrice, discountApplied: discountsApplied, savings: basePrice - finalPrice };
}
