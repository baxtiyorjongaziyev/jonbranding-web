
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
    const isUz = lang === 'uz';
    const isRu = lang === 'ru';
    const isZh = lang === 'zh';
    
    return {
        audit: {
            label: isUz ? "Logo Auditi" : (isRu ? "Аудит логотипа" : (isZh ? "标志审计" : "Logo Audit")),
            price: basePricesUSD.audit,
            timeline: isUz ? "⏱ 2-3 ish kuni" : (isRu ? "⏱ 2-3 рабочих дня" : (isZh ? "⏱ 2-3 个工作日" : "⏱ 2-3 business days")),
            features: isUz ? ["Logoning texnik tahlili", "Bozorga moslik tekshiruvi", "Kamchiliklar ro'yxati", "Yaxshilash bo'yicha tavsiyalar"] : ["Technical analysis", "Market fit check", "List of weaknesses", "Improvement tips"],
            benefits: isUz ? [
                { icon: "🔍", title: "Kamchiliklarni bilasiz", description: "Logotipingizdagi barcha xato va kamchiliklar aniqlanadi." },
                { icon: "💡", title: "Yaxshilash yo'li", description: "Logotipni qanday qilib zamonaviy qilish bo'yicha aniq yo'l xaritasi olasiz." }
            ] : [
                { icon: "🔍", title: "Identify flaws", description: "Discover all technical and strategic errors in your logo." },
                { icon: "💡", title: "Improvement path", description: "Get a clear roadmap on how to modernize your visual identity." }
            ]
        },
        namingCheck: {
            label: isUz ? "Neyming Tekshiruvi" : (isRu ? "Проверка нейминга" : (isZh ? "命名检查" : "Naming Check")),
            price: basePricesUSD.namingCheck,
            timeline: isUz ? "⏱ 1-2 ish kuni" : (isRu ? "⏱ 1-2 рабочих дня" : (isZh ? "⏱ 1-2 个工作日" : "⏱ 1-2 business days")),
            features: isUz ? ["O'zbekistondan tekshiruv", "Xalqaro bazadan tekshiruv", "Internetda mashhur nomlar tekshiruvi"] : ["Local check", "International check", "Famous names check"],
            benefits: isUz ? [
                { icon: "⚖️", title: "Huquqiy xavfsizlik", description: "Nomingiz boshqa patent bilan to'qnash kelmasligini bilasiz." },
                { icon: "✅", title: "Ishonch bilan boshlash", description: "Nomning band emasligiga amin bo'lib, ishni boshlaysiz." }
            ] : [
                { icon: "⚖️", title: "Legal Safety", description: "Check availability." },
                { icon: "✅", title: "Confident Start", description: "Start knowing the name is free." }
            ]
        },
        consultation: {
            label: isUz ? "Konsultatsiya" : (isRu ? "Консультация" : (isZh ? "咨询" : "Consultation")),
            price: basePricesUSD.consultation,
            timeline: isUz ? "⏱ 60 daqiqa" : (isRu ? "⏱ 60 минут" : (isZh ? "⏱ 60 分钟" : "⏱ 60 minutes")),
            features: isUz ? ["Muammolarni tahlil qilish", "Brending strategiyasi", "Savollarga javoblar", "Yo'l xaritasi tuzish"] : ["Problem analysis", "Branding strategy", "Q&A", "Roadmap"],
            benefits: isUz ? [
                { icon: "💬", title: "Ekspert fikri", description: "9 yillik tajribaga ega mutaxassisdan shaxsiy maslahat." },
                { icon: "🎯", title: "Aniq maqsad", description: "Biznesingiz uchun qaysi brending bosqichi kerakligini aniqlaysiz." }
            ] : [
                { icon: "💬", title: "Expert opinion", description: "Personal advice." },
                { icon: "🎯", title: "Clear Goal", description: "Define branding steps." }
            ]
        },
        strategy: {
            label: isUz ? "Brend-strategiya" : (isRu ? "Бренд-стратегия" : (isZh ? "品牌策略" : "Brand Strategy")),
            price: basePricesUSD.strategy,
            timeline: isUz ? "⏱ 20-30 ish kuni" : (isRu ? "⏱ 20-30 рабочих дней" : (isZh ? "⏱ 20-30 个工作日" : "⏱ 20-30 business days")),
            features: isUz ? ["Bozor va raqobat tahlili", "Maqsadli auditoriya xaritasi", "Brend platformasi", "Pozitsiyalash strategiyasi", "USP"] : ["Market analysis", "Audience map", "Brand platform", "Positioning", "USP"],
            benefits: isUz ? [
                { icon: "📊", title: "Bozorda aniq o'rin", description: "Raqobatchilaringizdan qanday ajralib turishni aniq bilasiz." },
                { icon: "🚀", title: "Sotuvlar o'sishi", description: "To'g'ri pozitsiyalash mijozlar sonini oshiradi." }
            ] : [
                { icon: "📊", title: "Market Position", description: "Stand out." },
                { icon: "🚀", title: "Sales Growth", description: "Increase conversion." }
            ]
        },
        commStrategy: {
            label: isUz ? "Kommunikatsion strategiya" : (isRu ? "Коммуникационная стратегия" : (isZh ? "传播策略" : "Communication Strategy")),
            price: basePricesUSD.commStrategy,
            timeline: isUz ? "⏱ 15-20 ish kuni" : (isRu ? "⏱ 15-20 рабочих дней" : (isZh ? "⏱ 15-20 个工作日" : "⏱ 15-20 business days")),
            features: isUz ? ["Brend ovozi (Tone of Voice)", "Asosiy xabarlar tizimi", "Media kanallar tanlovi", "Kontent rejasi tamoyillari"] : ["Tone of Voice", "Messaging", "Media channels", "Content plan"],
            benefits: isUz ? [
                { icon: "📢", title: "Mijoz bilan til topishish", description: "Auditoriya bilan qaysi tilda gaplashishni belgilaysiz." },
                { icon: "🔗", title: "Yaxlit muloqot", description: "Barcha kanallarda brendingiz bir xil va kuchli yangraydi." }
            ] : [
                { icon: "📢", title: "Connection", description: "Define language." },
                { icon: "🔗", title: "Unified Voice", description: "Sound consistent." }
            ]
        },
        namingVIP: {
            label: "Naming VIP",
            price: basePricesUSD.namingVIP,
            timeline: isUz ? "⏱ 20–25 ish kuni" : "⏱ 20–25 business days",
            features: isUz ? [
                "10 ta nom varianti",
                "Har bir nom uchun strategik izoh",
                "Nomning fonetik va talaffuz tahlili",
                "Domen bo'shligini tekshirish (.uz, .com)",
                "Social media username tekshiruvi",
                "O'zbekiston bazasida patent tekshiruvi",
                "Raqobatchilar tahlili",
                "Linguistik tahlil (6 tilda)",
                "Nomning hissiy ta'siri tahlili",
                "3 ta shior varianti",
                "Patentga topshirish xizmati",
                "Mulkchilik sertifikati",
                "30 kunlik cheksiz tahrirlar"
            ] : ["10 concepts", "Strategic explanation", "Phonetics", "Domain check", "Social check", "Local patent check", "Competitor analysis", "Linguistics (6 lang)", "Emotional impact", "3 slogans", "Patent filing", "Certificate", "Unlimited revisions (30 days)"],
            benefits: isUz ? [
                { icon: "🌍", title: "Global tayyor", description: "Nomingiz dunyo bo'ylab ishlaydi." },
                { icon: "🔒", title: "To'liq himoya", description: "Patent va sertifikat bilan nomingiz faqat sizniki." }
            ] : [
                { icon: "🌍", title: "Global Ready", description: "Works worldwide." },
                { icon: "🔒", title: "Full Protection", description: "Patent protected." }
            ]
        },
        namingPremium: {
            label: "Naming Premium",
            price: basePricesUSD.namingPremium,
            recommended: true,
            timeline: isUz ? "⏱ 14–20 ish kuni" : "⏱ 14–20 business days",
            features: isUz ? [
                "6 ta nom varianti tayyorlanadi",
                "Strategik izohlar",
                "Domen va Social media tekshiruvi",
                "O'zbekiston bazasida patent tekshiruvi",
                "Raqobatchilar tahlili",
                "Nomning hissiy ma'nosi",
                "3 ta tahrirlash imkoniyati"
            ] : ["6 concepts", "Strategy", "Digital check", "Local patent check", "Competitor analysis", "Emotional impact", "3 revisions"],
            benefits: isUz ? [
                { icon: "⚖️", title: "Huquqiy xavfsizlik", description: "Patent to'qnashuvidan qutulasiz." },
                { icon: "🏆", title: "Noyoblik", description: "Raqobatchilaringizdan ajralib turasiz." }
            ] : [
                { icon: "⚖️", title: "Legal Safety", description: "No conflicts." },
                { icon: "🏆", title: "Uniqueness", description: "Stand out." }
            ]
        },
        namingStandard: {
            label: "Naming Standart",
            price: basePricesUSD.namingStandard,
            timeline: isUz ? "⏱ 7–10 ish kuni" : "⏱ 7–10 business days",
            features: isUz ? ["3 ta nom varianti", "Qisqa izoh", "Domen tekshiruvi", "1 ta tahrir"] : ["3 concepts", "Brief info", "Domain check", "1 revision"],
            benefits: isUz ? [
                { icon: "⚡", title: "Tezkorlik", description: "Vaqt tejaysiz." },
                { icon: "✅", title: "Professional", description: "Tahlil qilingan nom olasiz." }
            ] : [
                { icon: "⚡", title: "Speed", description: "Save time." },
                { icon: "✅", title: "Professional", description: "Analyzed name." }
            ]
        },
        logoStandard: {
            label: isUz ? "Logo Standart" : (isRu ? "Логотип Стандарт" : (isZh ? "标准标志" : "Standard Logo")),
            price: basePricesUSD.logoStandard,
            timeline: isUz ? "⏱ 5 ish kuni" : "⏱ 5 business days",
            features: isUz ? ["3 ta logo varianti", "Logo 4 xil ko'rinishda", "3 xil format (PNG, SVG, AI)", "8 ta aloqa nuqtasi", "2 ta tahrirlash"] : ["3 concepts", "4 lockups", "3 formats", "8 touchpoints", "2 revisions"],
            benefits: isUz ? [
                { icon: "🎯", title: "Tayyor", description: "Hamma joyda ishlatish mumkin." },
                { icon: "🛡️", title: "Mulk", description: "Fayllar to'liq sizniki." }
            ] : [
                { icon: "🎯", title: "Ready", description: "Use anywhere." },
                { icon: "🛡️", title: "Ownership", description: "Files are yours." }
            ]
        },
        logoPremium: {
            label: isUz ? "Logo + Firma Uslubi" : (isRu ? "Лого + Фирменный стиль" : (isZh ? "标志 + 企业形象" : "Logo + Visual Identity")),
            subDescription: isUz ? "Brendingizga mos firma uslubini (Vizual aydentika) ishlab chiqish kiradi." : (isRu ? "Включает разработку фирменного стиля бренда." : (isZh ? "包含企业形象开发。" : "Includes visual identity development.")),
            price: basePricesUSD.logoPremium,
            recommended: true,
            timeline: isUz ? "⏱ 10 ish kuni" : "⏱ 10 business days",
            features: isUz ? ["4 ta logo varianti", "O'ziga xos firma uslubini ishlab chiqish", "3 xil format", "Rasmiy ranglar va shriftlar", "15 ta aloqa nuqtasi", "3 ta tahrirlash"] : ["4 concepts", "Unique style development", "3 formats", "Colors & fonts", "15 touchpoints", "3 revisions"],
            benefits: isUz ? [
                { icon: "🏆", title: "Professional", description: "Barcha joyda bir xil uslub." },
                { icon: "📈", title: "Qiymat", description: "Brend obro'si oshadi." }
            ] : [
                { icon: "🏆", title: "Professional", description: "Consistent style." },
                { icon: "📈", title: "Value", description: "Increase prestige." }
            ]
        },
        logoVIP: {
            label: isUz ? "Logo + Stil + Brandbook" : (isRu ? "Лого + Стиль + Брендбук" : (isZh ? "标志 + 形象 + 品牌手册" : "Logo + Style + Brandbook")),
            price: basePricesUSD.logoVIP,
            timeline: isUz ? "⏱ 15–20 ish kuni" : "⏱ 15–20 business days",
            features: isUz ? [
                "5 ta logo varianti",
                "Strategik tahlil",
                "To'liq Brandbook (30-50 bet)",
                "Logo animatsiyasi (Motion)",
                "Telegram stiker paketi (10 ta)",
                "25 ta aloqa nuqtasi",
                "Mulkchilik sertifikati",
                "Patent topshirish xizmati",
                "30 kunlik cheksiz tahrirlar",
                "Ijtimoiy tarmoqlar uchun dizayn (9 ta shablon)",
                "Vizitka va korporativ blanklar dizayni",
                "Bir yillik brending nazorati (support)",
                "Tashqi reklama dizayni"
            ] : ["5 concepts", "Strategic analysis", "Full Brandbook (30-50 pages)", "Logo animation", "10 stickers", "25 touchpoints", "Ownership cert", "Patent filing", "30 days unlimited revisions", "9 social templates", "Business cards & letterheads", "1-year support", "Outdoor ads design"],
            benefits: isUz ? [
                { icon: "📖", title: "Qo'llanma", description: "Istalgan dizayner to'g'ri ishlatadi." },
                { icon: "💎", title: "Sarmoya", description: "Bir marta to'g'ri investitsiya." }
            ] : [
                { icon: "📖", title: "Guide", description: "Easy execution." },
                { icon: "💎", title: "Investment", description: "One-time smart asset." }
            ]
        },
        packaging: { 
            label: isUz ? "Qadoq dizayni" : (isRu ? "Дизайн упаковки" : (isZh ? "包装设计" : "Packaging Design")), 
            price: basePricesUSD.packaging, 
            timeline: isUz ? "⏱ 10-15 ish kuni" : "⏱ 10-15 business days",
            features: isUz ? ["Vizual konsepsiya", "3D namoyish", "Chop etish fayllari"] : ["Visual concept", "3D Visualization", "Print files"],
            benefits: isUz ? [
                { icon: "🎁", title: "Joziba", description: "Mijoz sotib olgisi keladi." },
                { icon: "🏢", title: "Farqlanish", description: "Javonda ajralib turasiz." }
            ] : [
                { icon: "🎁", title: "Attractive", description: "Sales magnet." },
                { icon: "🏢", title: "Stand Out", description: "Shelf differentiation." }
            ]
        },
        smm: { 
            label: isUz ? "Instagram uchun stil" : (isRu ? "Стиль для Instagram" : (isZh ? "社交媒体风格" : "社交媒体风格")), 
            price: basePricesUSD.smm, 
            timeline: isUz ? "⏱ 5-7 ish kuni" : "⏱ 5-7 business days",
            features: isUz ? ["Bio dizayn", "9 ta post shabloni", "Story tizimi"] : ["Bio design", "9 post templates", "Story system"],
            benefits: isUz ? [
                { icon: "📱", title: "Tartib", description: "Professional sahifa." },
                { icon: "✨", title: "Oson", description: "Post tayyorlash tezlashadi." }
            ] : [
                { icon: "📱", title: "Organized", description: "Trust building." },
                { icon: "✨", title: "Easy", description: "Fast content creation." }
            ]
        },
        urgency: { label: isUz ? "Shoshilinch" : (isRu ? "Срочно" : (isZh ? "加急" : "Urgent")), price: 0 },
        nda: { label: isUz ? "NDA — Maxfiylik" : (isRu ? "NDA — Конфиденциальность" : (isZh ? "NDA — 保密协议" : "NDA — Confidentiality")), price: 0 }
    };
};

