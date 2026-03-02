
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
    return {
        audit: {
            label: "Logo Auditi",
            description: "Mavjud logotipni strategik tahlil qilish va tavsiyalar.",
            price: basePricesUSD.audit,
            timeline: "⏱ 2-3 ish kuni",
            features: ["Logoning texnik tahlili", "Bozorga moslik tekshiruvi", "Kamchiliklar ro'yxati", "Yaxshilash bo'yicha tavsiyalar"]
        },
        namingCheck: {
            label: "Neyming Tekshiruvi",
            description: "Brend nomining bo'shligini huquqiy va raqamli bazalarda tekshirish.",
            price: basePricesUSD.namingCheck,
            timeline: "⏱ 1-2 ish kuni",
            features: ["O'zbekiston patent bazasi", "Domenlar tekshiruvi", "Ijtimoiy tarmoqlar (Username)", "Ma'noviy assotsiatsiyalar"]
        },
        consultation: {
            label: "Konsultatsiya",
            description: "Brending va biznesni 'upakovka' qilish bo'yicha professional maslahat.",
            price: basePricesUSD.consultation,
            timeline: "⏱ 60 daqiqa",
            features: ["Muammolarni tahlil qilish", "Brending strategiyasi", "Savollarga javoblar", "Yo'l xaritasi tuzish"]
        },
        strategy: {
            label: "Brend-strategiya",
            description: "Biznesingiz uchun natija keltiradigan poydevor.",
            price: basePricesUSD.strategy,
            timeline: "⏱ 20-30 ish kuni",
            features: ["Bozor va raqobat tahlili", "Maqsadli auditoriya xaritasi", "Brend platformasi", "Pozitsiyalash strategiyasi", "Noyob Sotuv Taklifi (USP)"]
        },
        commStrategy: {
            label: "Kommunikatsion strategiya",
            description: "Mijozlar bilan muloqot va reklama tili.",
            price: basePricesUSD.commStrategy,
            timeline: "⏱ 15-20 ish kuni",
            features: ["Brend ovozi (Tone of Voice)", "Asosiy xabarlar tizimi", "Media kanallar tanlovi", "Kontent rejasi tamoyillari"]
        },
        namingVIP: {
            label: "Naming VIP",
            description: "Nom emas — bu biznes uchun real aktiv.",
            price: basePricesUSD.namingVIP,
            timeline: "⏱ 15 ish kuni",
            features: [
                "15 ta nom varianti tayyorlanadi",
                "Har bir nom uchun to'liq strategik izoh",
                "Talaffuz, jarang va esda qolishi tekshiriladi",
                "O'zbekiston va xalqaro bazalarda patent tekshiruvi (WIPO) va patentga topshirib berish xizmati",
                "Domen va Username tekshiruvi",
                "Cheksiz tuzatish (30 kun ichida)",
                "Logoning to'liq mulkchilik huquqi sertifikati"
            ],
            benefits: [
                { icon: "🌍", title: "Xalqaro bozorga tayyorsiz", description: "Nom xalqaro talablar (WIPO) asosida tekshiriladi." },
                { icon: "🔒", title: "Nom to'liq sizniki", description: "Rasmiy patent himoyasi bilan ta'minlanadi." },
                { icon: "💎", title: "Biznes uchun real aktiv", description: "Himoyalangan nom biznesning qimmatli mulki." },
                { icon: "🎯", title: "Eng to'g'ri yo'l", description: "Bozorda adashmasligingiz uchun strategik tanlov." }
            ]
        },
        namingPremium: {
            label: "Naming Premium",
            description: "To'g'ri nom, to'g'ri poydevor.",
            price: basePricesUSD.namingPremium,
            recommended: true,
            timeline: "⏱ 7 ish kuni",
            results: ["10 ta nom varianti", "Har bir nom uchun strategik izoh", "O'zbekiston bazasida patent tekshiruvi", "3 ta tuzatish imkoniyati"]
        },
        namingStandard: {
            label: "Naming Standart",
            description: "Tez va sifatli start uchun.",
            price: basePricesUSD.namingStandard,
            timeline: "⏱ 5 ish kuni",
            results: ["5 ta nom varianti", "Ma'nosi va izohi bilan", "Domen tekshiruvi", "2 ta tuzatish imkoniyati"]
        },
        logoStandard: {
            label: "Unikal Logo",
            description: "Endigina boshlamoqchi bo'lganlar uchun.",
            price: basePricesUSD.logoStandard,
            timeline: "⏱ 5 ish kuni",
            features: [
                "2 ta logo varianti — bittasini tanlaysiz",
                "Har bir variant uchun strategik izoh",
                "Logo 4 xil ko'rinishda (Horizontal, Vertical, B&W, Icon)",
                "Ijtimoiy tarmoqlar uchun profil rasmi",
                "3 xil fayl formati (PNG, SVG, AI)",
                "8 ta aloqa nuqtasida vizual namoyish",
                "2 ta tuzatish imkoniyati"
            ],
            benefits: [
                { icon: "🎯", title: "Hamma joyga tayyor", description: "Logongiz sayt, Instagram va chop etishga tayyor holda keladi." },
                { icon: "✅", title: "Professional ko'rinish", description: "Mijozlar birinchi qarashda ishonch his qiladi." },
                { icon: "👁️", title: "Real hayotda ko'rasiz", description: "8 ta nuqtada logongiz qandayligini vizual ko'rasiz." },
                { icon: "🛡️", title: "Fayllar to'liq sizniki", description: "Barcha manba fayllar (AI formatida) topshiriladi." }
            ]
        },
        logoPremium: {
            label: "Logo + Firma uslubi",
            description: "O'sishni rejalashtiraganlar uchun.",
            price: basePricesUSD.logoPremium,
            recommended: true,
            timeline: "⏱ 10 ish kuni",
            features: [
                "3 ta logo varianti — bittasini tanlaysiz",
                "Logoning 4 xil ko'rinishi va izohi",
                "Rasmiy ranglar to'plami va aniq kodlari",
                "Rasmiy brend shrifti va qo'llash qoidalari",
                "15 ta aloqa nuqtasida vizual namoyish",
                "3 ta tuzatish imkoniyati"
            ],
            benefits: [
                { icon: "🏆", title: "Har joyda bir xil ko'rinasiz", description: "Sayt, Instagram, vizitka — hammasi bir uslubda bo'ladi." },
                { icon: "💼", title: "Xodimlaringiz ham to'g'ri ishlatadi", description: "Aniq ranglar va shrift bo'lgach, hech kim adashmaydi." },
                { icon: "📸", title: "Mijozlarga ko'rsatishga tayyor", description: "15 ta nuqtada brendingizni vizual ko'rasiz." },
                { icon: "📈", title: "Brend qiymati oshadi", description: "Izchil ko'rinish — professional biznes belgisidir." }
            ]
        },
        logoVIP: {
            label: "Logo + Stil + Brandbook",
            description: "Hamma narsani bir marta to'g'ri qilmoqchilar uchun.",
            price: basePricesUSD.logoVIP,
            timeline: "⏱ 15–20 ish kuni",
            features: [
                "3 ta logo varianti + chuqur strategik izoh",
                "To'liq Brandbook (30-50 sahifa)",
                "25 ta aloqa nuqtasida professional vizual",
                "Ranglar, shriftlar va uslub qoidalari",
                "Cheksiz tuzatish (30 kun ichida)",
                "Logoning to'liq mulkchilik huquqi sertifikati"
            ],
            benefits: [
                { icon: "📖", title: "Istalgan odamga bera olasiz", description: "Qo'llanma bilan har qanday dizayner to'g'ri ishlaydi." },
                { icon: "🔒", title: "Brend buzilmaydi", description: "Brendingiz 10 yildan keyin ham kuchli ko'rinadi." },
                { icon: "🌍", title: "Xalqaro daraja", description: "Investorlar jiddiy kompaniya ekaningizni bilishadi." },
                { icon: "💎", title: "Bir marta qilinadigan sarmoya", description: "To'g'ri qilingan brend kamida 10 yil xizmat qiladi." }
            ]
        },
        packaging: { 
            label: "Qadoq dizayni", 
            description: "Mahsulotingizning javondagi asosiy quroli.",
            price: basePricesUSD.packaging, 
            timeline: "⏱ 10-15 ish kuni",
            features: ["Vizual konsepsiya", "Qadoqni 3D namoyish qilish", "Chop etishga tayyor fayllar", "Materiallar bo'yicha tavsiyalar"]
        },
        smm: { 
            label: "Instagram uchun stil", 
            description: "Sahifangizni tartibli va brendga mos qilish.",
            price: basePricesUSD.smm, 
            timeline: "⏱ 5-7 ish kuni",
            features: ["Profil rasmi va bio dizayni", "9 ta post uchun shablon", "Storislar uchun dizayn tizimi", "Highlight ikonkalari"]
        },
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

    // Promo codes logic (50% off for specified codes)
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

    return { 
        base: basePrice, 
        surchargesTotal, 
        final: finalPrice, 
        discountApplied: discountsApplied, 
        surchargesApplied, 
        savings: totalBeforeDiscounts - finalPrice, 
        isPromoApplied 
    };
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
