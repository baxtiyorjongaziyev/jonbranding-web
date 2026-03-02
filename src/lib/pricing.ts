
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
    
    return {
        audit: {
            label: isUz ? "Logo Auditi" : "Logo Audit",
            description: isUz ? "Mavjud logotipni strategik tahlil qilish va tavsiyalar." : "Strategic analysis and recommendations for your existing logo.",
            price: basePricesUSD.audit,
            timeline: isUz ? "⏱ 2-3 ish kuni" : "⏱ 2-3 business days",
            features: isUz ? ["Logoning texnik tahlili", "Bozorga moslik tekshiruvi", "Kamchiliklar ro'yxati", "Yaxshilash bo'yicha tavsiyalar"] : ["Technical analysis", "Market fit check", "List of weaknesses", "Improvement tips"]
        },
        namingCheck: {
            label: isUz ? "Neyming Tekshiruvi" : "Naming Check",
            description: isUz ? "Brend nomini huquqiy va raqamli bazalarda tekshirish." : "Checking brand name availability in legal and digital databases.",
            price: basePricesUSD.namingCheck,
            timeline: isUz ? "⏱ 1-2 ish kuni" : "⏱ 1-2 business days",
            features: isUz ? [
                "O'zbekistondan tekshiruv",
                "Xalqaro bazadan tekshiruv",
                "Internetda ma'lum mashhur nomlar tekshiruvi"
            ] : [
                "Local database check",
                "International database check",
                "Global popular names check"
            ]
        },
        consultation: {
            label: isUz ? "Konsultatsiya" : "Consultation",
            description: isUz ? "Brending va biznesni upakovka qilish bo'yicha professional maslahat." : "Professional advice on branding and business packaging.",
            price: basePricesUSD.consultation,
            timeline: isUz ? "⏱ 60 daqiqa" : "⏱ 60 minutes",
            features: isUz ? ["Muammolarni tahlil qilish", "Brending strategiyasi", "Savollarga javoblar", "Yo'l xaritasi tuzish"] : ["Problem analysis", "Branding strategy", "Q&A session", "Roadmap creation"]
        },
        strategy: {
            label: isUz ? "Brend-strategiya" : "Brand Strategy",
            description: isUz ? "Biznesingiz uchun natija keltiradigan poydevor." : "A foundation that brings results for your business.",
            price: basePricesUSD.strategy,
            timeline: isUz ? "⏱ 20-30 ish kuni" : "⏱ 20-30 business days",
            features: isUz ? [
                "Bozor va raqobat tahlili",
                "Maqsadli auditoriya xaritasi",
                "Brend platformasi",
                "Pozitsiyalash strategiyasi",
                "Noyob Sotuv Taklifi (USP)"
            ] : ["Market & Competitor analysis", "Target audience map", "Brand platform", "Positioning strategy", "USP development"]
        },
        commStrategy: {
            label: isUz ? "Kommunikatsion strategiya" : "Communication Strategy",
            description: isUz ? "Mijozlar bilan muloqot va reklama tili." : "Communication and advertising language for customers.",
            price: basePricesUSD.commStrategy,
            timeline: isUz ? "⏱ 15-20 ish kuni" : "⏱ 15-20 business days",
            features: isUz ? ["Brend ovozi (Tone of Voice)", "Asosiy xabarlar tizimi", "Media kanallar tanlovi", "Kontent rejasi tamoyillari"] : ["Tone of Voice", "Key messaging system", "Media channel selection", "Content plan principles"]
        },
        namingVIP: {
            label: "Naming VIP",
            description: isUz ? "Nom emas — bu biznes uchun real aktiv." : "Not just a name — a real business asset.",
            price: basePricesUSD.namingVIP,
            timeline: isUz ? "⏱ 15 ish kuni" : "⏱ 15 business days",
            features: isUz ? [
                "15 ta nom varianti tayyorlanadi",
                "Har bir nom uchun to'liq strategik izoh",
                "Talaffuz, jarang va esda qolishi tekshiriladi",
                "O'zbekiston va xalqaro bazalarda patent tekshiruvi (WIPO) va patentga topshirib berish xizmati",
                "Domen va Username tekshiruvi",
                "Cheksiz tuzatish (30 kun ichida)",
                "Logoning to'liq mulkchilik huquqi sertifikati"
            ] : [
                "15 name variants",
                "Strategic reasoning for each",
                "Pronunciation and recall check",
                "Local & International patent check (WIPO) + Filing service",
                "Domain & Username check",
                "Unlimited revisions (30 days)",
                "Ownership certificate"
            ]
        },
        namingPremium: {
            label: "Naming Premium",
            description: isUz ? "To'g'ri nom, to'g'ri poydevor." : "Right name, right foundation.",
            price: basePricesUSD.namingPremium,
            recommended: true,
            timeline: isUz ? "⏱ 7 ish kuni" : "⏱ 7 business days",
            results: isUz ? ["10 ta nom varianti", "Har bir nom uchun strategik izoh", "O'zbekiston bazasida patent tekshiruvi", "3 ta tuzatish imkoniyati"] : ["10 variants", "Strategic reasoning", "Local patent check", "3 revisions"]
        },
        namingStandard: {
            label: "Naming Standart",
            description: isUz ? "Tez va sifatli start uchun." : "For a fast and quality start.",
            price: basePricesUSD.namingStandard,
            timeline: isUz ? "⏱ 5 ish kuni" : "⏱ 5 business days",
            results: isUz ? ["5 ta nom varianti", "Ma'nosi va izohi bilan", "Domen tekshiruvi", "2 ta tuzatish imkoniyati"] : ["5 variants", "Meaning & Logic", "Domain check", "2 revisions"]
        },
        logoStandard: {
            label: isUz ? "Unikal Logo" : "Unique Logo",
            subDescription: isUz ? "Endigina boshlamoqchi bo'lganlar uchun" : "For those just starting out",
            description: isUz ? "Faqat logotip va uning asosiy ko'rinishlari." : "Just the logo and its main variations.",
            price: basePricesUSD.logoStandard,
            timeline: isUz ? "⏱ 5 ish kuni" : "⏱ 5 business days",
            features: isUz ? [
                "2 ta logo varianti tayyorlanadi — bittasini tanlaysiz",
                "Har bir variant uchun izoh beriladi",
                "Logo 4 xil ko'rinishda: Yotiq, Tik, Qora-oq va faqat belgisi alohida",
                "Ijtimoiy tarmoqlar uchun profil rasmi",
                "3 xil fayl formati (PNG, SVG, AI)",
                "8 ta aloqa nuqtasida vizual namoyish",
                "2 ta tuzatish imkoniyati"
            ] : [
                "2 concepts - pick one",
                "Strategic reasoning",
                "4 lockups (H, V, B&W, Icon)",
                "Social media profile pics",
                "3 file formats (PNG, SVG, AI)",
                "Visuals on 8 touchpoints",
                "2 revisions"
            ],
            benefits: isUz ? [
                { icon: "🎯", title: "Hujjatlarda ham, ijtimoiy tarmoqlarda ham ishlaydi", description: "Logongiz hamma joyga — sayt, Instagram va chop etishga tayyor." },
                { icon: "✅", title: "\"Bu mening brendim\" deyishingiz mumkin", description: "Professional ko'rinish — o'zingiz yasaganga o'xshamaydigan professional ko'rinish." },
                { icon: "👁️", title: "Real hayotda qanday ko'rinishini bilasiz", description: "8 ta muhim nuqtada logongiz qanday ko'rinishini vizual ko'rasiz." },
                { icon: "🛡️", title: "Fayllar to'liq sizniki", description: "Barcha manba fayllar topshiriladi, keyinchalik foydalanishga qulay." }
            ] : [
                { icon: "🎯", title: "Works everywhere", description: "Ready for web, social and print." },
                { icon: "✅", title: "Professional look", description: "Confidence in your brand image." },
                { icon: "👁️", title: "Real world visuals", description: "See it on 8 key touchpoints." },
                { icon: "🛡️", title: "Full ownership", description: "Source files are yours forever." }
            ]
        },
        logoPremium: {
            label: isUz ? "Logo + Firma uslubi" : "Logo + Visual Identity",
            subDescription: isUz ? "O'sishni rejalashtiraganlar uchun" : "For those planning growth",
            description: isUz ? "To'liq vizual tizim va qoidalar." : "Complete visual system and rules.",
            price: basePricesUSD.logoPremium,
            recommended: true,
            timeline: isUz ? "⏱ 10 ish kuni" : "⏱ 10 business days",
            features: isUz ? [
                "3 ta logo varianti tayyorlanadi — bittasini tanlaysiz",
                "Har bir variant uchun izoh beriladi",
                "Logo 4 xil ko'rinishda: Yotiq, Tik, Qora-oq va faqat belgisi alohida",
                "Ijtimoiy tarmoqlar uchun profil rasmi",
                "3 xil fayl formati (PNG, SVG, AI)",
                "Rasmiy ranglar to'plami va aniq kodlari",
                "Rasmiy brend shrifti va qo'llash qoidalari",
                "15 ta aloqa nuqtasida vizual namoyish",
                "3 ta tuzatish imkoniyati"
            ] : [
                "3 concepts - pick one",
                "Strategic reasoning",
                "4 lockups",
                "Social profile pics",
                "Source files (AI, SVG, PNG)",
                "Official color palette & codes",
                "Official brand fonts",
                "Visuals on 15 touchpoints",
                "3 revisions"
            ],
            benefits: isUz ? [
                { icon: "🏆", title: "Har joyda bir xil, professional ko'rinasiz", description: "Saytingiz, Instagramingiz, vizitchangiz — hammasi bir uslubda." },
                { icon: "💼", title: "Xodimlaringiz ham to'g'ri ishlatadi", description: "Aniq qoidalar bo'lgach, hech kim adashmaydi." },
                { icon: "📸", title: "Mijozlarga ko'rsatishga tayyor", description: "15 ta nuqtada brendingizni vizual ko'rasiz." },
                { icon: "📈", title: "Brend qiymati oshadi", description: "Izchil ko'rinish — professional biznes belgisidir." }
            ] : [
                { icon: "🏆", title: "Consistent look", description: "Website, social and print match." },
                { icon: "💼", title: "Easy for team", description: "Clear rules for everyone." },
                { icon: "📸", title: "Ready for clients", description: "Visuals on 15 touchpoints." },
                { icon: "📈", title: "Brand value up", description: "Consistency is professional." }
            ]
        },
        logoVIP: {
            label: isUz ? "Logo + Stil + Brandbook" : "Logo + Style + Brandbook",
            subDescription: isUz ? "Hamma narsani bir marta to'g'ri qilmoqchilar uchun" : "For those doing it right once",
            description: isUz ? "Brendingizning to'liq 'konstitutsiyasi'." : "Full 'constitution' of your brand.",
            price: basePricesUSD.logoVIP,
            timeline: isUz ? "⏱ 15–20 ish kuni" : "⏱ 15–20 business days",
            features: isUz ? [
                "3 ta logo varianti + har biri uchun chuqur strategik izoh",
                "Logo 4 xil ko'rinishda: Yotiq, Tik, Qora-oq va faqat belgisi alohida",
                "Ijtimoiy tarmoqlar uchun profil rasmi",
                "3 xil fayl formati (PNG, SVG, AI)",
                "Rasmiy ranglar va shriftlar tizimi",
                "To'liq Brandbook (30-50 sahifa)",
                "25 ta aloqa nuqtasida professional vizual",
                "Cheksiz tuzatish (30 kun ichida)",
                "Logoning to'liq mulkchilik huquqi sertifikati"
            ] : [
                "3 concepts + deep strategic reasoning",
                "4 lockups + social pics",
                "Source files + Color/Font systems",
                "Full Brandbook (30-50 pages)",
                "Visuals on 25 touchpoints",
                "Unlimited revisions (30 days)",
                "Full ownership certificate"
            ],
            benefits: isUz ? [
                { icon: "📖", title: "Istalgan odamga berib, to'g'ri natija olasiz", description: "Qo'llanma bilan har qanday dizayner to'g'ri ishlaydi." },
                { icon: "🔒", title: "Brend yillar o'tsa ham buzilmaydi", description: "Brendingiz 10 yildan keyin ham bir xil kuchli ko'rinadi." },
                { icon: "🌍", title: "Xalqaro darajada tayyor ko'rinasiz", description: "Investorlar jiddiy kompaniya ekaningizni bilishadi." },
                { icon: "💎", title: "Bu bir marta qilinadigan investitsiya", description: "To'g'ri qilingan brend kamida 10 yil xizmat qiladi." }
            ] : [
                { icon: "📖", title: "Easy handover", description: "Hand it to any designer." },
                { icon: "🔒", title: "Built to last", description: "Stays strong for 10+ years." },
                { icon: "🌍", title: "Global standard", description: "Investors see a serious company." },
                { icon: "💎", title: "One-time investment", description: "Done correctly for the long term." }
            ]
        },
        packaging: { 
            label: isUz ? "Qadoq dizayni" : "Packaging Design", 
            description: isUz ? "Mahsulotingizning javondagi asosiy quroli." : "Your product's main weapon on the shelf.",
            price: basePricesUSD.packaging, 
            timeline: isUz ? "⏱ 10-15 ish kuni" : "⏱ 10-15 business days",
            features: isUz ? ["Vizual konsepsiya", "Qadoqni 3D namoyish qilish", "Chop etishga tayyor fayllar", "Materiallar bo'yicha tavsiyalar"] : ["Visual concept", "3D presentation", "Print-ready files", "Material recommendations"]
        },
        smm: { 
            label: isUz ? "Instagram uchun stil" : "Social Media Style", 
            description: isUz ? "Sahifangizni tartibli va brendga mos qilish." : "Make your page organized and brand-consistent.",
            price: basePricesUSD.smm, 
            timeline: isUz ? "⏱ 5-7 ish kuni" : "⏱ 5-7 business days",
            features: isUz ? ["Profil rasmi va bio dizayni", "9 ta post uchun shablon", "Storislar uchun dizayn tizimi", "Highlight ikonkalari"] : ["Bio & profile design", "9 post templates", "Stories design system", "Highlight icons"]
        },
        urgency: { label: isUz ? "Shoshilinch loyiha (+50%)" : "Urgent Project (+50%)", price: 0 },
        nda: { label: isUz ? "NDA — Maxfiylik (+50%)" : "NDA — Confidentiality (+50%)", price: 0 }
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

    // Promo codes logic
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
