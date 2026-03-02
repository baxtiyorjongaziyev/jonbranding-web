
'use client';

/**
 * @fileOverview Narxlar va xizmatlar bazasi.
 * Includes VIP tariffs, RAMAZON/PCG/KURSDOSH/TEZ NATIJA promos, and 50% surcharges.
 */

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

    const sd: any = {
        audit: {
            label: isRu ? "Аудит логотипа" : (isEn ? "Logo Audit" : "Logo Auditi"),
            description: isRu ? "Анализ существующего логотипа и рекомендации по улучшению." : (isEn ? "Analysis of existing logo and improvement recommendations." : "Mavjud logotipni tahlil qilish va yaxshilash bo'yicha tavsiyalar."),
            price: basePricesUSD.audit,
            features: isRu ? ["Анализ сильных и слабых сторон", "Сравнение с конкурентами", "План улучшений"] : (isEn ? ["SWOT analysis", "Competitor comparison", "Improvement plan"] : ["Kuchli va zaif tomonlar tahlili", "Raqobatchatchilar bilan solishtirish", "Yaxshilash rejasini tuzish"]),
            timeline: isRu ? "2-3 рабочих дня" : (isEn ? "2-3 business days" : "2-3 ish kuni")
        },
        namingCheck: {
            label: isRu ? "Проверка нейминга" : (isEn ? "Naming Check" : "Neyming Tekshiruvi"),
            description: isRu ? "Проверка доступности названия бренда в Узбекистане и международных базах." : (isEn ? "Checking brand name availability in Uzbekistan and international databases." : "Brend nomining O'zbekiston va xalqaro bazalarda bo'shligini tekshirish."),
            price: basePricesUSD.namingCheck,
            features: isRu ? ["База IMA (Узбекистан)", "База WIPO (Международная)", "Домен и соцсети"] : (isEn ? ["IMA database", "WIPO database", "Domain & Social handles"] : ["IMA bazasi (O'zbekiston)", "WIPO bazasi (Xalqaro)", "Domen va ijtimoiy tarmoqlar"]),
            timeline: isRu ? "1-2 рабочих дня" : (isEn ? "1-2 business days" : "1-2 ish kuni")
        },
        consultation: {
            label: isRu ? "30-минутная консультация" : (isEn ? "30-min consultation" : "30 daqiqalik konsultatsiya"),
            description: isRu ? "Профессиональный совет по брендингу от Бахтиёржона Газиева." : (isEn ? "Professional branding advice from Bakhtiyorjon Gaziyev." : "Brending bo'yicha Baxtiyorjon Gaziyevdan professional maslahat."),
            price: basePricesUSD.consultation,
            features: isRu ? ["Уточнение проблемы", "Стратегические рекомендации", "Ответы на вопросы"] : (isEn ? ["Problem definition", "Strategic advice", "Q&A session"] : ["Muammoni aniqlashtirish", "Strategik tavsiyalar", "Savollarga javoblar"]),
            timeline: isRu ? "По договоренности" : (isEn ? "By agreement" : "Kelishilgan vaqtda")
        },
        strategy: {
            label: isRu ? "Бренд-стратегия и платформа" : (isEn ? "Brand strategy & platform" : "Brend-strategiya va platforma"),
            description: isRu ? "Фундамент для вашего бизнеса, приносящий результат." : (isEn ? "The foundation for your business that drives results." : "Biznesingiz uchun natija keltiradigan poydevor."),
            price: basePricesUSD.strategy,
            features: isRu ? ["Анализ рынка", "Позиционирование", "Платформа бренда", "Tone of Voice"] : (isEn ? ["Market analysis", "Positioning", "Brand platform", "Tone of Voice"] : ["Bozor tahlili", "Pozitsiyalash", "Brend platformasi", "Tone of Voice"]),
            timeline: isRu ? "20-30 рабочих дней" : (isEn ? "20-30 business days" : "20-30 ish kuni")
        },
        commStrategy: {
            label: isRu ? "Коммуникационная стратегия" : (isEn ? "Communication strategy" : "Kommunikatsion strategiya"),
            description: isRu ? "Стратегия общения с клиентами и Tone of Voice." : (isEn ? "Customer communication strategy and Tone of Voice." : "Mijozlar bilan muloqot strategiyasi va Tone of Voice."),
            price: basePricesUSD.commStrategy,
            features: isRu ? ["Ключевые сообщения", "Планирование каналов", "Контент-пиллеры"] : (isEn ? ["Key messages", "Channel planning", "Content pillars"] : ["Asosiy xabarlar", "Kanallarni rejalashtirish", "Content-pillerlar"]),
            timeline: isRu ? "15-20 рабочих дней" : (isEn ? "15-20 business days" : "15-20 ish kuni")
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
                "O'zbekiston va xalqaro bazalarda patent tekshiruvi (WIPO)",
                "Patentga topshirib berish xizmati (birinchi bosqich to'liq)",
                "Domen va Username tekshiruvi",
                "Cheksiz tuzatish (30 kun ichida)"
            ],
            benefits: [
                { icon: "🌍", title: "Xalqaro bozorga tayyorsiz", description: "Nom xalqaro talablar asosida tekshiriladi." },
                { icon: "🔒", title: "Nom to'liq sizniki", description: "Rasmiy patent himoyasi bilan ta'minlanadi." },
                { icon: "💎", title: "Biznes uchun real aktiv", description: "Himoyalangan nom biznesning eng qimmatli mulki." },
                { icon: "🎯", title: "Eng to'g'ri yo'l", description: "Bozorda adashmasligingiz uchun strategik tanlov." }
            ]
        },
        namingPremium: {
            label: "Naming Premium",
            description: "To'g'ri nom, to'g'ri asos",
            subDescription: "O'sishni rejalashtiraganlar uchun",
            price: basePricesUSD.namingPremium,
            recommended: true,
            timeline: "⏱ 7 ish kuni",
            features: [
                "10 ta nom varianti tayyorlanadi",
                "Har bir nom uchun strategik izoh",
                "Talaffuz va esda qolishi tekshiriladi",
                "O'zbekiston bazasida patent tekshiruvi",
                "3 ta tuzatish raundi"
            ],
            benefits: [
                { icon: "⚖️", title: "Huquqiy xavfsizlik", description: "Kelajakdagi qimmat muammolardan saqlanasiz." },
                { icon: "🏆", title: "Ajralib turish", description: "Mijozlar sizni boshqalardan darhol taniydi." },
                { icon: "❤️", title: "Mijozlar mehri", description: "Nomda hissiyot va sadoqat mujassam bo'ladi." },
                { icon: "📈", title: "Kuchli start", description: "Marketing xarajatlarini kamaytiradigan nom." }
            ]
        },
        namingStandard: {
            label: "Naming Standart",
            description: "Tez va ishonchli start",
            subDescription: "Endigina boshlamoqchi bo'lganlar uchun",
            price: basePricesUSD.namingStandard,
            timeline: "⏱ 5 ish kuni",
            features: [
                "5 ta nom varianti tayyorlanadi",
                "Nomlar uchun qisqa izohlar",
                "Talaffuz qulayligi tekshiruvi",
                "Domen va Username tekshiruvi",
                "1 ta tuzatish raundi"
            ],
            benefits: [
                { icon: "🛡️", title: "Xatolardan himoya", description: "Noto'g'ri nom tanlash xavfidan saqlanasiz." },
                { icon: "⚡", title: "Tejamkorlik", description: "Tekshirilgan nomga tezkor ega bo'lasiz." },
                { icon: "✅", title: "Ishonchli start", description: "Ishni ortiqcha xavotirsiz boshlaysiz." },
                { icon: "📱", title: "Digital tayyor", description: "Domen va loginlar bilan muammo bo'lmaydi." }
            ]
        },
        logoStandard: {
            label: "Unikal Logo",
            description: "Endigina boshlamoqchi bo'lganlar uchun",
            subDescription: "Sifatli start uchun",
            price: basePricesUSD.logoStandard,
            timeline: "⏱ 5 ish kuni",
            features: [
                "2 ta logo varianti — ikkalasidan birini tanlaysiz",
                "Har bir variant uchun strategik izoh",
                "Logo 4 xil ko'rinishda (hamma formatlar)",
                "Ijtimoiy tarmoqlar uchun profil rasmi",
                "3 xil fayl formati (PNG, SVG, AI)",
                "8 ta aloqa nuqtasida vizual namoyish",
                "2 ta tuzatish imkoniyati"
            ],
            benefits: [
                { icon: "🎯", title: "Universal qo'llanilish", description: "Logongiz hamma joyga — sayt, Instagram va chop etishga tayyor." },
                { icon: "✅", title: "\"Bu mening brendim\" deyishingiz mumkin", description: "O'zingiz yasaganga o'xshamaydigan professional ko'rinish." },
                { icon: "👁️", title: "Real hayotda qanday ko'rinishini bilasiz", description: "8 ta muhim nuqtada logongiz qanday ko'rinishini vizual ko'rasiz." },
                { icon: "🛡️", title: "Fayllar to'liq sizniki", description: "Barcha manba fayllar topshiriladi, keyinchalik foydalanishga qulay." }
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
                "Har bir variant uchun chuqur izoh",
                "Logo 4 xil ko'rinishda (hamma formatlar)",
                "Ijtimoiy tarmoqlar uchun profil rasmi",
                "Rasmiy ranglar to'plami va kodlari",
                "Rasmiy brend shrifti",
                "15 ta aloqa nuqtasida vizual namoyish",
                "3 ta tuzatish imkoniyati"
            ],
            benefits: [
                { icon: "🏆", title: "Har joyda bir xil, professional ko'rinasiz", description: "Saytingiz, Instagramingiz, vizitchangiz — hammasi bir uslubda." },
                { icon: "💼", title: "Xodimlaringiz ham to'g'ri ishlatadi", description: "Aniq ranglar va shrift bo'lgach, hech kim adashmaydi." },
                { icon: "📸", title: "Mijozlarga ko'rsatishga tayyor", description: "15 ta aloqa nuqtasida brendingiz qanday ko'rinishini ko'rasiz." },
                { icon: "📈", title: "Brend qiymati oshadi", description: "Izchil ko'rinish professional biznesning asosiy belgisidir." }
            ]
        },
        logoVIP: {
            label: "Logo + Firma uslubi + Brandbook",
            description: "Hamma narsani bir marta to'g'ri qilmoqchilar uchun",
            subDescription: "To'liq brend konstitutsiyasi",
            price: basePricesUSD.logoVIP,
            timeline: "⏱ 15–20 ish kuni",
            features: [
                "3 ta logo varianti + chuqur strategik izoh",
                "Logo 4 xil ko'rinishda (hamma formatlar)",
                "Ijtimoiy tarmoqlar uchun profil rasmi",
                "To'liq Brandbook (30-50 sahifa)",
                "25 ta aloqa nuqtasida professional vizual",
                "Cheksiz tuzatish (30 kun ichida)",
                "Logoning to'liq mulkchilik huquqi sertifikati"
            ],
            benefits: [
                { icon: "📖", title: "Istalgan odamga berib, natija olasiz", description: "Dizayner yoki SMMchi qo'llanma bilan to'g'ri ishlaydi." },
                { icon: "🔒", title: "Brend yillar o'tsa ham buzilmaydi", description: "Brendingiz bugun ham, 10 yildan keyin ham bir xil kuchli ko'rinadi." },
                { icon: "🌍", title: "Xalqaro darajada tayyor ko'rinasiz", description: "Investor yoki sheriklar jiddiy kompaniya ekaningizni his qiladi." },
                { icon: "💎", title: "Bu bir marta qilinadigan investitsiya", description: "Har yili qayta dizayn qilish o'rniga, bir marta to'g'ri qiling." }
            ]
        },
        packaging: {
            label: isRu ? "Дизайн упаковки" : (isEn ? "Packaging Design" : "Qadoq dizayni"),
            description: isRu ? "Профессиональная упаковка." : (isEn ? "Professional packaging." : "Professional qadoq dizayni."),
            price: basePricesUSD.packaging,
            features: ["Bozor tahlili", "2 ta dizayn konsepsiyasi", "Chopga tayyor fayllar"],
            timeline: "10-15 ish kuni"
        },
        smm: {
            label: isRu ? "Стиль для соцсетей" : (isEn ? "Social media style" : "Ijtimoiy tarmoqlar uchun stil"),
            description: isRu ? "Система оформления." : (isEn ? "Design system." : "Post va storis bezash tizimi."),
            price: basePricesUSD.smm,
            features: ["6 ta post shabloni", "6 ta stories shabloni"],
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
            description: "Portfolioga qo'shmaslik.",
            price: 0,
            timeline: "Loyiha davomida"
        }
    };
    return sd;
};

export function formatPrice(priceInUSD: number, lang: string = 'uz', currency: 'uzs' | 'usd' = 'usd') {
    if (priceInUSD === 0) return lang === 'uz' ? "Kelishiladi" : (lang === 'ru' ? "По догов." : "Agreed");
    let price = currency === 'uzs' ? Math.round(priceInUSD * USD_TO_UZS_RATE / 100000) * 100000 : priceInUSD;
    let currencyString = currency === 'uzs' ? "so'm" : "$";
    return `${price.toLocaleString('fr-FR')} ${currencyString}`;
}

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

    return { base: basePrice, surchargesTotal, totalBeforeDiscounts, final: finalPrice, discountApplied: discountsApplied, surchargesApplied, savings: totalBeforeDiscounts - finalPrice, isPromoApplied };
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
