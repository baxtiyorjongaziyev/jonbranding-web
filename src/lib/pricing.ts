
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
        features: ["Logotipning kuchli va zaif tomonlari tahlili", "Raqobatchilarga nisbatan tahlil", "Yaxshilash bo'yicha tavsiyalar"],
        results: ["Xatoliklar ro'yxati", "Yaxshilash rejasi"],
        timeline: "2-3 ish kuni",
        note: "Faqat mavjud logo uchun."
    },
    namingCheck: {
        label: "Neyming Tekshiruvi",
        description: "Brend nomining O'zbekiston va xalqaro bazalarda bo'shligini tekshirish.",
        price: basePricesUSD.namingCheck,
        features: ["O'zbekiston bazasi (IMA)", "Xalqaro WIPO bazasi", "Domen va ijtimoiy tarmoqlar"],
        results: ["Huquqiy tozalik hisoboti", "Xatarlar tahlili"],
        timeline: "1-2 ish kuni",
        note: "Bitta nom uchun."
    },
    consultation: {
        label: "30 daqiqalik konsultatsiya",
        description: "Brending bo'yicha Baxtiyorjon Gaziyevdan professional maslahat.",
        price: basePricesUSD.consultation,
        features: ["Muammoni aniqlashtirish", "Savollarga javoblar", "Strategik tavsiyalar"],
        results: ["Aniq harakatlar rejasi"],
        timeline: "Kelishilgan vaqtda",
        note: "Onlayn formatda."
    },
    strategy: {
        label: "Brend-strategiya va platforma",
        description: "Biznesingiz uchun natija keltiradigan poydevor.",
        price: basePricesUSD.strategy,
        features: ["Bozor tahlili", "Maqsadli auditoriya xaritasi", "Brend platformasi", "Pozitsiyalash", "RTB (Ishonch sabablari)"],
        results: ["Brend platformasi hujjati", "Pozitsiyalash strategiyasi"],
        timeline: "20-30 ish kuni",
        note: "Katta loyihalar uchun tavsiya etiladi."
    },
    commStrategy: {
        label: "Kommunikatsion strategiya",
        description: "Mijozlar bilan muloqot strategiyasi va Tone of Voice.",
        price: basePricesUSD.commStrategy,
        features: ["Brend ovozi (Tone of Voice)", "Asosiy xabarlar", "Kanallarni rejalashtirish", "Content-pillerlar"],
        results: ["Muloqot qo'llanmasi"],
        timeline: "15-20 ish kuni"
    },
    namingVIP: {
        label: "👑 Naming VIP",
        description: "Katta va xalqaro bozorga mo'ljallangan strategik neyming.",
        price: basePricesUSD.namingVIP,
        features: [
            "Baxtiyorjon Gaziyev shaxsiy nazorati",
            "10+ eksklyuziv nom variantlari",
            "6 tilda fonetik va semantik tahlil",
            "3 tagacha klass bo'yicha patent tekshiruvi",
            "Domen va TG-nik tanlash"
        ],
        results: ["Xalqaro darajadagi kuchli nom", "Maksimal huquqiy xotirjamlik", "100% to'lov qaytarish kafolati"],
        recommended: false,
        timeline: "20–25 ish kuni",
        note: "Global bozorga chiqayotganlar uchun."
    },
    namingPremium: {
        label: "Naming PREMIUM",
        description: "O'rta va rivojlanayotgan biznes uchun eng maqbul tanlov.",
        price: basePricesUSD.namingPremium,
        features: [
            "5 ta strategik nom variantlari",
            "Bir nechta tilda tahlil",
            "2 ta klass bo'yicha patent tekshiruvi",
            "Slogan (shior) yaratish"
        ],
        results: ["Biznes maqsadga mos nom", "Huquqiy toza brend", "100% to'lov qaytarish kafolati"],
        recommended: true,
        timeline: "14–20 ish kuni",
        note: "Eng mashhur tarifimiz."
    },
    namingStandard: {
        label: "Naming STANDARD",
        description: "Kichik biznes va startaplar uchun tezkor yechim.",
        price: basePricesUSD.namingStandard,
        features: [
            "3 ta jarangli nom variantlari",
            ".uz domen bo'shligi tekshiruvi",
            "Bitta klass bo'yicha patent tekshiruvi"
        ],
        results: ["Tez start uchun nom", "Eslab qolish oson"],
        recommended: false,
        timeline: "7–10 ish kuni"
    },
    logoVIP: {
        label: "👑 VIP — Logo + Stil + Brandbook",
        description: "Katta va o'sishga yo'naltirilgan bizneslar uchun to'liq upakovka.",
        price: basePricesUSD.logoVIP,
        features: [
            "Baxtiyorjon Gaziyev ishtiroki va nazorati",
            "Brend strategiyasi asosida 8+ logotip konsepsiyasi",
            "25+ touchpoint dizayn",
            "To'liq Vizual Brandbook (50+ bet)",
            "Logotip animatsiyasi"
        ],
        results: ["Mustahkam vizual tizim", "Aniq marketing qo'llanmasi", "100% to'lov qaytarish kafolati"],
        recommended: false,
        timeline: "20–30 ish kuni"
    },
    logoPremium: {
        label: "Logo + Firma uslubi PREMIUM",
        description: "Brendini jiddiy rivojlantirayotganlar uchun vizual tizim.",
        price: basePricesUSD.logoPremium,
        features: [
            "5 ta strategik logotip konsepsiyasi",
            "Firma uslubi (ranglar, shriftlar, patternlar)",
            "15+ touchpoint vizualizatsiyasi",
            "Gaydlayn (qo'llanma)"
        ],
        results: ["Yaxlit vizual obraz", "Marketingda tartib", "100% to'lov qaytarish kafolati"],
        recommended: true,
        timeline: "14–20 ish kuni"
    },
    logoStandard: {
        label: "Logotip STANDARD",
        description: "Startaplar uchun sifatli va tezkor logotip.",
        price: basePricesUSD.logoStandard,
        features: [
            "3 ta logotip konsepsiyasi",
            "5 ta asosiy touchpoint vizualizatsiyasi",
            "Ranglar va shriftlar kodi"
        ],
        results: ["Tayyor logotip", "Raqobatchilardan ajralib turish"],
        recommended: false,
        timeline: "7–10 ish kuni"
    },
    packaging: {
        label: "Qadoq dizayni",
        description: "3 SKU uchun professional qadoq ishlab chiqish.",
        price: basePricesUSD.packaging,
        features: ["Bozor tahlili", "2 ta dizayn konsepsiyasi", "3 tagacha SKU adaptatsiyasi", "Chopga tayyor fayllar"],
        results: ["Sotuvchi qadoq dizayni"],
        timeline: "10-15 ish kuni"
    },
    smm: {
        label: "Ijtimoiy tarmoqlar uchun stil",
        description: "Postlar va storislarni brendingda bezash tizimi.",
        price: basePricesUSD.smm,
        features: ["6 ta post shabloni", "6 ta stories shabloni", "Highlight coverlar", "Profil shapkasi dizayni"],
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
    const { selectedServices, wantsUpfrontPayment } = selections;
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
        discountsApplied.push({ name: "Oldindan to'lov (-10%)", value: val });
        finalPrice -= val;
    }
    return { base: basePrice, final: finalPrice, discountApplied: discountsApplied, savings: basePrice - finalPrice };
}

export const generateSummary = (selections: any, lang: string = 'uz'): string => {
    const { selectedServices } = selections;
    const sd = getServiceDetails(lang as any);
    return Object.entries(selectedServices).filter(([_, active]) => active).map(([key]) => sd[key as keyof typeof sd]?.label).filter(Boolean).join(', ');
}