export function formatPrice(priceInUSD: number, lang: string = 'uz', currency: 'uzs' | 'usd' = 'usd') {
    if (priceInUSD === 0) {
        if (lang === 'uz') return "Kelishiladi";
        if (lang === 'ru') return "По догов.";
        if (lang === 'zh') return "面议";
        return "Agreed";
    }
    let price = currency === 'uzs' ? Math.round(priceInUSD * USD_TO_UZS_RATE / 100000) * 100000 : priceInUSD;
    let currencyString = currency === 'uzs' ? (lang === 'uz' ? "so'm" : (lang === 'ru' ? "сум" : (lang === 'zh' ? "苏姆" : "sum"))) : "$";
    return `${price.toLocaleString('fr-FR')} ${currencyString}`;
}

export const calculatePackagePrice = (selections: any, lang: string = 'uz'): any => {
    const isUz = lang === 'uz';
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
        const name = isUz ? 'Shoshilinch loyiha (+50%)' : 'Urgent (+50%)';
        surchargesApplied.push({ name, value: val });
    }
    if (selectedServices.nda) {
        const val = basePrice * 0.5;
        surchargesTotal += val;
        const name = isUz ? 'NDA (Maxfiylik) (+50%)' : 'NDA (+50%)';
        surchargesApplied.push({ name, value: val });
    }

    const totalBeforeDiscounts = basePrice + surchargesTotal;
    let finalPrice = totalBeforeDiscounts;
    const discountsApplied = [];

    const normalizedPromo = promoCode?.toUpperCase();
    const isRamazonPromo = normalizedPromo === 'RAMAZON';
    const isSpecialPromo = ['PCG', 'KURSDOSH', 'TEZ NATIJA'].includes(normalizedPromo);
    const isPromoApplied = isRamazonPromo || isSpecialPromo;

    if (isRamazonPromo) {
        const val = totalBeforeDiscounts * 0.30;
        const name = isUz ? 'Ramazon chegirmasi (-30%)' : 'Ramazon discount (-30%)';
        discountsApplied.push({ name, value: val });
        finalPrice -= val;
    } else if (isSpecialPromo) {
        const val = totalBeforeDiscounts * 0.50;
        const name = isUz ? 'Maxsus chegirma (-50%)' : 'Special (-50%)';
        discountsApplied.push({ name, value: val });
        finalPrice -= val;
    } else {
        if (discountType === 'package' && mainServicesCount >= 2) {
            const val = totalBeforeDiscounts * 0.20;
            const name = isUz ? 'Paketli chegirma (-20%)' : 'Package (-20%)';
            discountsApplied.push({ name, value: val });
            finalPrice -= val;
        } else if (discountType === 'full') {
            if (mainServicesCount >= 2) {
                const packageVal = totalBeforeDiscounts * 0.20;
                const packageName = isUz ? 'Paketli chegirma (-20%)' : 'Package (-20%)';
                discountsApplied.push({ name: packageName, value: packageVal });
                finalPrice -= packageVal;
                
                const upfrontVal = finalPrice * 0.10;
                const upfrontName = isUz ? "Oldindan to'lov (-10%)" : "Upfront (-10%)";
                discountsApplied.push({ name: upfrontName, value: upfrontVal });
                finalPrice -= upfrontVal;
            } else {
                const upfrontVal = totalBeforeDiscounts * 0.10;
                const upfrontName = isUz ? "Oldindan to'lov (-10%)" : "Upfront (-10%)";
                discountsApplied.push({ name: upfrontName, value: upfrontVal });
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

export const comparisonData = (lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz') => {
    const isUz = lang === 'uz';
    return [
        { 
            feature: isUz ? "Naming Premium" : "Naming Premium", 
            competitors: { jon: "$980", mano: "$3,150", abba: "$3,000", mountain: "$2,750" } 
        },
        { 
            feature: isUz ? "Logo va firma uslubi" : "Logo & Visual Identity", 
            competitors: { jon: "$1,550", mano: "$6,450", abba: "$6,150", mountain: "$5,600" } 
        },
        { 
            feature: isUz ? "Qadoq dizayni" : "Packaging Design", 
            competitors: { jon: "$1,150", mano: "$9,450", abba: "$6,300", mountain: "$4,700" } 
        },
        { 
            feature: isUz ? "Brend-strategiya va platforma" : "Brand Strategy & Platform", 
            competitors: { jon: "$4,750", mano: "$18,900", abba: null, mountain: false } 
        },
        { 
            feature: isUz ? "100% Mamnuniyat Kafolati" : "100% Satisfaction Guarantee", 
            competitors: { jon: true, mano: false, abba: false, mountain: false } 
        }
    ];
};

export const generateSummary = (selections: any, lang: string = 'uz'): string => {
    const sd = getServiceDetails(lang) as any;
    const items = Object.entries(selections.selectedServices)
        .filter(([_, v]) => v)
        .map(([k]) => sd[k]?.label)
        .filter(Boolean);
    
    let summary = items.join(', ');
    if (selections.promoCode) {
        const label = lang === 'uz' ? 'Promokod' : 'Promo Code';
        summary += ` (${label}: ${selections.promoCode})`;
    }
    return summary;
};
