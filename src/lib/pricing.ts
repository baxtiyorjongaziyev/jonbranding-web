
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
                "3 ta qisqa shior varianti tayyorlanadi",
                "Font va rang yo'nalishi bo'yicha tavsiya",
                "Patentga topshirib berish xizmati (Davlat bojlari alohida)",
                "Cheksiz tuzatish (30 kun ichida)"
            ],
            benefits: [
                { icon: "🌍", title: "Xalqaro bozorga tayyor bo'lasiz", description: "Nomingiz boshqa tillarda ham tekshiriladi — dunyo bo'ylab ishlaydi." },
                { icon: "🔒", title: "Nomingiz to'liq sizniki bo'ladi", description: "Patent hujjatlari bilan nomingiz rasman himoyalanadi." },
                { icon: "💎", title: "Biznesingizga qiymat qo'shiladi", description: "Himoyalangan kuchli nom — bu real aktiv." },
                { icon: "🎯", title: "To'g'ri qaror qabul qilasiz", description: "Siz bilan birgalikda nomni tanlashda to'g'ri yo'lni belgilaymiz." }
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
                { icon: "📈", title: "Kuchli boshlanish", description: "Marketing xarajatlarini kamayturuvchi nom." }
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
                { icon: "⚡", title: "Vaqt tejaysiz", description: "Professional tahlil qilingan nomni tezda olasiz." },
                { icon: "✅", title: "Ishonch bilan boshlaysiz", description: "Tekshirilgan nom bilan xavotirsiz ish boshlang." },
                { icon: "📱", title: "Digital tayyor", description: "Domen va username muammosi bo'lmaydi." }
            ]
        },
        logoVIP: {
            label: "Logo + Firma uslubi + Brandbook",
            description: "Hamma narsani bir marta to'g'ri qilmoqchilar uchun",
            subDescription: "To'liq brend konstitutsiyasi",
            price: basePricesUSD.logoVIP,
            timeline: "⏱ 15–20 ish kuni",
            features: [
                "3 ta logo varianti tayyorlanadi + har biri uchun chuqur strategik izoh beriladi",
                "Har bir variant uchun izoh beriladi — nima uchun aynan shunday dizayn qilindi",
                "Logo 4 xil ko'rinishda beriladi: gorizontal (yonma-yon), vertikal (ustma-ust), qora-oq versiyasi (muhrlar va hujjatlar uchun), belgi alohida (faqat ikonka, matnsiz)",
                "Ijtimoiy tarmoqlar uchun profil rasmi (Instagram, Telegram)",
                "3 xil fayl formatida topshiriladi: PNG, SVG, AI",
                "Rasmiy ranglar to'plami — brendingizning 3–5 ta rasmiy rangi va ularning aniq kodi",
                "Rasmiy shrift — brendingizda ishlatiladigan harflar uslubi",
                "Brandbook — brendingizni qanday ishlatish kerakligi yozilgan to'liq qo'llanma",
                "25 ta aloqa nuqtasi — to'liq audit va har bir nuqta uchun professional vizuallar",
                "Cheksiz tuzatish (30 kun ichida)",
                "Logoning to'liq mulkchilik huquqi sertifikati"
            ],
            benefits: [
                { icon: "📖", title: "Istalgan odamga berib, to'g'ri natija olasiz", description: "Dizayner, SMM mutaxassis, yangi xodim — qo'llanmani o'qib, brendingizni to'g'ri ishlatadi." },
                { icon: "🔒", title: "Brend yillar o'tsa ham buzilmaydi", description: "Hamma qoidalar yozilgan — hech kim o'z bilganicha o'zgartira olmaydi." },
                { icon: "🌍", title: "Xalqaro darajada tayyor ko'rinasiz", description: "Investor, sherik yoki xorijiy mijoz ko'rsa — jiddiy kompaniya ekanligini his qiladi." },
                { icon: "💎", title: "Bu bir marta qilinadigan investitsiya", description: "To'g'ri qilingan brend 10 yil ishlaydi. Har yili qayta dizayn o'rniga, bir marta to'g'ri qiling." }
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
                "3 ta logo varianti tayyorlanadi — uchtalasidan birini tanlaysiz",
                "Har bir variant uchun izoh beriladi — nima uchun aynan shunday dizayn qilindi",
                "Logo 4 xil ko'rinishda beriladi: gorizontal, vertikal, qora-oq versiyasi, belgi alohida",
                "Ijtimoiy tarmoqlar uchun profil rasmi (Instagram, Telegram)",
                "3 xil fayl formatida topshiriladi: PNG, SVG, AI",
                "Rasmiy ranglar to'plami — brendingizning 3–5 ta rasmiy rangi va kodlari",
                "Rasmiy shrift — brendingizda ishlatiladigan harflar uslubi",
                "15 ta aloqa nuqtasi — biznesingizni o'rganib, har birida logongiz qanday ko'rinishini vizual ko'rsatamiz",
                "3 ta tuzatish imkoniyati"
            ],
            benefits: [
                { icon: "🏆", title: "Har joyda bir xil, professional ko'rinasiz", description: "Saytingiz, Instagramingiz, vizitchangiz — hammasi bir uslubda. Mijoz sizni bir marta ko'rib taniydi." },
                { icon: "💼", title: "Xodimlaringiz ham to'g'ri ishlatadi", description: "Aniq ranglar va shrift bo'lgach, hech kim adashmaydi. Hamma bir yo'nalishda harakat qiladi." },
                { icon: "📸", title: "Mijozlarga ko'rsatishga tayyor", description: "15 ta aloqa nuqtasi uchun brendingiz qanday ko'rinishini oldindan ko'z oldingizda ko'rasiz." },
                { icon: "📈", title: "Brend qiymati oshadi", description: "Izchil ko'rinish — professional biznesning belgisi. Mijozlar sizga ko'proq ishonadi." }
            ]
        },
        logoStandard: {
            label: "Unikal Logo",
            description: "Endigina boshlamoqchi bo'lganlar uchun",
            subDescription: "Sifatli start uchun",
            price: basePricesUSD.logoStandard,
            timeline: "⏱ 5 ish kuni",
            features: [
                "2 ta logo varianti tayyorlanadi — ikkalasidan birini tanlaysiz",
                "Har bir variant uchun izoh beriladi — nima uchun aynan shunday dizayn qilindi",
                "Logo 4 xil ko'rinishda beriladi: gorizontal, vertikal, qora-oq va belgi alohida",
                "Ijtimoiy tarmoqlar uchun profil rasmi (Instagram, Telegram)",
                "3 xil fayl formatida topshiriladi: PNG, SVG, AI",
                "8 ta aloqa nuqtasi — logongiz muhim joylarda qanday ko'rinishini vizual ko'rsatib beriladi",
                "2 ta tuzatish imkoniyati"
            ],
            benefits: [
                { icon: "🎯", title: "Hujjatlarda ham, ijtimoiy tarmoqlarda ham ishlaydi", description: "Logongiz hamma joyga tayyor holda keladi — saytga, Instagramga, chop etishga." },
                { icon: "✅", title: "\"Bu mening brendim\" deyishingiz mumkin bo'ladi", description: "Professional ko'rinish — o'zingiz yasaganga o'xshamaydi. Mijozlar birinchi qarashda ishonch his qiladi." },
                { icon: "👁️", title: "Real hayotda qanday ko'rinishini oldindan bilasiz", description: "8 ta aloqa nuqtasida logongiz qanday ko'rinishini ko'rasiz — hammasi ko'z oldingizda." },
                { icon: "🛡️", title: "Fayllar to'liq sizniki", description: "Barcha fayllar sizga topshiriladi. Kerak bo'lganda istalgan dizaynerga bera olasiz." }
            ]
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
    return data[lang as keyof typeof data] || data.uz;
};
