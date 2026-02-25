
'use client';

/**
 * @fileOverview Narxlar va xizmatlar bazasi.
 * Bu yerda barcha tariflar, hisoblash mantiqi va chegirmalar jamlangan.
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
        label: "Naming VIP",
        description: "Nom emas — aktiv",
        subDescription: "Jiddiy investitsiya qiladiganlar uchun",
        price: basePricesUSD.namingVIP,
        features: [
            "15 ta nom varianti tayyorlanadi",
            "Har bir nom uchun to'liq izoh beriladi",
            "Nomning talaffuzi qulay, esda qolishi oson va jaranglashi tekshiriladi",
            "Domen tekshiruvi (.com, .uz)",
            "Instagram va Telegram uchun username bo'shligini tekshirish",
            "O'zbekistonda va xalqaro bazalarda patent tekshiruvi",
            "Raqobatchilarning nomlari tahlili va farqli pozitsiya",
            "Nom boshqa tillarda noqulay ma'no bermasligi tekshiruvi",
            "Nomning hissiy ma'nosi va taassuroti",
            "3 ta qisqa shior varianti",
            "Font va rang yo'nalishi bo'yicha tavsiya",
            "Patent topshirish uchun hujjat tayyorlashda yordam",
            "Nom egalik sertifikati",
            "30 daqiqalik shaxsiy strategik konsultatsiya",
            "Cheksiz tuzatish (30 kun ichida)"
        ],
        benefits: [
            { icon: "🌍", title: "Xalqaro bozorga tayyor bo'lasiz", description: "Nomingiz boshqa tillarda ham tekshiriladi — dunyo bo'ylab ishlaydi." },
            { icon: "🔒", title: "Nomingiz to'liq sizniki bo'ladi", description: "Patent hujjatlari va sertifikat bilan nomingiz rasman himoyalanadi." },
            { icon: "💎", title: "Biznesingizga qiymat qo'shiladi", description: "Investor va sheriklar uchun bu jiddiy signal bo'lib xizmat qiladi." },
            { icon: "🎯", title: "To'g'ri qaror qabul qilasiz", description: "30 daqiqa shaxsiy suhbatda nomni tanlashda to'g'ri yo'lni belgilaymiz." }
        ],
        timeline: "15 ish kuni"
    },
    namingPremium: {
        label: "Naming Premium",
        description: "To'g'ri nom, to'g'ri asos",
        subDescription: "O'sishni rejalashtiraganlar uchun",
        price: basePricesUSD.namingPremium,
        recommended: true,
        features: [
            "10 ta nom varianti tayyorlanadi",
            "Har bir nom uchun to'liq izoh beriladi",
            "Nomning talaffuzi qulay, esda qolishi oson va jaranglashi tekshiriladi",
            "Domen tekshiruvi (.com, .uz)",
            "Instagram va Telegram uchun username bo'shligini tekshirish",
            "O'zbekiston bazasida patent tekshiruvi",
            "Raqobatchilarning nomlari tahlil qilinadi",
            "Nomning hissiy ma'nosi va taassuroti",
            "3 ta tuzatish raundi"
        ],
        benefits: [
            { icon: "⚖️", title: "Huquqiy xavfsizlik", description: "Kimdir nomingizni oldin patent qilmaganligini tekshiramiz." },
            { icon: "🏆", title: "Raqobatdan ajralib turasiz", description: "Bozordagi o'xshash nomlarni tahlil qilib, unikal nom topamiz." },
            { icon: "❤️", title: "Mijozlar yaxshi ko'radi", description: "Nomga his-tuyg'u yuklanadi — mijozlar eslab qoladi." },
            { icon: "📈", title: "Kuchli boshlanish", description: "Kuchli nom marketing xarajatlarini kamaytirishga xizmat qiladi." }
        ],
        timeline: "7 ish kuni"
    },
    namingStandard: {
        label: "Naming Standart",
        description: "Tez va ishonchli start",
        subDescription: "Endigina boshlamoqchi bo'lganlar uchun",
        price: basePricesUSD.namingStandard,
        features: [
            "5 ta nom varianti tayyorlanadi",
            "Har bir nom uchun qisqa izoh beriladi",
            "Nomning talaffuzi qulay va esda qolishi oson ekanligi tekshiriladi",
            "Domen tekshiruvi (.com, .uz)",
            "Instagram va Telegram uchun username bo'shligini tekshirish",
            "1 ta tuzatish raundi"
        ],
        benefits: [
            { icon: "🛡️", title: "Xavfli nomdan qutulasiz", description: "Noto'g'ri talaffuz qilinadigan nom mijozlarni yo'qotishiga yo'l qo'ymaymiz." },
            { icon: "⚡", title: "Vaqt tejaysiz", description: "Yuzlab nom o'ylab o'tirish o'rniga, professional tahlil qilingan nom olasiz." },
            { icon: "✅", title: "Ishonch bilan boshlaysiz", description: "\"To'g'ri nom topdimmi?\" degan shubhalar yo'qoladi." },
            { icon: "📱", title: "Digital tayyor bo'lasiz", description: "Domen va social media username band emasligini bilib olasiz." }
        ],
        timeline: "5 ish kuni"
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
    },
    urgency: {
        label: "Shoshilinch loyiha (+50%)",
        description: "Loyihani navbatdan tashqari boshlash va 2 barobar tezroq bitirib berish.",
        price: 0,
        features: ["Navbatdan tashqari xizmat", "24/7 jamoa ishtiroki", "Tezkor aloqa"],
        results: ["Vaqtni tejash", "Bozorga tezroq chiqish"],
        timeline: "Muddat 50% qisqaradi",
        note: "Umumiy narxga +50% qo'shiladi."
    },
    nda: {
        label: "NDA — Maxfiylik (+50%)",
        description: "Loyiha tafsilotlarini sir saqlash va natijalarni portfolioga qo'shmaslik kelishuvi.",
        price: 0,
        features: ["Yuridik NDA shartnomasi", "Portfolioga qo'yilmaydi", "To'liq maxfiylik"],
        results: ["Strategik sirlar himoyasi"],
        timeline: "Loyiha davomida",
        note: "Umumiy narxga +50% qo'shiladi."
    }
};

export const getServiceDetails = (lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz') => {
    // Kelajakda tillar bo'yicha alohida lug'atlar qaytarish mumkin
    return uzServiceDetails;
};

export function formatPrice(priceInUSD: number, lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz', currency: 'uzs' | 'usd' = 'usd') {
    if (priceInUSD === 0) return lang === 'uz' ? "Kelishiladi" : "Agreed";
    let price = currency === 'uzs' ? convertToUzs(priceInUSD) : priceInUSD;
    let currencyString = currency === 'uzs' ? "so'm" : "$";
    return `${price.toLocaleString('fr-FR')} ${currencyString}`;
}

export type SelectedServices = { [key: string]: boolean; };

export const calculatePackagePrice = (selections: any, lang: string = 'uz'): any => {
    const { selectedServices, discountType = 'none', promoCode = '' } = selections;
    const sd = getServiceDetails(lang as any);
    
    let basePrice = 0;
    let mainServicesCount = 0;
    const mainKeys = ['strategy', 'commStrategy', 'namingStandard', 'namingPremium', 'namingVIP', 'logoStandard', 'logoPremium', 'logoVIP', 'packaging'];
    const surchargeKeys = ['urgency', 'nda'];

    for (const key in selectedServices) {
        if (selectedServices[key] && sd[key as keyof typeof sd] && !surchargeKeys.includes(key)) {
            basePrice += sd[key as keyof typeof sd].price;
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
    const sd = getServiceDetails(lang as any);
    return Object.entries(selectedServices)
        .filter(([_, active]) => active)
        .map(([key]) => sd[key as keyof typeof sd]?.label)
        .filter(Boolean)
        .join(', ');
}

export const comparisonData = (lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz') => {
    const t = {
        uz: [
            { feature: "Strategik yondashuv", competitors: { jon: true, mano: true, abba: false, mountain: false } },
            { feature: "Bozor tahlili", competitors: { jon: true, mano: true, abba: true, mountain: false } },
            { feature: "Neyming (Patent tahlili bilan)", competitors: { jon: true, mano: true, abba: false, mountain: false } },
            { feature: "Logo + Firma uslubi", competitors: { jon: true, mano: true, abba: true, mountain: true } },
            { feature: "Brandbook (to'liq)", competitors: { jon: true, mano: true, abba: false, mountain: false } },
            { feature: "Narx (Premium sifat)", competitors: { jon: "Hamyonbop", mano: "Juda qimmat", abba: "Qimmat", mountain: "O'rtacha" } },
            { feature: "Muddat", competitors: { jon: "Tezkor", mano: "Uzoq", abba: "O'rtacha", mountain: "Tez" } },
        ],
        ru: [
            { feature: "Стратегический подход", competitors: { jon: true, mano: true, abba: false, mountain: false } },
            { feature: "Анализ рынка", competitors: { jon: true, mano: true, abba: true, mountain: false } },
            { feature: "Нейминг (с патентным анализом)", competitors: { jon: true, mano: true, abba: false, mountain: false } },
            { feature: "Лого + Фирменный стиль", competitors: { jon: true, mano: true, abba: true, mountain: true } },
            { feature: "Брендбук (полный)", competitors: { jon: true, mano: true, abba: false, mountain: false } },
            { feature: "Цена (Премиум качество)", competitors: { jon: "Доступно", mano: "Очень дорого", abba: "Дорого", mountain: "Средне" } },
            { feature: "Сроки", competitors: { jon: "Быстро", mano: "Долго", abba: "Средне", mountain: "Быстро" } },
        ],
        en: [
            { feature: "Strategic approach", competitors: { jon: true, mano: true, abba: false, mountain: false } },
            { feature: "Market analysis", competitors: { jon: true, mano: true, abba: true, mountain: false } },
            { feature: "Naming (with patent analysis)", competitors: { jon: true, mano: true, abba: false, mountain: false } },
            { feature: "Logo + Corporate Identity", competitors: { jon: true, mano: true, abba: true, mountain: true } },
            { feature: "Brandbook (full)", competitors: { jon: true, mano: true, abba: false, mountain: false } },
            { feature: "Price (Premium quality)", competitors: { jon: "Affordable", mano: "Very expensive", abba: "Expensive", mountain: "Average" } },
            { feature: "Timeline", competitors: { jon: "Fast", mano: "Long", abba: "Average", mountain: "Fast" } },
        ]
    };
    return t[lang as keyof typeof t] || t.uz;
};
