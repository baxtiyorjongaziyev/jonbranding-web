
'use client';

/**
 * @fileOverview Narxlar va xizmatlar bazasi.
 * Includes VIP tariffs, RAMAZON/PCG/KURSDOSH promos, and 50% surcharges.
 */

const USD_TO_UZS_RATE = 12700;

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
            features: isRu ? ["Анализ сильных и слабых сторон", "Сравнение с конкурентами", "План улучшений"] : (isEn ? ["SWOT analysis", "Competitor comparison", "Improvement plan"] : ["Kuchli va zaif tomonlar tahlili", "Raqobatchilar bilan solishtirish", "Yaxshilash rejasini tuzish"]),
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
            description: isRu ? "Не просто имя — актив" : (isEn ? "Not just a name — an asset" : "Nom emas — aktiv"),
            subDescription: isRu ? "Для тех, кто серьезно инвестирует" : (isEn ? "For serious investors" : "Jiddiy investitsiya qiladiganlar uchun"),
            price: basePricesUSD.namingVIP,
            timeline: isRu ? "15 рабочих дней" : (isEn ? "15 business days" : "15 ish kuni"),
            features: [
                isRu ? "15 вариантов названий" : (isEn ? "15 name variants" : "15 ta nom varianti tayyorlanadi"),
                isRu ? "Полное обоснование для каждого имени" : (isEn ? "Full logic for each name" : "Har bir nom uchun to'liq izoh beriladi"),
                isRu ? "Проверка произношения и звучания" : (isEn ? "Pronunciation & phonetics check" : "Talaffuz, jarang va esda qolishi tekshiriladi"),
                isRu ? "Проверка домена и Username" : (isEn ? "Domain & Username check" : "Domen va Username tekshiruvi"),
                isRu ? "Патентная проверка в Узбекистане и мире" : (isEn ? "Patent check (UZ & World)" : "Patentga topshirib berish xizmati (Davlat bojlari alohida)"),
                isRu ? "Анализ конкурентов" : (isEn ? "Competitor analysis" : "Raqobatchilar tahlili va unikal pozitsiya"),
                isRu ? "Безлимитные правки (30 дней)" : (isEn ? "Unlimited edits (30 days)" : "Cheksiz tuzatish (30 kun ichida)")
            ],
            benefits: [
                { icon: "🌍", title: isRu ? "Готовы к мировому рынку" : "International ready", description: isRu ? "Имя проверено на других языках" : "Nom xalqaro bozorga mos ravishda tekshirilgan" },
                { icon: "🔒", title: isRu ? "Имя полностью ваше" : "Ownership", description: isRu ? "Официальная защита патентом" : "Rasmiy patent himoyasi bilan ta'minlanadi" },
                { icon: "💎", title: isRu ? "Ценность для бизнеса" : "Business value", description: isRu ? "Защищенное имя — это реальный актив" : "Himoyalangan nom biznes uchun real aktivdir" },
                { icon: "🎯", title: isRu ? "Правильное решение" : "Right choice", description: isRu ? "Определяем верный путь вместе" : "Biznesingiz uchun eng to'g'ri yo'lni tanlaymiz" }
            ]
        },
        namingPremium: {
            label: "Naming Premium",
            description: isRu ? "Верное имя, верная основа" : (isEn ? "Right name, right foundation" : "To'g'ri nom, to'g'ri asos"),
            subDescription: isRu ? "Для тех, кто планирует рост" : (isEn ? "For those planning growth" : "O'sishni rejalashtiraganlar uchun"),
            price: basePricesUSD.namingPremium,
            recommended: true,
            timeline: isRu ? "7 рабочих дней" : (isEn ? "7 business days" : "7 ish kuni"),
            features: [
                isRu ? "10 вариантов названий" : (isEn ? "10 name variants" : "10 ta nom varianti tayyorlanadi"),
                isRu ? "Стратегическое обоснование" : (isEn ? "Strategic logic" : "Har bir nom uchun strategik izoh"),
                isRu ? "Проверка произношения" : (isEn ? "Pronunciation check" : "Talaffuz va esda qolishi tekshiriladi"),
                isRu ? "Патентная проверка (Узбекистан)" : (isEn ? "Uzbek patent check" : "O'zbekiston bazasida patent tekshiruvi"),
                isRu ? "3 раунда правок" : (isEn ? "3 edit rounds" : "3 ta tuzatish raundi")
            ],
            benefits: [
                { icon: "⚖️", title: isRu ? "Правовая безопасность" : "Legal safety", description: isRu ? "Избежите дорогих проблем" : "Kelajakdagi qimmat muammolardan saqlanasiz" },
                { icon: "🏆", title: isRu ? "Отличие от конкурентов" : "Stand out", description: isRu ? "Клиенты узнают вас" : "Mijozlar sizni boshqalardan darhol taniydi" },
                { icon: "❤️", title: isRu ? "Любовь клиентов" : "Customer love", description: isRu ? "Эмоции и лояльность" : "Nomda hissiyot va sadoqat mujassam bo'ladi" },
                { icon: "📈", title: isRu ? "Сильный старт" : "Strong start", description: isRu ? "Имя, снижающее затраты" : "Marketing xarajatlarini kamaytiradigan nom" }
            ]
        },
        namingStandard: {
            label: "Naming Standart",
            description: isRu ? "Быстрый и надежный старт" : (isEn ? "Fast and reliable start" : "Tez va ishonchli start"),
            subDescription: isRu ? "Для начинающих" : (isEn ? "For beginners" : "Endigina boshlamoqchi bo'lganlar uchun"),
            price: basePricesUSD.namingStandard,
            timeline: isRu ? "5 рабочих дней" : (isEn ? "5 business days" : "5 ish kuni"),
            features: [
                isRu ? "5 вариантов названий" : (isEn ? "5 name variants" : "5 ta nom varianti tayyorlanadi"),
                isRu ? "Краткие пояснения" : (isEn ? "Short logic" : "Nomlar uchun qisqa izohlar"),
                isRu ? "Проверка произношения" : (isEn ? "Pronunciation check" : "Talaffuz qulayligi tekshiruvi"),
                isRu ? "Проверка домена" : (isEn ? "Domain check" : "Domen va Username tekshiruvi"),
                isRu ? "1 раунд правок" : (isEn ? "1 edit round" : "1 ta tuzatish raundi")
            ],
            benefits: [
                { icon: "🛡️", title: isRu ? "Защита от ошибок" : "Safety", description: isRu ? "Избежите неверного имени" : "Noto'g'ri nom tanlash xavfidan saqlanasiz" },
                { icon: "⚡", title: isRu ? "Экономия времени" : "Save time", description: isRu ? "Быстрое получение имени" : "Tekshirilgan nomga tezkor ega bo'lasiz" },
                { icon: "✅", title: isRu ? "Уверенный старт" : "Start with confidence", description: isRu ? "Начните без забот" : "Ishni ortiqcha xavotirsiz boshlaysiz" },
                { icon: "📱", title: "Digital ready", description: isRu ? "Никаких проблем с доменом" : "Domen va loginlar bilan muammo bo'lmaydi" }
            ]
        },
        logoVIP: {
            label: isRu ? "Logo + Фирменный стиль + Брендбук" : (isEn ? "Logo + Identity + Brandbook" : "Logo + Firma uslubi + Brandbook"),
            description: isRu ? "Для тех, кто хочет все правильно" : (isEn ? "For those who want it right" : "Hamma narsani bir marta to'g'ri qilmoqchilar uchun"),
            subDescription: isRu ? "Полная конституция бренда" : (isEn ? "Full brand constitution" : "To'liq brend konstitutsiyasi"),
            price: basePricesUSD.logoVIP,
            timeline: isRu ? "15–20 рабочих дней" : (isEn ? "15-20 business days" : "15–20 ish kuni"),
            features: [
                isRu ? "3 варианта логотипа + стратегия" : (isEn ? "3 logo variants + strategy" : "3 ta logo varianti + chuqur strategik izoh"),
                isRu ? "4 вида логотипа" : (isEn ? "4 logo versions" : "Logo 4 xil ko'rinishda (Horiz, Vert, B&W, Mark)"),
                isRu ? "Профильное фото (IG, TG)" : (isEn ? "Social profile images" : "Ijtimoiy tarmoqlar uchun profil rasmi"),
                isRu ? "Файлы: PNG, SVG, AI" : (isEn ? "Formats: PNG, SVG, AI" : "3 xil fayl formatida topshiriladi (AI, SVG, PNG)"),
                isRu ? "Цвета и Шрифты" : (isEn ? "Colors & Fonts" : "Rasmiy ranglar to'plami va rasmiy shrift"),
                isRu ? "Брендбук" : (isEn ? "Full Brandbook" : "Brandbook — to'liq foydalanish qo'llanmasi"),
                isRu ? "25 точек контакта" : (isEn ? "25 touchpoints" : "25 ta aloqa nuqtasi — professional vizuallar"),
                isRu ? "Сертификат владения" : (isEn ? "Ownership certificate" : "Logoning to'liq mulkchilik huquqi sertifikati")
            ],
            benefits: [
                { icon: "📖", title: "Qo'llanmaga muvofiq natija", description: "Dizayner yoki SMM mutaxassisi qo'llanma orqali brendni to'g'ri ishlatadi." },
                { icon: "🔒", title: "Brend sifati buzilmaydi", description: "Barcha qoidalar yozilgan, hech kim o'zicha o'zgartira olmaydi." },
                { icon: "🌍", title: "Xalqaro daraja", description: "Investor yoki sheriklar jiddiy kompaniya ekanligingizni his qiladi." },
                { icon: "💎", title: "Bir martalik investitsiya", description: "To'g'ri qilingan brend 10 yil ishlaydi, har yili qayta dizaynga hojat qolmaydi." }
            ]
        },
        logoPremium: {
            label: isRu ? "Лого + Фирменный стиль" : (isEn ? "Logo + Identity" : "Logo + Firma uslubi"),
            description: isRu ? "Для тех, кто планирует рост" : (isEn ? "For those planning growth" : "O'sishni rejalashtiraganlar uchun"),
            subDescription: isRu ? "Визуальная система" : (isEn ? "Visual system" : "Vizual tizim va tanilish"),
            price: basePricesUSD.logoPremium,
            recommended: true,
            timeline: isRu ? "10 рабочих дней" : (isEn ? "10 business days" : "10 ish kuni"),
            features: [
                isRu ? "3 варианта логотипа" : (isEn ? "3 logo variants" : "3 ta logo varianti tayyorlanadi"),
                isRu ? "4 вида логотипа" : (isEn ? "4 logo versions" : "Logo 4 xil ko'rinishda (Horiz, Vert, B&W, Mark)"),
                isRu ? "Файлы: PNG, SVG, AI" : (isEn ? "Formats: PNG, SVG, AI" : "3 xil fayl formatida topshiriladi (AI, SVG, PNG)"),
                isRu ? "Цвета и Шрифты" : (isEn ? "Colors & Fonts" : "Rasmiy ranglar to'plami va rasmiy shrift"),
                isRu ? "15 точек контакта" : (isEn ? "15 touchpoints" : "15 ta aloqa nuqtasi — vizual namoyish"),
                isRu ? "3 раунда правок" : (isEn ? "3 edit rounds" : "3 ta tuzatish imkoniyati")
            ],
            benefits: [
                { icon: "🏆", title: "Professional ko'rinish", description: "Saytingiz va ijtimoiy tarmoqlaringiz bir xil uslubda, professional bo'ladi." },
                { icon: "💼", title: "Xodimlar adashmaydi", description: "Aniq qoidalar bor joyda hech kim rang yoki shrift tanlashda adashmaydi." },
                { icon: "📸", title: "Mijozlarga ko'rsatishga tayyor", description: "15 ta nuqtada brendingiz qanday ko'rinishini oldindan bilasiz." },
                { icon: "📈", title: "Brend qiymati oshadi", description: "Professional ko'rinish mijozlarda ko'proq ishonch uyg'otadi." }
            ]
        },
        logoStandard: {
            label: isRu ? "Уникальный Логотип" : (isEn ? "Unique Logo" : "Unikal Logo"),
            description: isRu ? "Для качественного старта" : (isEn ? "For a quality start" : "Endigina boshlamoqchi bo'lganlar uchun"),
            subDescription: isRu ? "Для начинающих" : (isEn ? "For beginners" : "Sifatli start uchun"),
            price: basePricesUSD.logoStandard,
            timeline: isRu ? "5 рабочих дней" : (isEn ? "5 business days" : "5 ish kuni"),
            features: [
                isRu ? "2 варианта логотипа" : (isEn ? "2 logo variants" : "2 ta logo varianti tayyorlanadi"),
                isRu ? "4 вида логотипа" : (isEn ? "4 logo versions" : "Logo 4 xil ko'rinishda (Horiz, Vert, B&W, Mark)"),
                isRu ? "Файлы: PNG, SVG, AI" : (isEn ? "Formats: PNG, SVG, AI" : "3 xil fayl formatida topshiriladi (AI, SVG, PNG)"),
                isRu ? "8 точек контакта" : (isEn ? "8 touchpoints" : "8 ta aloqa nuqtasi — logoning vizual ko'rinishi"),
                isRu ? "2 раунда правок" : (isEn ? "2 edit rounds" : "2 ta tuzatish imkoniyati")
            ],
            benefits: [
                { icon: "🎯", title: "Tayyor yechim", description: "Logongiz hamma joyga — sayt, Instagram va chop etishga tayyor bo'ladi." },
                { icon: "✅", title: "Haqiqiy brend hissi", description: "O'zingiz yasaganga o'xshamaydigan professional ko'rinish." },
                { icon: "👁️", title: "Oldindan ko'ra olasiz", description: "8 ta muhim nuqtada logongiz qanday ko'rinishini vizual ko'rasiz." },
                { icon: "🛡️", title: "Fayllar to'liq sizniki", description: "Barcha manba fayllar topshiriladi, keyinchalik foydalanishga qulay." }
            ]
        },
        packaging: {
            label: isRu ? "Дизайн упаковки" : (isEn ? "Packaging Design" : "Qadoq dizayni"),
            description: isRu ? "Профессиональная упаковка." : (isEn ? "Professional packaging." : "Professional qadoq dizayni."),
            price: basePricesUSD.packaging,
            features: isRu ? ["Анализ рынка", "2 концепции", "Файлы для печати"] : (isEn ? ["Market analysis", "2 concepts", "Print-ready files"] : ["Bozor tahlili", "2 ta dizayn konsepsiyasi", "Chopga tayyor fayllar"]),
            timeline: isRu ? "10-15 рабочих дней" : (isEn ? "10-15 business days" : "10-15 ish kuni")
        },
        smm: {
            label: isRu ? "Стиль для соцсетей" : (isEn ? "Social media style" : "Ijtimoiy tarmoqlar uchun stil"),
            description: isRu ? "Система оформления." : (isEn ? "Design system." : "Post va storis bezash tizimi."),
            price: basePricesUSD.smm,
            features: isRu ? ["6 шаблонов постов", "6 шаблонов сторис"] : (isEn ? ["6 post templates", "6 stories templates"] : ["6 ta post shabloni", "6 ta stories shabloni"]),
            timeline: isRu ? "5-7 рабочих дней" : (isEn ? "5-7 business days" : "5-7 ish kuni")
        },
        urgency: {
            label: isRu ? "Срочный проект (+50%)" : (isEn ? "Urgent project (+50%)" : "Shoshilinch loyiha (+50%)"),
            description: isRu ? "В 2 раза быстрее." : (isEn ? "2x faster." : "2 barobar tezroq bitirib berish."),
            price: 0,
            timeline: isRu ? "Срок сокращается на 50%" : (isEn ? "Timeline reduced by 50%" : "Muddat 50% qisqaradi")
        },
        nda: {
            label: isRu ? "NDA — Конфиденциальность (+50%)" : (isEn ? "NDA (+50%)" : "NDA — Maxfiylik (+50%)"),
            description: isRu ? "Без публикации." : (isEn ? "No publication." : "Portfolioga qo'shmaslik."),
            price: 0,
            timeline: isRu ? "На время проекта" : (isEn ? "Project duration" : "Loyiha davomida")
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
        surchargesApplied.push({ name: lang === 'uz' ? 'Shoshilinch loyiha (+50%)' : 'Urgent project (+50%)', value: val });
    }
    if (selectedServices.nda) {
        const val = basePrice * 0.5;
        surchargesTotal += val;
        surchargesApplied.push({ name: lang === 'uz' ? 'NDA (Maxfiylik) (+50%)' : 'NDA (+50%)', value: val });
    }

    const totalBeforeDiscounts = basePrice + surchargesTotal;
    let finalPrice = totalBeforeDiscounts;
    const discountsApplied = [];

    const isPromoApplied = ['RAMAZON', 'PCG', 'KURSDOSH', 'TEZ NATIJA'].includes(promoCode?.toUpperCase());

    if (isPromoApplied) {
        const val = totalBeforeDiscounts * 0.50;
        discountsApplied.push({ name: lang === 'uz' ? 'Maxsus chegirma (-50%)' : 'Special promo (-50%)', value: val });
        finalPrice -= val;
    } else {
        if (discountType === 'package' && mainServicesCount >= 2) {
            const val = totalBeforeDiscounts * 0.20;
            discountsApplied.push({ name: lang === 'uz' ? 'Paketli chegirma (-20%)' : 'Package discount (-20%)', value: val });
            finalPrice -= val;
        } else if (discountType === 'full') {
            if (mainServicesCount >= 2) {
                const packageVal = totalBeforeDiscounts * 0.20;
                discountsApplied.push({ name: lang === 'uz' ? 'Paketli chegirma (-20%)' : 'Package discount (-20%)', value: packageVal });
                finalPrice -= packageVal;
                const upfrontVal = finalPrice * 0.10;
                discountsApplied.push({ name: lang === 'uz' ? "Oldindan to'lov (-10%)" : "Upfront payment (-10%)", value: upfrontVal });
                finalPrice -= upfrontVal;
            } else {
                const upfrontVal = totalBeforeDiscounts * 0.10;
                discountsApplied.push({ name: lang === 'uz' ? "Oldindan to'lov (-10%)" : "Upfront payment (-10%)", value: upfrontVal });
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
