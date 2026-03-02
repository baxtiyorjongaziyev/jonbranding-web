
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
                isRu ? "Проверка домена и Username (.com, .uz, TG, IG)" : (isEn ? "Domain & Username check" : "Domen va Username tekshiruvi (.com, .uz, TG, IG)"),
                isRu ? "Патентная проверка в Узбекистане и мире" : (isEn ? "Uzbek & International patent check" : "O'zbekiston va xalqaro patent tekshiruvi"),
                isRu ? "Анализ конкурентов и уникальная позиция" : (isEn ? "Competitor analysis" : "Raqobatchilar tahlili va unikal pozitsiya"),
                isRu ? "Лингвистическая проверка для мира" : (isEn ? "Linguistic check" : "Xalqaro bozor uchun tillararo tekshiruv"),
                isRu ? "Эмоциональное значение бренда" : (isEn ? "Emotional meaning" : "Brendning hissiy ma'nosi va ta'siri"),
                isRu ? "3 варианта короткого слогана" : (isEn ? "3 short slogans" : "3 ta qisqa shior varianti tayyorlanadi"),
                isRu ? "Рекомендации по шрифтам и цветам" : (isEn ? "Font & color direction" : "Font va rang yo'nalishi bo'yicha tavsiya"),
                isRu ? "Услуга подачи на патент (Пошлины отдельно)" : (isEn ? "Patent filing service (Fees extra)" : "Patentga topshirib berish xizmati (Davlat bojlari alohida)"),
                isRu ? "Безлимитные правки (30 дней)" : (isEn ? "Unlimited edits (30 days)" : "Cheksiz tuzatish (30 kun ichida)")
            ],
            benefits: [
                { icon: "🌍", title: isRu ? "Готовы к мировому рынку" : "International ready", description: isRu ? "Имя проверено на других языках" : "Name checked in multiple languages" },
                { icon: "🔒", title: isRu ? "Имя полностью ваше" : "Ownership", description: isRu ? "Официальная защита патентом" : "Officially protected by patent" },
                { icon: "💎", title: isRu ? "Ценность для бизнеса" : "Business value", description: isRu ? "Защищенное имя — это реальный актив" : "Protected name is a real asset" },
                { icon: "🎯", title: isRu ? "Правильное решение" : "Right choice", description: isRu ? "Определяем верный путь вместе" : "Defining the right path together" }
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
                isRu ? "Стратегическое обоснование для каждого" : (isEn ? "Strategic logic for each" : "Har bir nom uchun strategik izoh"),
                isRu ? "Проверка произношения и запоминаемости" : (isEn ? "Pronunciation check" : "Talaffuz va esda qolishi tekshiriladi"),
                isRu ? "Проверка домена и Username" : (isEn ? "Domain & Username check" : "Domen va Username tekshiruvi"),
                isRu ? "Патентная проверка в базе Узбекистана" : (isEn ? "Uzbek patent check" : "O'zbekiston bazasida patent tekshiruvi"),
                isRu ? "Анализ названий конкурентов" : (isEn ? "Competitor analysis" : "Raqobatchilarning nomlari tahlili"),
                isRu ? "Описание эмоционального значения" : (isEn ? "Emotional meaning description" : "Nomning hissiy ma'nosi tavsifi"),
                isRu ? "3 раунда правок" : (isEn ? "3 edit rounds" : "3 ta tuzatish raundi")
            ],
            benefits: [
                { icon: "⚖️", title: isRu ? "Правовая безопасность" : "Legal safety", description: isRu ? "Избежите дорогих проблем в будущем" : "Avoid expensive future issues" },
                { icon: "🏆", title: isRu ? "Отличие от конкурентов" : "Stand out", description: isRu ? "Клиенты узнают вас среди других" : "Customers recognize you instantly" },
                { icon: "❤️", title: isRu ? "Любовь клиентов" : "Customer love", description: isRu ? "Эмоции и лояльность в имени" : "Emotions and loyalty in the name" },
                { icon: "📈", title: isRu ? "Сильный старт" : "Strong start", description: isRu ? "Имя, снижающее затраты на маркетинг" : "Name that lowers marketing costs" }
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
                isRu ? "Краткие пояснения к именам" : (isEn ? "Short logic for names" : "Nomlar uchun qisqa izohlar"),
                isRu ? "Проверка легкости произношения" : (isEn ? "Pronunciation check" : "Talaffuz qulayligi tekshiruvi"),
                isRu ? "Проверка домена и Username" : (isEn ? "Domain & Username check" : "Domen va Username tekshiruvi"),
                isRu ? "1 раунд правок" : (isEn ? "1 edit round" : "1 ta tuzatish raundi")
            ],
            benefits: [
                { icon: "🛡️", title: isRu ? "Защита от опасных имен" : "Safety", description: isRu ? "Избежите ущерба от неверного имени" : "Prevent damage from wrong name" },
                { icon: "⚡", title: isRu ? "Экономия времени" : "Save time", description: isRu ? "Быстрое получение проверенного имени" : "Get a checked name quickly" },
                { icon: "✅", title: isRu ? "Уверенный старт" : "Start with confidence", description: isRu ? "Начните работу без лишних забот" : "Start work without worries" },
                { icon: "📱", title: "Digital ready", description: isRu ? "Никаких проблем с доменом" : "No domain or username issues" }
            ]
        },
        logoVIP: {
            label: isRu ? "Лого + Фирменный стиль + Брендбук" : (isEn ? "Logo + Identity + Brandbook" : "Logo + Firma uslubi + Brandbook"),
            description: isRu ? "Для тех, кто хочет сделать все правильно с первого раза" : (isEn ? "For those who want everything right from the start" : "Hamma narsani bir marta to'g'ri qilmoqchilar uchun"),
            subDescription: isRu ? "Полная конституция бренда" : (isEn ? "Full brand constitution" : "To'liq brend konstitutsiyasi"),
            price: basePricesUSD.logoVIP,
            timeline: isRu ? "⏱ 15–20 рабочих дней" : (isEn ? "15-20 business days" : "⏱ 15–20 ish kuni"),
            features: [
                isRu ? "3 варианта логотипа + глубокое обоснование" : (isEn ? "3 logo variants + deep logic" : "3 ta logo varianti tayyorlanadi + har biri uchun chuqur strategik izoh beriladi"),
                isRu ? "Обоснование дизайна для каждого варианта" : (isEn ? "Design logic for each variant" : "Har bir variant uchun izoh beriladi — nima uchun aynan shunday dizayn qilindi"),
                isRu ? "4 вида логотипа (горизонтальный, вертикальный, Ч/Б, знак)" : (isEn ? "4 logo versions (Horiz, Vert, B&W, Mark)" : "Logo 4 xil ko'rinishda beriladi: gorizontal, vertikal, qora-oq versiyasi, belgi alohida"),
                isRu ? "Профильное фото для соцсетей (IG, TG)" : (isEn ? "Social profile images" : "Ijtimoiy tarmoqlar uchun profil rasmi (Instagram, Telegram)"),
                isRu ? "Файлы в форматах: PNG, SVG, AI" : (isEn ? "Formats: PNG, SVG, AI" : "3 xil fayl formatida topshiriladi: PNG, SVG, AI"),
                isRu ? "Официальная палитра цветов (3–5 цветов с кодами)" : (isEn ? "Official color palette" : "Rasmiy ranglar to'plami — brendingizning 3–5 ta rasmiy rangi va ularning aniq kodi"),
                isRu ? "Официальный шрифт" : (isEn ? "Official brand font" : "Rasmiy shrift — brendingizda ishlatiladigan harflar uslubi"),
                isRu ? "Брендбук — полное руководство по использованию" : (isEn ? "Full Brandbook guide" : "Brandbook — brendingizni qanday ishlatish kerakligi yozilgan to'liq qo'llanma"),
                isRu ? "25 точек контакта — аудит и визуализация" : (isEn ? "25 touchpoints visualization" : "25 ta aloqa nuqtasi — to'liq audit va har bir nuqta uchun professional vizuallar"),
                isRu ? "Безлимитные правки (30 дней)" : (isEn ? "Unlimited edits (30 days)" : "Cheksiz tuzatish (30 kun ichida)"),
                isRu ? "Сертификат на полное владение логотипом" : (isEn ? "Full ownership certificate" : "Logoning to'liq mulkchilik huquqi sertifikati")
            ],
            benefits: [
                { icon: "📖", title: isRu ? "Любой человек поймет, как работать" : "Anyone can use it", description: isRu ? "Дизайнер или SMM поймут все из гайда" : "Designers or SMM will follow the rules" },
                { icon: "🔒", title: isRu ? "Бренд не испортится со временем" : "Brand durability", description: isRu ? "Все правила прописаны — никто не изменит" : "Rules are fixed — no one can break them" },
                { icon: "🌍", title: isRu ? "Готовы к международному уровню" : "International level", description: isRu ? "Инвестор увидит серьезную компанию" : "Investors will see a serious company" },
                { icon: "💎", title: isRu ? "Инвестиция на 10 лет" : "One-time investment", description: isRu ? "Один раз и надолго — вместо ежегодных переделок" : "Do it right once instead of redoing every year" }
            ]
        },
        logoPremium: {
            label: isRu ? "Лого + Фирменный стиль" : (isEn ? "Logo + Corporate Identity" : "Logo + Firma uslubi"),
            description: isRu ? "Для тех, кто планирует рост" : (isEn ? "For those planning growth" : "O'sishni rejalashtiraganlar uchun"),
            subDescription: isRu ? "Визуальная система и узнаваемость" : (isEn ? "Visual system & recognition" : "Vizual tizim va tanilish"),
            price: basePricesUSD.logoPremium,
            recommended: true,
            timeline: isRu ? "⏱ 10 рабочих дней" : (isEn ? "10 business days" : "⏱ 10 ish kuni"),
            features: [
                isRu ? "3 варианта логотипа — выбор одного" : (isEn ? "3 logo variants — pick one" : "3 ta logo varianti tayyorlanadi — uchtalasidan birini tanlaysiz"),
                isRu ? "Обоснование дизайна для каждого варианта" : (isEn ? "Design logic for each variant" : "Har bir variant uchun izoh beriladi — nima uchun aynan shunday dizayn qilindi"),
                isRu ? "4 вида логотипа (горизонтальный, вертикальный, Ч/Б, знак)" : (isEn ? "4 logo versions (Horiz, Vert, B&W, Mark)" : "Logo 4 xil ko'rinishda beriladi: gorizontal, vertikal, qora-oq versiyasi, belgi alohida"),
                isRu ? "Профильное фото для соцсетей (IG, TG)" : (isEn ? "Social profile images" : "Ijtimoiy tarmoqlar uchun profil rasmi (Instagram, Telegram)"),
                isRu ? "Файлы в форматах: PNG, SVG, AI" : (isEn ? "Formats: PNG, SVG, AI" : "3 xil fayl formatida topshiriladi: PNG, SVG, AI"),
                isRu ? "Официальная палитра цветов (3–5 цветов с кодами)" : (isEn ? "Official color palette" : "Rasmiy ranglar to'plami — brendingizning 3–5 ta rasmiy rangi va kodlari"),
                isRu ? "Официальный шрифт" : (isEn ? "Official brand font" : "Rasmiy shrift — brendingizda ishlatiladigan harflar uslubi"),
                isRu ? "15 точек контакта — визуализация в реальной жизни" : (isEn ? "15 touchpoints visualization" : "15 ta aloqa nuqtasi — biznesingizni o'rganib, har birida logongiz qanday ko'rinishini vizual ko'rsatamiz"),
                isRu ? "3 раунда правок" : (isEn ? "3 edit rounds" : "3 ta tuzatish imkoniyati")
            ],
            benefits: [
                { icon: "🏆", title: isRu ? "Везде профессионально и одинаково" : "Consistent look", description: isRu ? "Сайт, IG, визитка — все в одном стиле" : "Site, IG, business card — all one style" },
                { icon: "💼", title: isRu ? "Сотрудники не ошибутся" : "Team alignment", description: isRu ? "Четкие цвета и шрифты — никто не запутается" : "Clear colors & fonts — no confusion" },
                { icon: "📸", title: isRu ? "Готовы к показу клиентам" : "Ready for clients", description: isRu ? "Визуалы в 15 точках контакта перед глазами" : "See your brand in 15 real situations" },
                { icon: "📈", title: isRu ? "Стоимость бренда растет" : "Brand value growth", description: isRu ? "Профессиональный вид вызывает больше доверия" : "Professional look builds more trust" }
            ]
        },
        logoStandard: {
            label: isRu ? "Уникальный Логотип" : (isEn ? "Unique Logo" : "Unikal Logo"),
            description: isRu ? "Для качественного старта" : (isEn ? "For a quality start" : "Endigina boshlamoqchi bo'lganlar uchun"),
            subDescription: isRu ? "Для начинающих" : (isEn ? "For beginners" : "Sifatli start uchun"),
            price: basePricesUSD.logoStandard,
            timeline: isRu ? "⏱ 5 рабочих дней" : (isEn ? "5 business days" : "⏱ 5 ish kuni"),
            features: [
                isRu ? "2 варианта логотипа — выбор одного" : (isEn ? "2 logo variants — pick one" : "2 ta logo varianti tayyorlanadi — ikkalasidan birini tanlaysiz"),
                isRu ? "Обоснование дизайна для каждого варианта" : (isEn ? "Design logic for each variant" : "Har bir variant uchun izoh beriladi — nima uchun aynan shunday dizayn qilindi"),
                isRu ? "4 вида логотипа (горизонтальный, вертикальный, Ч/Б, знак)" : (isEn ? "4 logo versions (Horiz, Vert, B&W, Mark)" : "Logo 4 xil ko'rinishda beriladi: gorizontal, vertikal, qora-oq va belgi alohida"),
                isRu ? "Профильное фото для соцсетей (IG, TG)" : (isEn ? "Social profile images" : "Ijtimoiy tarmoqlar uchun profil rasmi (Instagram, Telegram)"),
                isRu ? "Файлы в форматах: PNG, SVG, AI" : (isEn ? "Formats: PNG, SVG, AI" : "3 xil fayl formatida topshiriladi: PNG, SVG, AI"),
                isRu ? "8 точек контакта — визуализация логотипа" : (isEn ? "8 touchpoints visualization" : "8 ta aloqa nuqtasi — logongiz muhim joylarda qanday ko'rinishini vizual ko'rsatib beriladi"),
                isRu ? "2 раунда правок" : (isEn ? "2 edit rounds" : "2 ta tuzatish imkoniyati")
            ],
            benefits: [
                { icon: "🎯", title: isRu ? "Работает везде" : "Works everywhere", description: isRu ? "Лого готов для сайта, IG и печати" : "Logo ready for site, IG, and print" },
                { icon: "✅", title: isRu ? "Это настоящий бренд" : "Real brand", description: isRu ? "Не самоделка, а профи вид с первого дня" : "Not DIY, professional from day one" },
                { icon: "👁️", title: isRu ? "Увидите результат заранее" : "See real results", description: isRu ? "8 визуализаций логотипа в реальности" : "8 visualizations of logo in real life" },
                { icon: "🛡️", title: isRu ? "Файлы полностью ваши" : "Full ownership", description: isRu ? "Передаем все исходники для работы" : "All source files handed over to you" }
            ]
        },
        packaging: {
            label: isRu ? "Дизайн упаковки" : (isEn ? "Packaging Design" : "Qadoq dizayni"),
            description: isRu ? "Разработка профессиональной упаковки для 3 SKU." : (isEn ? "Professional packaging design for 3 SKUs." : "3 SKU uchun professional qadoq ishlab chiqish."),
            price: basePricesUSD.packaging,
            features: isRu ? ["Анализ рынка", "2 концепции дизайна", "Файлы для печати"] : (isEn ? ["Market analysis", "2 design concepts", "Print-ready files"] : ["Bozor tahlili", "2 ta dizayn konsepsiyasi", "Chopga tayyor fayllar"]),
            timeline: isRu ? "10-15 рабочих дней" : (isEn ? "10-15 business days" : "10-15 ish kuni")
        },
        smm: {
            label: isRu ? "Стиль для соцсетей" : (isEn ? "Social media style" : "Ijtimoiy tarmoqlar uchun stil"),
            description: isRu ? "Система оформления постов и сторис." : (isEn ? "Post and stories design system." : "Postlar va storislarni bezash tizimi."),
            price: basePricesUSD.smm,
            features: isRu ? ["6 шаблонов постов", "6 шаблонов сторис", "Highlight cover-ы"] : (isEn ? ["6 post templates", "6 stories templates", "Highlight covers"] : ["6 ta post shabloni", "6 ta stories shabloni", "Highlight coverlar"]),
            timeline: isRu ? "5-7 рабочих дней" : (isEn ? "5-7 business days" : "5-7 ish kuni")
        },
        urgency: {
            label: isRu ? "Срочный проект (+50%)" : (isEn ? "Urgent project (+50%)" : "Shoshilinch loyiha (+50%)"),
            description: isRu ? "Выполнение в 2 раза быстрее." : (isEn ? "2x faster delivery." : "2 barobar tezroq bitirib berish."),
            price: 0,
            timeline: isRu ? "Срок сокращается на 50%" : (isEn ? "Timeline reduced by 50%" : "Muddat 50% qisqaradi")
        },
        nda: {
            label: isRu ? "NDA — Конфиденциальность (+50%)" : (isEn ? "NDA — Privacy (+50%)" : "NDA — Maxfiylik (+50%)"),
            description: isRu ? "Без публикации в портфолио." : (isEn ? "No portfolio publication." : "Loyiha natijalarini portfolioga qo'shmaslik."),
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
            name: lang === 'uz' ? 'Shoshilinch loyiha (+50%)' : (lang === 'ru' ? 'Срочный проект (+50%)' : 'Urgent project (+50%)'), 
            value: val 
        });
    }
    if (selectedServices.nda) {
        const val = basePrice * 0.5;
        surchargesTotal += val;
        surchargesApplied.push({ 
            name: lang === 'uz' ? 'NDA (Maxfiylik) (+50%)' : (lang === 'ru' ? 'NDA (Конфиденциальность) (+50%)' : 'NDA (+50%)'), 
            value: val 
        });
    }

    const totalBeforeDiscounts = basePrice + surchargesTotal;
    let finalPrice = totalBeforeDiscounts;
    const discountsApplied = [];

    const isRamadanPromo = promoCode?.toUpperCase() === 'RAMAZON';

    if (isRamadanPromo) {
        const val = totalBeforeDiscounts * 0.50;
        discountsApplied.push({ name: lang === 'uz' ? 'Ramazon tuhfasi (-50%)' : (lang === 'ru' ? 'Подарок Рамазана (-50%)' : 'Ramadan Gift (-50%)'), value: val });
        finalPrice -= val;
    } else {
        if (discountType === 'package' && mainServicesCount >= 2) {
            const val = totalBeforeDiscounts * 0.20;
            discountsApplied.push({ name: lang === 'uz' ? 'Paketli chegirma (-20%)' : (lang === 'ru' ? 'Пакетная скидка (-20%)' : 'Package discount (-20%)'), value: val });
            finalPrice -= val;
        } else if (discountType === 'full') {
            if (mainServicesCount >= 2) {
                const packageVal = totalBeforeDiscounts * 0.20;
                discountsApplied.push({ name: lang === 'uz' ? 'Paketli chegirma (-20%)' : (lang === 'ru' ? 'Пакетная скидка (-20%)' : 'Package discount (-20%)'), value: packageVal });
                finalPrice -= packageVal;
                
                const upfrontVal = finalPrice * 0.10;
                discountsApplied.push({ name: lang === 'uz' ? "Oldindan to'lov (-10%)" : (lang === 'ru' ? "Предоплата (-10%)" : "Upfront payment (-10%)"), value: upfrontVal });
                finalPrice -= upfrontVal;
            } else {
                const upfrontVal = totalBeforeDiscounts * 0.10;
                discountsApplied.push({ name: lang === 'uz' ? "Oldindan to'lov (-10%)" : (lang === 'ru' ? "Предоплата (-10%)" : "Upfront payment (-10%)"), value: upfrontVal });
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
