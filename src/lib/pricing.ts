
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
        features: ["Logotipning kuchli va zaif tomonlari tahlili", "Raqobatchilarga nisbatan tahlil", "Yaxshilash bo'yicha aniq tavsiyalar"]
    },
    namingCheck: {
        label: "Neyming Tekshiruvi",
        description: "Brend nomining O'zbekiston va xalqaro bazalarda bo'shligini tekshirish.",
        price: basePricesUSD.namingCheck,
        features: ["O'zbekiston bazasi bo'yicha chuqur tekshiruv", "Xalqaro WIPO bazasi bo'yicha tekshiruv", "Domen va ijtimoiy tarmoqlarda bo'shlik tekshiruvi"]
    },
    consultation: {
        label: "30 daqiqalik konsultatsiya",
        description: "Brending bo'yicha har qanday savolingizga tezkor yo'l-yo'riq va professional maslahat.",
        price: basePricesUSD.consultation,
        features: ["Biznesingizdagi muammoni aniqlashtirish", "Brending bo'yicha savollarga javoblar", "Keyingi qadamlar bo'yicha tavsiyalar"]
    },
    strategy: {
        label: "Brend-strategiya va platforma",
        description: "Biznesingiz uchun natija keltiradigan poydevor — bozor tahlili, pozitsiyalash va kommunikatsiya.",
        price: basePricesUSD.strategy,
        features: ["Bozor va raqobatchilar tahlili", "Maqsadli auditoriya xaritasi", "Brend platformasi (missiya, qadriyatlar)", "Pozitsiyalash va UST"]
    },
    commStrategy: {
        label: "Kommunikatsion strategiya",
        description: "Mijozlar bilan muloqot strategiyasi: ohang, asosiy xabarlar, kanallar.",
        price: basePricesUSD.commStrategy,
        features: ["Brend ovozi (Tone of Voice)", "Asosiy xabarlar ishlab chiqish", "Kommunikatsiya kanallarini rejalashtirish"]
    },
    namingVIP: {
        label: "👑 Naming VIP",
        description: "Katta va xalqaro bozorga mo'ljallangan loyihalar uchun.",
        price: basePricesUSD.namingVIP,
        features: [
            "Shaxsan Baxtiyorjon Gaziyev nazorati",
            "10+ eksklyuziv nom variantlari",
            "6 tilda fonetik va semantik tahlil",
            "3 tagacha klass bo'yicha patent tekshiruvi",
            "10 yilga bepul .uz domen"
        ],
        results: [
            "Xalqaro miqyosda ishlaydigan kuchli nom",
            "Maksimal huquqiy xotirjamlik",
            "Eng yuqori darajadagi ijodiy yondashuv"
        ],
        timeline: "20–25 ish kuni",
        note: "Bu tarifda biz sizga nafaqat nom, balki kelajakdagi brendingiz poydevorini beramiz."
    },
    namingPremium: {
        label: "Naming PREMIUM",
        description: "O'rta va rivojlanayotgan biznes uchun strategik yondashuv.",
        price: basePricesUSD.namingPremium,
        features: [
            "5 ta strategik nom variantlari",
            "Bir nechta tilda tahlil",
            "2 ta klass bo'yicha patent tekshiruvi",
            "5 yilga bepul .uz domen"
        ],
        results: [
            "Biznes maqsadingizga xizmat qiladigan nom",
            "Huquqiy jihatdan toza va xavfsiz brend",
            "Raqobatchilardan ajralib turuvchi ovoz"
        ],
        recommended: true,
        timeline: "14–20 ish kuni"
    },
    namingStandard: {
        label: "Naming STANDARD",
        description: "Kichik biznes va startaplar uchun ideal.",
        price: basePricesUSD.namingStandard,
        features: [
            "3 ta jarangli nom variantlari",
            ".uz domen bo'shligi tekshiruvi",
            "Ijtimoiy tarmoqlarda band emasligi"
        ],
        results: [
            "Tez va sifatli start uchun nom",
            "Oson eslab qolinadigan belgi"
        ],
        timeline: "7–10 ish kuni",
        note: "Muhim: ushbu tarifda patent tekshiruvi va chuqur semantik tahlil o'tkazilmaydi."
    },
    logoVIP: {
        label: "👑 Logo + Firma uslubi + Brandbook VIP",
        description: "Katta, o‘sishga yoki xalqaro bozorga yo‘naltirilgan bizneslar uchun.",
        price: basePricesUSD.logoVIP,
        features: [
            "Shaxsan Baxtiyorjon Gaziyev ishtiroki va nazorati",
            "Brend strategiyasi asosida 8+ logotip konsepsiyasi",
            "25+ touchpoint dizayn (offline va online)",
            "To‘liq Vizual Brandbook: qoidalar, grid, ranglar tizimi",
            "Alohida Logobook (PDF + print-ready)",
            "Logotip animatsiyasi (premium sifat)",
            "3 oy davomida post-delivery qo‘llab-quvvatlash"
        ],
        results: [
            "Brendni yillar davomida olib yuradigan mustahkam tizim",
            "Jamoa va marketing uchun aniq qo‘llanma",
            "Investorlar oldida ishonchli ko‘rinish",
            "Qayta dizayn qilish ehtimoli minimal"
        ],
        timeline: "20–30 ish kuni",
        note: "Bu tarifda siz faqat dizayn emas, tizim va xotirjamlik olasiz."
    },
    logoPremium: {
        label: "Logo + Firma uslubi PREMIUM",
        description: "O‘z brendini jiddiy rivojlantirishni boshlagan bizneslar uchun.",
        price: basePricesUSD.logoPremium,
        features: [
            "5 ta strategik logotip konsepsiyasi",
            "Firma uslubi (ranglar, shriftlar, patternlar)",
            "15+ touchpoint vizualizatsiyasi",
            "10 ta Telegram stiker",
            "Professional taqdimot maketlari"
        ],
        results: [
            "Yaxlit vizual obraz",
            "Brendni taniladigan qiladigan firma uslubi",
            "Marketingda tartib va izchillik"
        ],
        recommended: true,
        timeline: "14–20 ish kuni"
    },
    logoStandard: {
        label: "Logotip STANDARD",
        description: "Startaplar va kichik biznes uchun tezkor yechim.",
        price: basePricesUSD.logoStandard,
        features: [
            "3 ta logotip konsepsiyasi",
            "5 ta asosiy touchpoint vizualizatsiyasi",
            "Barcha texnik formatlar (AI, PNG, PDF)",
            "Raqobatchilar tahlili"
        ],
        results: [
            "Tez ishga tushirish uchun tayyor logotip",
            "Raqobatchilar orasida yo‘qolib ketmaydigan belgi"
        ],
        timeline: "7–10 ish kuni",
        note: "Eslatma: bu tarifda to‘liq firma uslubi va brendbook ishlab chiqilmaydi."
    },
    packaging: {
        label: "Qadoq dizayni",
        description: "3 SKU uchun qadoq ishlab chiqish, chop etishga tayyorlash.",
        price: basePricesUSD.packaging,
        features: ["Bozor va raqobatchilar tahlili", "2 ta dizayn konsepsiyasi", "3 tagacha SKU adaptatsiyasi"]
    },
    smm: {
        label: "Ijtimoiy tarmoqlar uchun stil",
        description: "Postlar va storislarni firma uslubi va brendingda bezash.",
        price: basePricesUSD.smm,
        features: ["6 ta post shabloni", "6 ta stories shabloni", "Profil vizual konsepsiyasi"]
    }
};

