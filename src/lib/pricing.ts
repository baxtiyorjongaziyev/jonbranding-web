
'use client';

/**
 * @fileOverview Narxlar va xizmatlar bazasi.
 * Includes VIP tariffs, RAMAZON promo, and 50% surcharges for Urgency/NDA.
 */

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

export const getServiceDetails = (lang: string = 'uz') => {
    const sd: any = {
        audit: {
            label: "Logo Auditi",
            description: "Mavjud logotipni tahlil qilish va yaxshilash bo'yicha tavsiyalar.",
            price: basePricesUSD.audit,
            features: ["Kuchli va zaif tomonlar tahlili", "Raqobatchilar bilan solishtirish", "Yaxshilash rejasini tuzish"],
            timeline: "2-3 ish kuni"
        },
        namingCheck: {
            label: "Neyming Tekshiruvi",
            description: "Brend nomining O'zbekiston va xalqaro bazalarda bo'shligini tekshirish.",
            price: basePricesUSD.namingCheck,
            features: ["IMA bazasi (O'zbekiston)", "WIPO bazasi (Xalqaro)", "Domen va ijtimoiy tarmoqlar"],
            timeline: "1-2 ish kuni"
        },
        consultation: {
            label: "30 daqiqalik konsultatsiya",
            description: "Brending bo'yicha Baxtiyorjon Gaziyevdan professional maslahat.",
            price: basePricesUSD.consultation,
            features: ["Muammoni aniqlashtirish", "Strategik tavsiyalar", "Savollarga javoblar"],
            timeline: "Kelishilgan vaqtda"
        },
        strategy: {
            label: "Brend-strategiya va platforma",
            description: "Biznesingiz uchun natija keltiradigan poydevor.",
            price: basePricesUSD.strategy,
            features: ["Bozor tahlili", "Pozitsiyalash", "Brend platformasi", "Tone of Voice"],
            timeline: "20-30 ish kuni"
        },
        commStrategy: {
            label: "Kommunikatsion strategiya",
            description: "Mijozlar bilan muloqot strategiyasi va Tone of Voice.",
            price: basePricesUSD.commStrategy,
            features: ["Asosiy xabarlar", "Kanallarni rejalashtirish", "Content-pillerlar"],
            timeline: "15-20 ish kuni"
        },
        namingVIP: {
            label: "Naming VIP",
            description: "Nom emas — aktiv",
            subDescription: "Jiddiy investitsiya qiladiganlar uchun",
            price: basePricesUSD.namingVIP,
            timeline: "15 ish kuni",
            features: [
                "15 ta nom varianti tayyorlanadi",
                "Har bir nom uchun to'liq izoh beriladi",
                "Talaffuz, jarang va esda qolishi tekshiriladi",
                "Domen va Username tekshiruvi (.com, .uz, TG, IG)",
                "O'zbekiston va xalqaro patent tekshiruvi",
                "Raqobatchilar tahlili va unikal pozitsiya",
                "Xalqaro bozor uchun tillararo tekshiruv",
                "Brendning hissiy ma'nosi va ta'siri",
                "3 ta qisqa shior varianti",
                "Font va rang yo'nalishi bo'yicha tavsiya",
                "Patentga topshirib berish xizmati (Davlat bojlari alohida)",
                "Cheksiz tuzatish (30 kun ichida)"
            ],
            benefits: [
                { icon: "🌍", title: "Xalqaro bozorga tayyor bo'lasiz", description: "Nomingiz dunyo bo'ylab ishonchli ishlaydi." },
                { icon: "🔒", title: "Nomingiz to'liq sizniki bo'ladi", description: "Patent orqali rasman himoyalangan nom." },
                { icon: "💎", title: "Biznesingizga qiymat qo'shiladi", description: "Himoyalangan nom — bu real aktiv." },
                { icon: "🎯", title: "To'g'ri qaror qabul qilasiz", description: "Mutaxassis bilan birga to'g'ri yo'lni tanlaysiz." }
            ]
        },
        namingPremium: {
            label: "Naming Premium",
            description: "To'g'ri nom, to'g'ri asos",
            subDescription: "O'sishni rejalashtiraganlar uchun",
            price: basePricesUSD.namingPremium,
            recommended: true,
            timeline: "7 ish kuni",
            features: [
                "10 ta nom varianti tayyorlanadi",
                "Har bir nom uchun strategik izoh",
                "Talaffuz va esda qolishi tekshiriladi",
                "Domen va Username tekshiruvi",
                "O'zbekiston bazasida patent tekshiruvi",
                "Raqobatchilarning nomlari tahlili",
                "Nomning hissiy ma'nosi tavsifi",
                "3 ta tuzatish raundi"
            ],
            benefits: [
                { icon: "⚖️", title: "Huquqiy xavfsizlik", description: "Kelajakdagi qimmat muammolardan qutulasiz." },
                { icon: "🏆", title: "Raqobatdan ajralib turasiz", description: "Mijozlar sizni boshqalardan ajratib taniydi." },
                { icon: "❤️", title: "Mijozlar yaxshi ko'radi", description: "Nomga his-tuyg'u va sadoqat yuklanadi." },
                { icon: "📈", title: "Kuchli boshlanish", description: "Marketing xarajatlarini kamaytiruvchi nom." }
            ]
        },
        namingStandard: {
            label: "Naming Standart",
            description: "Tez va ishonchli start",
            subDescription: "Endigina boshlamoqchi bo'lganlar uchun",
            price: basePricesUSD.namingStandard,
            timeline: "5 ish kuni",
            features: [
                "5 ta nom varianti tayyorlanadi",
                "Nomlar uchun qisqa izohlar",
                "Talaffuz qulayligi tekshiruvi",
                "Domen va Username tekshiruvi",
                "1 ta tuzatish raundi"
            ],
            benefits: [
                { icon: "🛡️", title: "Xavfli nomdan qutulasiz", description: "Noto'g'ri nomdan keladigan zararni oldini olamiz." },
                { icon: "⚡", "title": "Vaqt tejaysiz", description: "Professional tahlil qilingan nomni tezda olasiz." },
                { icon: "✅", "title": "Ishonch bilan boshlaysiz", "description": "Tekshirilgan nom bilan xavotirsiz ish boshlang." },
                { icon: "📱", "title": "Digital tayyor", "description": "Domen va username muammosi bo'lmaydi." }
            ]
        },
        logoVIP: {
            label: "👑 VIP — Logo + Stil + Brandbook",
            description: "Katta va o'sishga yo'naltirilgan bizneslar uchun to'liq upakovka.",
            price: basePricesUSD.logoVIP,
            features: ["Baxtiyorjon Gaziyev nazorati", "8+ logotip konsepsiyasi", "25+ touchpoint dizayn", "To'liq Brandbook"],
            timeline: "20–30 ish kuni"
        },
        logoPremium: {
            label: "Logo + Firma uslubi PREMIUM",
            description: "Brendini jiddiy rivojlantirayotganlar uchun vizual tizim.",
            price: basePricesUSD.logoPremium,
            features: ["5 ta logotip konsepsiyasi", "Firma uslubi (ranglar, shriftlar)", "15+ touchpoint dizayn"],
            recommended: true,
            timeline: "14–20 ish kuni"
        },
        logoStandard: {
            label: "Logotip STANDARD",
            description: "Startaplar uchun sifatli va tezkor logotip.",
            price: basePricesUSD.logoStandard,
            features: ["3 ta logotip konsepsiyasi", "5 ta asosiy touchpoint", "Ranglar kodi"],
            timeline: "7–10 ish kuni"
        },
        packaging: {
            label: "Qadoq dizayni",
            description: "3 SKU uchun professional qadoq ishlab chiqish.",
            price: basePricesUSD.packaging,
            features: ["Bozor tahlili", "2 ta dizayn konsepsiyasi", "Chopga tayyor fayllar"],
            timeline: "10-15 ish kuni"
        },
        smm: {
            label: "Ijtimoiy tarmoqlar uchun stil",
            description: "Postlar va storislarni bezash tizimi.",
            price: basePricesUSD.smm,
            features: ["6 ta post shabloni", "6 ta stories shabloni", "Highlight coverlar"],
            timeline: "5-7 ish kuni"
        },
        urgency: {
            label: "Shoshilinch loyiha (+50%)",
            description: "2 barobar tezroq bitirib berish.",
            price: 0,
            timeline: "Muddat 50% qisqaradi"
        },
        nda: {
            label: "NDA — Maxfiylik (+50%)",
            description: "Loyiha natijalarini portfolioga qo'shmaslik.",
            price: 0,
            timeline: "Loyiha davomida"
        }
    };
    return sd;
};

