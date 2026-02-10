'use client';

/**
 * @fileOverview Brending xizmatlari uchun narxlar va chegirmalar mantiqi.
 * Barcha 4 tildagi (UZ, RU, EN, ZH) tariflar va tavsiflar shu yerda jamlangan.
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

const ruServiceDetails = {
    audit: {
        label: "Аудит Логотипа",
        description: "Анализ существующего логотипа и рекомендации по его улучшению.",
        price: basePricesUSD.audit,
        features: ["Анализ сильных и слабых сторон", "Сравнение с конкурентами", "Рекомендации по улучшению"],
        results: ["Отчет об ошибках", "План улучшений"],
        timeline: "2-3 рабочих дня"
    },
    namingCheck: {
        label: "Проверка Нейминга",
        description: "Проверка названия на чистоту в базах Узбекистана и мира.",
        price: basePricesUSD.namingCheck,
        features: ["База Узбекистана (АИС)", "Международная база WIPO", "Домены и соцсети"],
        results: ["Отчет о юридической чистоте", "Анализ рисков"],
        timeline: "1-2 рабочих дня"
    },
    consultation: {
        label: "30-минутная консультация",
        description: "Профессиональный совет по брендингу от Бахтиёржона Газиева.",
        price: basePricesUSD.consultation,
        features: ["Уточнение проблемы", "Ответы на вопросы", "Стратегические советы"],
        results: ["Четкий план действий"],
        timeline: "В согласованное время"
    },
    strategy: {
        label: "Бренд-стратегия и платформа",
        description: "Фундамент вашего бизнеса, приносящий результат.",
        price: basePricesUSD.strategy,
        features: ["Анализ рынка", "Карта целевой аудитории", "Платформа бренда", "Позиционирование", "RTB (Reasons to Believe)"],
        results: ["Документ платформы бренда", "Стратегия позиционирования"],
        timeline: "20-30 рабочих дней"
    },
    namingVIP: {
        label: "👑 Naming VIP",
        description: "Стратегический нейминг для крупных и международных проектов.",
        price: basePricesUSD.namingVIP,
        features: [
            "Личный контроль Бахтиёржона Газиева",
            "10+ эксклюзивных вариантов названия",
            "Фонетический и семантический анализ на 6 языках",
            "Патентная проверка по 3 классам",
            "Подбор домена и ТГ-ника"
        ],
        results: ["Сильное имя мирового уровня", "Максимальное юридическое спокойствие", "100% гарантия возврата"],
        timeline: "20–25 рабочих дней"
    },
    namingPremium: {
        label: "Naming PREMIUM",
        description: "Оптимальный выбор для среднего и развивающегося бизнеса.",
        price: basePricesUSD.namingPremium,
        features: [
            "5 стратегических вариантов названия",
            "Анализ на нескольких языках",
            "Патентная проверка по 2 классам",
            "Создание слогана"
        ],
        results: ["Имя, соответствующее целям бизнеса", "Юридически чистый бренд", "100% гарантия возврата"],
        recommended: true,
        timeline: "14–20 рабочих дней"
    },
    logoVIP: {
        label: "👑 VIP — Лого + Стиль + Брендбук",
        description: "Полная упаковка для крупных и ориентированных на рост компаний.",
        price: basePricesUSD.logoVIP,
        features: [
            "Участие и контроль Бахтиёржона Газиева",
            "8+ концепций логотипа на основе стратегии",
            "25+ тачпоинтов (точек контакта)",
            "Полный визуальный брендбук (50+ стр.)",
            "Анимация логотипа"
        ],
        results: ["Прочная визуальная система", "Четкое руководство по маркетингу", "100% гарантия возврата"],
        timeline: "20–30 рабочих дней"
    },
    logoPremium: {
        label: "Лого + Фирменный стиль PREMIUM",
        description: "Визуальная система для тех, кто серьезно развивает свой бренд.",
        price: basePricesUSD.logoPremium,
        features: [
            "5 стратегических концепций логотипа",
            "Фирменный стиль (цвета, шрифты, паттерны)",
            "15+ визуализаций тачпоинтов",
            "Гайдлайн (руководство)"
        ],
        results: ["Целостный визуальный образ", "Порядок в маркетинге", "100% гарантия возврата"],
        recommended: true,
        timeline: "14–20 рабочих дней"
    }
};

const enServiceDetails = {
    namingVIP: {
        label: "👑 Naming VIP",
        description: "Strategic naming for large and international projects.",
        price: basePricesUSD.namingVIP,
        features: [
            "Personal oversight by Bakhtiyorjon Gaziyev",
            "10+ exclusive name variants",
            "Phonetic and semantic analysis in 6 languages",
            "Patent check for up to 3 classes",
            "Domain and TG-handle selection"
        ],
        results: ["World-class strong name", "Maximum legal peace of mind", "100% money-back guarantee"],
        timeline: "20–25 business days"
    },
    namingPremium: {
        label: "Naming PREMIUM",
        description: "Best choice for medium and growing businesses.",
        price: basePricesUSD.namingPremium,
        features: [
            "5 strategic name variants",
            "Analysis in multiple languages",
            "Patent check for 2 classes",
            "Slogan creation"
        ],
        results: ["Name aligned with business goals", "Legally clear brand", "100% money-back guarantee"],
        recommended: true,
        timeline: "14–20 business days"
    }
};

const zhServiceDetails = {
    namingVIP: {
        label: "👑 Naming VIP",
        description: "针对大型和国际项目的战略命名。",
        price: basePricesUSD.namingVIP,
        features: ["由 Bakhtiyorjon Gaziyev 亲身监督", "10+ 独家名称方案", "6 种语言的音韵和语义分析", "最多 3 个类别的专利检查", "域名和 TG 账号选择"],
        results: ["世界级的强大名称", "最高法律保障", "100% 退款保证"],
        timeline: "20–25 个工作日"
    }
};

export const getServiceDetails = (lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz') => {
    switch (lang) {
        case 'ru': return { ...uzServiceDetails, ...ruServiceDetails };
        case 'en': return { ...uzServiceDetails, ...enServiceDetails };
        case 'zh': return { ...uzServiceDetails, ...zhServiceDetails };
        default: return uzServiceDetails;
    }
};

export function formatPrice(priceInUSD: number, lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz', currency: 'uzs' | 'usd' = 'usd') {
    if (priceInUSD === 0) return lang === 'uz' ? "Kelishiladi" : lang === 'ru' ? "По догов." : "Agreed";
    let price = currency === 'uzs' ? convertToUzs(priceInUSD) : priceInUSD;
    let currencyString = currency === 'uzs' ? (lang === 'uz' ? "so'm" : "сум") : '$';
    return `${price.toLocaleString('fr-FR')} ${currencyString}`;
}

const PROMO_CODES: Record<string, number> = { 'JON2025': 0.05, 'BAXTIYOR': 0.05 };

export type SelectedServices = {
    [key: string]: boolean;
};

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
    
    // 1. Paket chegirmasi
    if (mainServicesCount >= 2) {
        const val = basePrice * 0.20;
        discountsApplied.push({ 
            name: lang === 'uz' ? 'Paketli chegirma (-20%)' : lang === 'ru' ? 'Пакетная скидка (-20%)' : 'Package discount (-20%)', 
            value: val 
        });
        finalPrice -= val;
    }
    
    // 2. Oldindan to'lov chegirmasi
    if (wantsUpfrontPayment) {
        const val = finalPrice * 0.10;
        discountsApplied.push({ 
            name: lang === 'uz' ? 'Oldindan to\'lov (-10%)' : lang === 'ru' ? 'Скидка за предоплату (-10%)' : 'Upfront payment discount (-10%)', 
            value: val 
        });
        finalPrice -= val;
    }
    
    // 3. Promokod
    const normalizedPromo = promoCode?.trim().toUpperCase();
    if (PROMO_CODES[normalizedPromo]) {
        const val = finalPrice * PROMO_CODES[normalizedPromo];
        discountsApplied.push({ 
            name: `${lang === 'uz' ? 'Promokod' : 'Промокод'} (${normalizedPromo})`, 
            value: val 
        });
        finalPrice -= val;
    }

    return { 
        base: basePrice, 
        final: finalPrice, 
        discountApplied: discountsApplied, 
        savings: basePrice - finalPrice 
    };
}

export const generateSummary = (selections: any, lang: string = 'uz'): string => {
    const { selectedServices } = selections;
    const sd = getServiceDetails(lang as any);
    const selectedLabels = Object.entries(selectedServices)
        .filter(([_, active]) => active)
        .map(([key]) => sd[key as keyof typeof sd]?.label)
        .filter(Boolean);
    
    return selectedLabels.join(', ');
}

export const comparisonData = (lang: 'uz' | 'ru' | 'en' = 'uz') => {
    const t = {
        uz: {
            strategy: "Strategik yondashuv",
            naming: "Patentga toza neyming",
            process: "Shaffof ish jarayoni",
            return: "To'lovni qaytarish kafolati",
            price: "Premium sifat / Arzon narx"
        },
        ru: {
            strategy: "Стратегический подход",
            naming: "Патентно-чистый нейминг",
            process: "Прозрачный процесс",
            return: "Гарантия возврата",
            price: "Премиум качество / Доступная цена"
        },
        en: {
            strategy: "Strategic approach",
            naming: "Patent-clear naming",
            process: "Transparent process",
            return: "Money-back guarantee",
            price: "Premium quality / Affordable price"
        }
    }[lang];

    return [
        { feature: t.strategy, competitors: { jon: true, mano: true, abba: false, mountain: false } },
        { feature: t.naming, competitors: { jon: true, mano: true, abba: true, mountain: false } },
        { feature: t.process, competitors: { jon: true, mano: false, abba: false, mountain: true } },
        { feature: t.return, competitors: { jon: true, mano: false, abba: false, mountain: false } },
        { feature: t.price, competitors: { jon: "Optimal", mano: "Juda qimmat", abba: "Qimmat", mountain: "Arzon" } },
    ];
};