const ruServiceDetails = {
    audit: {
        label: "Аудит логотипа",
        description: "Анализ существующего логотипа и рекомендации по улучшению.",
        price: basePricesUSD.audit,
        features: ["Анализ сильных и слабых сторон", "Сравнение с конкурентами", "Конкретные рекомендации"]
    },
    namingVIP: {
        label: "👑 Нейминг VIP",
        description: "Для крупных и международных проектов.",
        price: basePricesUSD.namingVIP,
        features: ["Личный контроль Б. Газиева", "10+ эксклюзивных вариантов", "Анализ на 6 языках", "Патентная проверка"],
        results: ["Сильное имя мирового уровня", "Юридическое спокойствие", "Творческий подход"],
        timeline: "20–25 рабочих дней"
    },
    namingPremium: {
        label: "Нейминг PREMIUM",
        description: "Стратегический подход для растущего бизнеса.",
        price: basePricesUSD.namingPremium,
        features: ["5 стратегических вариантов", "Анализ на нескольких языках", "Патентная проверка по 2 классам"],
        results: ["Имя для бизнес-целей", "Юридически чистый бренд"],
        recommended: true,
        timeline: "14–20 рабочих дней"
    },
    namingStandard: {
        label: "Нейминг STANDARD",
        description: "Идеально для малого бизнеса.",
        price: basePricesUSD.namingStandard,
        features: ["3 варианта названия", "Проверка домена .uz"],
        results: ["Быстрый старт", "Легко запомнить"],
        timeline: "7–10 рабочих дней"
    },
    logoVIP: {
        label: "👑 Лого + Стиль + Брендбук VIP",
        description: "Для крупного бизнеса.",
        price: basePricesUSD.logoVIP,
        features: ["Личный контроль Б. Газиева", "8+ концепций", "25+ точек контакта", "Полный Брендбук", "Анимация"],
        results: ["Прочная система на годы", "Руководство для команды", "Инвестиционная привлекательность"],
        timeline: "20–30 рабочих дней"
    },
    logoPremium: {
        label: "Лого + Стиль PREMIUM",
        description: "Для серьезного развития бренда.",
        price: basePricesUSD.logoPremium,
        features: ["5 стратегических концепций", "Фирменный стиль", "15+ точек контакта"],
        results: ["Целостный образ", "Узнаваемый стиль"],
        recommended: true,
        timeline: "14–20 рабочих дней"
    },
    logoStandard: {
        label: "Логотип STANDARD",
        description: "Быстрое решение для стартапов.",
        price: basePricesUSD.logoStandard,
        features: ["3 концепции логотипа", "5 основных визуализаций"],
        results: ["Готовый логотип", "Символ, который не затеряется"],
        timeline: "7–10 рабочих дней"
    }
};