export function formatPrice(priceInUSD: number, lang: string = 'uz', currency: 'uzs' | 'usd' = 'usd') {
    if (priceInUSD === 0) return lang === 'uz' ? "Kelishiladi" : "Agreed";
    let price = currency === 'uzs' ? convertToUzs(priceInUSD) : priceInUSD;
    let currencyString = currency === 'uzs' ? "so'm" : "$";
    return `${price.toLocaleString('fr-FR')} ${currencyString}`;
}

export type SelectedServices = { [key: string]: boolean; };

export const calculatePackagePrice = (selections: any, lang: string = 'uz'): any => {
    const { selectedServices, discountType = 'none', promoCode = '' } = selections;
    const sd = getServiceDetails(lang);
    
    let basePrice = 0;
    let mainServicesCount = 0;
    const mainKeys = ['strategy', 'commStrategy', 'namingStandard', 'namingPremium', 'namingVIP', 'logoStandard', 'logoPremium', 'logoVIP', 'packaging'];
    const surchargeKeys = ['urgency', 'nda'];

    for (const key in selectedServices) {
        if (selectedServices[key] && sd[key] && !surchargeKeys.includes(key)) {
            basePrice += sd[key].price;
            if (mainKeys.includes(key)) mainServicesCount++;
        }
    }

    const surchargesApplied = [];
    let surchargesTotal = 0;

    if (selectedServices.urgency) {
        const val = basePrice * 0.5;
        surchargesTotal += val;
        surchargesApplied.push({ 
            name: lang === 'uz' ? 'Shoshilinch loyiha (+50%)' : 'Urgent project (+50%)', 
            value: val 
        });
    }
    if (selectedServices.nda) {
        const val = basePrice * 0.5;
        surchargesTotal += val;
        surchargesApplied.push({ 
            name: lang === 'uz' ? 'NDA (Maxfiylik) (+50%)' : 'NDA (+50%)', 
            value: val 
        });
    }

    const totalBeforeDiscounts = basePrice + surchargesTotal;
    let finalPrice = totalBeforeDiscounts;
    const discountsApplied = [];

    const isRamadanPromo = promoCode?.toUpperCase() === 'RAMAZON';

    if (isRamadanPromo) {
        const val = totalBeforeDiscounts * 0.50;
        discountsApplied.push({ name: 'Ramazon tuhfasi (-50%)', value: val });
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

    return { 
        base: basePrice, 
        surchargesTotal,
        totalBeforeDiscounts,
        final: finalPrice, 
        discountApplied: discountsApplied, 
        surchargesApplied: surchargesApplied,
        savings: totalBeforeDiscounts - finalPrice,
        isPromoApplied: isRamadanPromo
    };
}

export const generateSummary = (selections: any, lang: string = 'uz'): string => {
    const { selectedServices } = selections;
    const sd = getServiceDetails(lang);
    return Object.entries(selectedServices)
        .filter(([_, active]) => active)
        .map(([key]) => sd[key]?.label)
        .filter(Boolean)
        .join(', ');
}

export const comparisonData = (lang: 'uz' | 'ru' | 'en' = 'uz') => {
    const data = {
        uz: [
            { feature: "Strategik yondashuv", competitors: { jon: true, mano: true, abba: true, mountain: true } },
            { feature: "Bozor tahlili", competitors: { jon: true, mano: true, abba: true, mountain: true } },
            { feature: "Patent tekshiruvi", competitors: { jon: true, mano: "Kelishiladi", abba: false, mountain: false } },
            { feature: "Premium dizayn sifati", competitors: { jon: true, mano: true, abba: true, mountain: true } },
            { feature: "Narx (o'rtacha)", competitors: { jon: "$1,500+", mano: "$5,000+", abba: "$3,000+", mountain: "$2,500+" } },
            { feature: "Tezkor aloqa (24/7)", competitors: { jon: true, mano: false, abba: false, mountain: false } },
            { feature: "Bajarish muddati", competitors: { jon: "2-4 hafta", mano: "2-3 oy", abba: "1-2 oy", mountain: "1-2 oy" } },
        ],
        ru: [
            { feature: "Стратегический подход", competitors: { jon: true, mano: true, abba: true, mountain: true } },
            { feature: "Анализ рынка", competitors: { jon: true, mano: true, abba: true, mountain: true } },
            { feature: "Патентная проверка", competitors: { jon: true, mano: "По догов.", abba: false, mountain: false } },
            { feature: "Качество дизайна", competitors: { jon: true, mano: true, abba: true, mountain: true } },
            { feature: "Цена (в среднем)", competitors: { jon: "$1,500+", mano: "$5,000+", abba: "$3,000+", mountain: "$2,500+" } },
            { feature: "Связь 24/7", competitors: { jon: true, mano: false, abba: false, mountain: false } },
            { feature: "Сроки выполнения", competitors: { jon: "2-4 недели", mano: "2-3 месяца", abba: "1-2 месяца", mountain: "1-2 месяца" } },
        ],
        en: [
            { feature: "Strategic Approach", competitors: { jon: true, mano: true, abba: true, mountain: true } },
            { feature: "Market Analysis", competitors: { jon: true, mano: true, abba: true, mountain: true } },
            { feature: "Patent Check", competitors: { jon: true, mano: "On request", abba: false, mountain: false } },
            { feature: "Design Quality", competitors: { jon: true, mano: true, abba: true, mountain: true } },
            { feature: "Price (Avg)", competitors: { jon: "$1,500+", mano: "$5,000+", abba: "$3,000+", mountain: "$2,500+" } },
            { feature: "24/7 Support", competitors: { jon: true, mano: false, abba: false, mountain: false } },
            { feature: "Turnaround Time", competitors: { jon: "2-4 weeks", mano: "2-3 months", abba: "1-2 months", mountain: "1-2 months" } },
        ]
    };
    return data[lang] || data.uz;
};