export const getServiceDetails = (lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz') => {
    if (lang === 'ru') return { ...uzServiceDetails, ...ruServiceDetails };
    return uzServiceDetails;
};

export function formatPrice(priceInUSD: number, lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz', currency: 'uzs' | 'usd' = 'usd', showCurrencySymbol = true) {
    if (priceInUSD === 0) return lang === 'ru' ? 'По догов.' : "Kelishiladi";
    let price = currency === 'uzs' ? convertToUzs(priceInUSD) : priceInUSD;
    let currencyString = currency === 'uzs' ? (lang === 'ru' ? 'сум' : "so'm") : '$';
    if (currency === 'usd' && showCurrencySymbol) return `${currencyString}${price.toLocaleString('en-US')}`;
    if (!showCurrencySymbol) return price.toLocaleString('fr-FR');
    return `${price.toLocaleString('fr-FR')} ${currencyString}`;
}

export type SelectedServices = Record<string, boolean>;

const PROMO_CODES: Record<string, number> = { 'JON2025': 0.05, 'BAXTIYOR': 0.05 };

export const calculatePackagePrice = (selections: any, lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz'): any => {
    const { selectedServices, wantsUpfrontPayment, promoCode } = selections;
    const sd = getServiceDetails(lang);
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
        discountsApplied.push({ name: lang === 'ru' ? 'Пакетная скидка (-20%)' : 'Paketli chegirma (-20%)', value: val });
        finalPrice -= val;
    }
    if (wantsUpfrontPayment) {
        const val = finalPrice * 0.10;
        discountsApplied.push({ name: lang === 'ru' ? 'За предоплату (-10%)' : 'Oldindan to\'lov (-10%)', value: val });
        finalPrice -= val;
    }
    const normalizedPromo = promoCode?.trim().toUpperCase();
    if (PROMO_CODES[normalizedPromo]) {
        const val = finalPrice * PROMO_CODES[normalizedPromo];
        discountsApplied.push({ name: `${lang === 'ru' ? 'Промокод' : 'Promokod'} (${normalizedPromo})`, value: val });
        finalPrice -= val;
    }

    return { base: basePrice, final: finalPrice, discountApplied: discountsApplied, savings: basePrice - finalPrice };
}

export function generateSummary(selections: any, lang: string): string {
    const { selectedServices } = selections;
    const sd = getServiceDetails(lang as any);
    return Object.entries(selectedServices).filter(([_, v]) => v).map(([k]) => sd[k as keyof typeof sd]?.label).join(', ') || 'Hech narsa tanlanmagan';
}

export const comparisonData = (lang: 'uz' | 'ru' | 'en') => [
    { feature: lang === 'ru' ? 'Стратегический подход' : 'Strategik yondashuv', competitors: { jon: true, mano: true, abba: true, mountain: true } },
    { feature: lang === 'ru' ? 'Личный контроль арт-директора' : 'Art-direktor shaxsiy nazorati', competitors: { jon: true, mano: false, abba: false, mountain: false } },
    { feature: lang === 'ru' ? 'Гарантия возврата денег' : 'To\'lovni qaytarish kafolati', competitors: { jon: true, mano: false, abba: false, mountain: false } }
];
