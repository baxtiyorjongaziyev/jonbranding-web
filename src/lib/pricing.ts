const USD_TO_UZS_RATE = 12700;

const convertToUzs = (usd: number) => {
    if (usd === 0) return 0;
    // Round to nearest 100,000 UZS for cleaner pricing
    return Math.round(usd * USD_TO_UZS_RATE / 100000) * 100000;
}

const uzServiceDetails = {
    audit: { label: "Logo Auditi", description: "Mavjud logotipni tahlil qilish va yaxshilash bo'yicha tavsiyalar.", price: convertToUzs(100), timeline: "2-3 kun", note: null, features: ["Logotipning kuchli va zaif tomonlari", "Raqobatchilarga nisbatan tahlil", "Yaxshilash bo'yicha aniq tavsiyalar"] },
    namingCheck: { label: "Neyming Tekshiruvi", description: "Brend nomining O'zbekiston va xalqaro bazalarda bo'shligini tekshirish.", price: convertToUzs(120), timeline: "1-2 kun", note: null, features: ["O'zbekiston bazasi bo'yicha tekshiruv", "Xalqaro WIPO bazasi bo'yicha tekshiruv", "Domen bo'shligini tekshirish", "Huquqiy maslahat"] },
    consultation: { label: "1 soatlik konsultatsiya", description: "Brending bo'yicha har qanday savolingizga tezkor yo'l-yo'riq va professional maslahat.", price: convertToUzs(80), timeline: "1 soat", note: null, features: ["Biznes-muammolarni aniqlash", "Brending bo'yicha savollarga javob", "Keyingi qadamlar bo'yicha tavsiyalar"] },
    strategy: { label: "Brend-strategiya va platforma", description: "Bozor tahlili, brend auditi, pozitsiyalash va qadriyatlar taklifini ishlab chiqish.", price: convertToUzs(4700), timeline: "8 haftadan", note: null, features: ["Bozor va raqobatchilar tahlili", "Brend platformasi (missiya, qadriyatlar)", "Pozitsiyalash strategiyasi", "Brend arxitekturasi"] },
    commStrategy: { label: "Kommunikatsion strategiya", description: "Mijozlar bilan muloqot strategiyasi: ohang, asosiy xabarlar, kanallar.", price: convertToUzs(3900), timeline: "8 haftadan", note: null, features: ["Maqsadli auditoriya segmentatsiyasi", "Brend ovozi (Tone of Voice)", "Asosiy xabarlar (Key Messages)", "Kommunikatsiya kanallari rejasi"] },
    namingStandard: { label: "Naming Standard", description: "Kichik biznes uchun ideal.", price: 8200000, timeline: "7–10 kun", note: null, features: ["3 ta nom varianti", "Domen va ijtimoiy tarmoqlarda bo‘shlik tekshiruvi", "Patent bo‘yicha 1 klass audit"] },
    namingPremium: { label: "Naming Premium", description: "O'rta va rivojlanayotgan biznes uchun.", price: convertToUzs(1000), timeline: "14–20 kun", note: null, features: ["10+ nom variantlari", "Domen va ijtimoiy tarmoqlarda bo‘shlik tekshiruvi", "6 tilda semantik va fonetik tekshiruv", "Patent bo‘yicha 2 klass audit + huquqiy xulosa", "5 yilga domen band qilib beriladi"], recommended: true },
    namingVIP: { label: "Naming VIP", description: "Katta va xalqaro bozorga mo'ljallangan loyihalar uchun.", price: 17875000, timeline: "20–25 kun", note: null, features: ["20+ nom variantlari, keng konsepsiyalar bilan", "Domen va ijtimoiy tarmoqlarda bo‘shlik tekshiruvi", "6 tilda semantik + fonetik + huquqiy tekshiruv", "Patent tezlashtirilgan topshiruv (boj alohida)", "10 yilga domen band qilib beriladi", "To‘liq taqdimot + storytelling asosida nomlanish", "3 oygacha post-delivery huquqiy maslahat"] },
    logoStandard: { label: "Logotip Standard", description: "Startaplar uchun tezkor yechim.", price: 9900000, timeline: "7–10 kun", note: null, features: ["3 ta logotip konsepsiyasi", "5 ta touchpoint vizualizatsiya (vizitka, post, web, qadoq, signage)", "Vektor fayllar to‘plami (AI, EPS, PNG, JPG, PDF)"] },
    logoPremium: { label: "Logotip Premium", description: "O'z brendini jiddiy rivojlantirish niyatidagilar uchun.", price: 19552500, timeline: "14–20 kun", note: null, features: ["5 ta logotip konsepsiyasi", "15+ touchpoint vizualizatsiya", "Firma uslubi (asosiy rang, shrift, qo‘llash qoidalari)", "10 ta Telegram stiker"], recommended: true },
    logoVIP: { label: "Logotip VIP", description: "Kengaytirilgan identifikatsiya va to'liq qo'llab-quvvatlash.", price: 37115000, timeline: "20–30 kun", note: null, features: ["8+ logotip konsepsiyasi, xalqaro darajada prezentatsiya", "25+ touchpoint dizayn (offline va online)", "Vizual Brandbook: ranglar, shriftlar, logotip qo‘llash qoidalari, grid, minimal qo‘llanma", "Logobook (PDF + print-ready)", "30 ta Telegram stiker + 20 ikon", "Logotip animatsiyasi (premium sifatli)", "Patent topshiruvda hamrohlik (boj alohida)", "3 oy davomida post-delivery qo‘llab-quvvatlash"] },
    brandbook: { label: "Brendbuk va gaydlayn", description: "Firma uslubidan foydalanish bo'yicha qoidalar hujjati.", price: convertToUzs(1000), timeline: "1 haftadan", note: null, features: ["Logotipdan foydalanish qoidalari", "Ranglar va shriftlar tizimi", "Dizayn maketlari namunalari", "Taqiqlangan holatlar"] },
    packaging: { label: "Qadoq dizayni", description: "3 SKU uchun qadoq ishlab chiqish, chop etishga tayyorlash.", price: convertToUzs(1000), timeline: "4-6 hafta", note: null, features: ["Bozor tahlili va konsepsiya", "3 SKU uchun dizayn", "Chop etishga tayyorlash (pre-press)", "3D vizualizatsiya"] },
    smm: { label: "Ijtimoiy tarmoqlar uchun stil", description: "Postlar va storislarni firma uslubida bezash.", price: convertToUzs(1000), timeline: "2 haftadan", note: null, features: ["6 ta post uchun shablon", "6 ta storis uchun shablon", "Profil avatar va cover rasmi", "Aktual storislar uchun ikonikalar"] },
    merch: { label: "Brendli merch va nositellar", description: "Kiyim, aksessuarlar, POSM materiallari dizayni.", price: 0, timeline: "2 haftadan", note: "Individual", features: ["Futbolka, kepka dizayni", "Bloknot, ruchka dizayni", "Sumka, paket dizayni", "Mijoz talabiga ko'ra boshqalar"] },
    illustrations: { label: "Illustratsiyalar va animatsiya", description: "Firma grafikasi, infografika va animatsiyalar yaratish.", price: 0, timeline: "3 haftadan", note: "Individual", features: ["Brend personajini yaratish", "Sayt yoki reklama uchun illustratsiyalar", "Logo animatsiyasi", "2D/3D animatsion roliklar"] },
    urgency: { label: "Shoshilinch loyiha (+50%)", description: "Loyiha navbatsiz, qisqa muddatda (2-3 kun) tayyorlanadi.", price: 0, timeline: "Individual", note: "+50%", features: ["Navbatdan tashqari ishlash", "Tezlashtirilgan tahlil va dizayn", "Birinchi natija 48 soatda", "Standart narxga 50% ustama"] },
    nda: { label: "Maxfiylik shartnomasi (NDA) (+25%)", description: "Loyiha ma'lumotlarini oshkor etmaslik shartnomasi.", price: 0, timeline: "Individual", note: "+25%", features: ["Yuridik hujjat tayyorlash", "To'liq maxfiylik kafolati", "Loyiha ma'lumotlarini himoya qilish", "Standart narxga 25% ustama"] }
};

const ruServiceDetails = {
    audit: { label: "Аудит логотипа", description: "Анализ существующего логотипа и рекомендации по улучшению.", price: convertToUzs(100), timeline: "2-3 дня", note: null, features: ["Сильные и слабые стороны логотипа", "Анализ относительно конкурентов", "Конкретные рекомендации по улучшению"] },
    namingCheck: { label: "Проверка нейминга", description: "Проверка доступности имени бренда в базах данных Узбекистана и международных базах.", price: convertToUzs(120), timeline: "1-2 дня", note: null, features: ["Проверка по базе Узбекистана", "Проверка по международной базе WIPO", "Проверка доступности домена", "Юридическая консультация"] },
    consultation: { label: "1-часовая консультация", description: "Быстрые рекомендации и профессиональные советы по любому вопросу брендинга.", price: convertToUzs(80), timeline: "1 час", note: null, features: ["Выявление бизнес-проблем", "Ответы на вопросы по брендингу", "Рекомендации по следующим шагам"] },
    strategy: { label: "Бренд-стратегия и платформа", description: "Анализ рынка, аудит бренда, разработка позиционирования и ценностного предложения.", price: convertToUzs(4700), timeline: "от 8 недель", note: null, features: ["Анализ рынка и конкурентов", "Платформа бренда (миссия, ценности)", "Стратегия позиционирования", "Архитектура бренда"] },
    commStrategy: { label: "Коммуникационная стратегия", description: "Стратегия общения с клиентами: тон, ключевые сообщения, каналы.", price: convertToUzs(3900), timeline: "от 8 недель", note: null, features: ["Сегментация целевой аудитории", "Голос бренда (Tone of Voice)", "Ключевые сообщения (Key Messages)", "План коммуникационных каналов"] },
    namingStandard: { label: "Нейминг Standard", description: "Идеально для малого бизнеса.", price: 8200000, timeline: "7–10 дней", note: null, features: ["3 варианта имени", "Проверка доступности домена и в соцсетях", "Аудит 1 класса по патенту"] },
    namingPremium: { label: "Нейминг Premium", description: "Для среднего и развивающегося бизнеса.", price: convertToUzs(1000), timeline: "14–20 дней", note: null, features: ["10+ вариантов имени", "Проверка доступности домена и в соцсетях", "Семантическая и фонетическая проверка на 6 языках", "Аудит 2 классов по патенту + юр. заключение", "Бронирование домена на 5 лет"], recommended: true },
    namingVIP: { label: "Нейминг VIP", description: "Для крупных и международных проектов.", price: 17875000, timeline: "20–25 дней", note: null, features: ["20+ вариантов имени с широкими концепциями", "Проверка доступности домена и в соцсетях", "Семантическая + фонетическая + юр. проверка на 6 языках", "Ускоренная подача патента (пошлина отдельно)", "Бронирование домена на 10 лет", "Полная презентация + сторителлинг названия", "3 месяца юридических консультаций после сдачи"] },
    logoStandard: { label: "Логотип Standard", description: "Быстрое решение для стартапов.", price: 9900000, timeline: "7–10 дней", note: null, features: ["3 концепции логотипа", "Визуализация на 5 носителях (визитка, пост, веб, упаковка, вывеска)", "Набор векторных файлов (AI, EPS, PNG, JPG, PDF)"] },
    logoPremium: { label: "Логотип Premium", description: "Для тех, кто серьезно настроен развивать свой бренд.", price: 19552500, timeline: "14–20 дней", note: null, features: ["5 концепций логотипа", "15+ визуализаций на носителях", "Фирменный стиль (основной цвет, шрифт, правила использования)", "10 Telegram-стикеров"], recommended: true },
    logoVIP: { label: "Логотип VIP", description: "Расширенная айдентика и полная поддержка.", price: 37115000, timeline: "20–30 дней", note: null, features: ["8+ концепций логотипа с презентацией международного уровня", "25+ дизайнов носителей (офлайн и онлайн)", "Визуальный брендбук: цвета, шрифты, правила использования логотипа, сетка, минимальное руководство", "Логобук (PDF + pre-press)", "30 Telegram-стикеров + 20 иконок", "Анимация логотипа (премиум-качество)", "Сопровождение при подаче патента (пошлина отдельно)", "3 месяца поддержки после сдачи"] },
    brandbook: { label: "Брендбук и гайдлайн", description: "Документ с правилами использования фирменного стиля.", price: convertToUzs(1000), timeline: "от 1 недели", note: null, features: ["Правила использования логотипа", "Система цветов и шрифтов", "Примеры макетов дизайна", "Запрещенные случаи"] },
    packaging: { label: "Дизайн упаковки", description: "Разработка упаковки для 3 SKU, подготовка к печати.", price: convertToUzs(1000), timeline: "4-6 недель", note: null, features: ["Анализ рынка и концепция", "Дизайн для 3 SKU", "Подготовка к печати (pre-press)", "3D-визуализация"] },
    smm: { label: "Стиль для социальных сетей", description: "Оформление постов и сторис в фирменном стиле.", price: convertToUzs(1000), timeline: "от 2 недель", note: null, features: ["6 шаблонов для постов", "6 шаблонов для сторис", "Аватар и обложка профиля", "Иконки для актуальных сторис"] },
    merch: { label: "Брендированный мерч и носители", description: "Дизайн одежды, аксессуаров, POSM-материалов.", price: 0, timeline: "от 2 недель", note: "Индивидуально", features: ["Дизайн футболки, кепки", "Дизайн блокнота, ручки", "Дизайн сумки, пакета", "Другое по требованию клиента"] },
    illustrations: { label: "Иллюстрации и анимация", description: "Создание фирменной графики, инфографики и анимаций.", price: 0, timeline: "от 3 недель", note: "Индивидуально", features: ["Создание бренд-персонажа", "Иллюстрации для сайта или рекламы", "Анимация логотипа", "2D/3D анимационные ролики"] },
    urgency: { label: "Срочный проект (+50%)", description: "Проект выполняется вне очереди, в короткие сроки (2-3 дня).", price: 0, timeline: "Индивидуально", note: "+50%", features: ["Работа вне очереди", "Ускоренный анализ и дизайн", "Первый результат через 48 часов", "Надбавка 50% к стандартной цене"] },
    nda: { label: "Договор о неразглашении (NDA) (+25%)", description: "Договор о неразглашении информации о проекте.", price: 0, timeline: "Индивидуально", note: "+25%", features: ["Подготовка юридического документа", "Полная гарантия конфиденциальности", "Защита информации о проекте", "Надбавка 25% к стандартной цене"] }
};

const enServiceDetails = {
    audit: { label: "Logo Audit", description: "Analysis of the existing logo and recommendations for improvement.", price: convertToUzs(100), timeline: "2-3 days", note: null, features: ["Logo's strengths and weaknesses", "Analysis against competitors", "Specific recommendations for improvement"] },
    namingCheck: { label: "Naming Check", description: "Checking the availability of the brand name in Uzbekistan and international databases.", price: convertToUzs(120), timeline: "1-2 days", note: null, features: ["Check in Uzbekistan database", "Check in international WIPO database", "Domain availability check", "Legal advice"] },
    consultation: { label: "1-hour consultation", description: "Quick guidance and professional advice on any branding question.", price: convertToUzs(80), timeline: "1 hour", note: null, features: ["Identifying business problems", "Answering branding questions", "Recommendations for next steps"] },
    strategy: { label: "Brand Strategy and Platform", description: "Market analysis, brand audit, positioning and value proposition development.", price: convertToUzs(4700), timeline: "from 8 weeks", note: null, features: ["Market and competitor analysis", "Brand platform (mission, values)", "Positioning strategy", "Brand architecture"] },
    commStrategy: { label: "Communication Strategy", description: "Customer communication strategy: tone, key messages, channels.", price: convertToUzs(3900), timeline: "from 8 weeks", note: null, features: ["Target audience segmentation", "Brand Tone of Voice", "Key Messages", "Communication channels plan"] },
    namingStandard: { label: "Naming Standard", description: "Ideal for small businesses.", price: 8200000, timeline: "7–10 days", note: null, features: ["3 name options", "Domain and social media availability check", "Patent audit for 1 class"] },
    namingPremium: { label: "Naming Premium", description: "For medium and growing businesses.", price: convertToUzs(1000), timeline: "14–20 days", note: null, features: ["10+ name options", "Domain and social media availability check", "Semantic and phonetic check in 6 languages", "Patent audit for 2 classes + legal opinion", "5-year domain reservation"], recommended: true },
    namingVIP: { label: "Naming VIP", description: "For large and international projects.", price: 17875000, timeline: "20–25 days", note: null, features: ["20+ name options with broad concepts", "Domain and social media availability check", "Semantic + phonetic + legal check in 6 languages", "Expedited patent filing (fee separate)", "10-year domain reservation", "Full presentation + storytelling naming", "Up to 3 months of post-delivery legal advice"] },
    logoStandard: { label: "Logo Standard", description: "A quick solution for startups.", price: 9900000, timeline: "7–10 days", note: null, features: ["3 logo concepts", "5 touchpoint visualizations (business card, post, web, packaging, signage)", "Set of vector files (AI, EPS, PNG, JPG, PDF)"] },
    logoPremium: { label: "Logo Premium", description: "For those serious about developing their brand.", price: 19552500, timeline: "14–20 days", note: null, features: ["5 logo concepts", "15+ touchpoint visualizations", "Corporate identity (main color, font, usage rules)", "10 Telegram stickers"], recommended: true },
    logoVIP: { label: "Logo VIP", description: "Expanded identity and full support.", price: 37115000, timeline: "20–30 days", note: null, features: ["8+ logo concepts with international-level presentation", "25+ touchpoint designs (offline and online)", "Visual Brandbook: colors, fonts, logo usage rules, grid, mini-guide", "Logobook (PDF + print-ready)", "30 Telegram stickers + 20 icons", "Logo animation (premium quality)", "Assistance with patent filing (fee separate)", "3 months of post-delivery support"] },
    brandbook: { label: "Brandbook and Guideline", description: "A document with rules for using the corporate identity.", price: convertToUzs(1000), timeline: "from 1 week", note: null, features: ["Logo usage rules", "Color and font system", "Design layout examples", "Prohibited cases"] },
    packaging: { label: "Packaging Design", description: "Packaging development for 3 SKUs, preparation for printing.", price: convertToUzs(1000), timeline: "4-6 weeks", note: null, features: ["Market analysis and concept", "Design for 3 SKUs", "Preparation for printing (pre-press)", "3D visualization"] },
    smm: { label: "Style for Social Networks", description: "Design of posts and stories in corporate style.", price: convertToUzs(1000), timeline: "from 2 weeks", note: null, features: ["6 post templates", "6 story templates", "Profile avatar and cover image", "Icons for highlight stories"] },
    merch: { label: "Branded Merch and Carriers", description: "Design of clothing, accessories, POSM materials.", price: 0, timeline: "from 2 weeks", note: "Individual", features: ["T-shirt, cap design", "Notebook, pen design", "Bag, package design", "Other upon client's request"] },
    illustrations: { label: "Illustrations and Animation", description: "Creation of corporate graphics, infographics and animations.", price: 0, timeline: "from 3 weeks", note: "Individual", features: ["Creating a brand character", "Illustrations for website or advertising", "Logo animation", "2D/3D animated videos"] },
    urgency: { label: "Urgent Project (+50%)", description: "The project is carried out out of turn, in a short time (2-3 days).", price: 0, timeline: "Individual", note: "+50%", features: ["Out-of-turn work", "Accelerated analysis and design", "First result in 48 hours", "50% surcharge on standard price"] },
    nda: { label: "Non-Disclosure Agreement (NDA) (+25%)", description: "Agreement on non-disclosure of project information.", price: 0, timeline: "Individual", note: "+25%", features: ["Preparation of a legal document", "Full confidentiality guarantee", "Project information protection", "25% surcharge on standard price"] }
};

export const getServiceDetails = (lang: 'uz' | 'ru' | 'en') => {
    switch (lang) {
        case 'ru': return ruServiceDetails;
        case 'en': return enServiceDetails;
        default: return uzServiceDetails;
    }
};

type ServiceDetailsType = typeof uzServiceDetails;

export function formatPrice(price: number, lang: 'uz' | 'ru' | 'en' = 'uz') {
    if (price === 0) {
        if (lang === 'ru') return 'По догов.';
        if (lang === 'en') return 'On Request';
        return "Kelishiladi";
    }

    const currency = lang === 'ru' ? 'сум' : (lang === 'en' ? 'sum' : "so'm");
    return `${price.toLocaleString('fr-FR')} ${currency}`;
}


export const comparisonData = (lang: 'uz' | 'ru' | 'en' = 'uz') => {
    const sd = getServiceDetails(lang);
    const satisfactionGuarantee = lang === 'ru' ? '100% Гарантия Удовлетворенности' : lang === 'en' ? '100% Satisfaction Guarantee' : '100% Mamnuniyat Kafolati';
    const transparentProcess = lang === 'ru' ? 'Прозрачный процесс и постоянная связь' : lang === 'en' ? 'Transparent process and constant communication' : 'Shaffof jarayon va doimiy aloqa';
    const pcgDiscount = lang === 'ru' ? 'Скидка -50% для членов PCG' : lang === 'en' ? '-50% discount for PCG members' : 'PCG a\'zolari uchun -50% chegirma';

    return [
      { 
        feature: sd.namingPremium.label,
        competitors: { jon: `${formatPrice(sd.namingPremium.price, lang)}`, mano: `${formatPrice(convertToUzs(3150), lang)}`, abba: `${formatPrice(convertToUzs(3000), lang)}`, mountain: `${formatPrice(convertToUzs(2750), lang)}` }
      },
      { 
        feature: sd.logoPremium.label,
        competitors: { jon: `${formatPrice(sd.logoPremium.price, lang)}`, mano: `${formatPrice(convertToUzs(6450), lang)}`, abba: `${formatPrice(convertToUzs(6150), lang)}`, mountain: `${formatPrice(convertToUzs(5600), lang)}` }
      },
      { 
        feature: sd.brandbook.label,
        competitors: { jon: `${formatPrice(sd.brandbook.price, lang)}`, mano: `${formatPrice(convertToUzs(3300), lang)}`, abba: `${formatPrice(convertToUzs(3150), lang)}`, mountain: `${formatPrice(convertToUzs(3900), lang)}` }
      },
      { 
        feature: sd.packaging.label,
        competitors: { jon: `${formatPrice(sd.packaging.price, lang)}`, mano: `${formatPrice(convertToUzs(9450), lang)}`, abba: `${formatPrice(convertToUzs(6300), lang)}`, mountain: `${formatPrice(convertToUzs(4700), lang)}` }
      },
      { 
        feature: sd.strategy.label,
        competitors: { jon: `${formatPrice(sd.strategy.price, lang)}`, mano: `${formatPrice(convertToUzs(18900), lang)}`, abba: null, mountain: false }
      },
      { 
        feature: sd.commStrategy.label,
        competitors: { jon: `${formatPrice(sd.commStrategy.price, lang)}`, mano: `${formatPrice(convertToUzs(15000), lang)}`, abba: null, mountain: false }
      },
      { 
        feature: sd.smm.label,
        competitors: { jon: `${formatPrice(sd.smm.price, lang)}`, mano: `${formatPrice(convertToUzs(3500), lang)}`, abba: null, mountain: null }
      },
      { 
        feature: satisfactionGuarantee,
        isBenefit: true,
        competitors: { jon: true, mano: false, abba: false, mountain: false }
      },
      { 
        feature: transparentProcess,
        isBenefit: true,
        competitors: { jon: true, mano: true, abba: null, mountain: true }
      },
      { 
        feature: pcgDiscount,
        isBenefit: true,
        competitors: { jon: true, mano: false, abba: false, mountain: false }
      },
    ];
};


export type SelectedServices = Record<keyof ServiceDetailsType, boolean>;

export const packageDiscountThreshold = 3;
export const packageDiscount = 0.20; // 20%
export const upfrontDiscount = 0.10; // 10%
export const urgencySurcharge = 0.50;
export const ndaSurcharge = 0.25;
export const bonusThreshold = convertToUzs(4000);


interface PackageSelections {
    selectedServices: SelectedServices;
    wantsUpfrontPayment: boolean;
}

export interface PriceDetails {
    base: number;
    final: number;
    discountApplied: { name: string, value: number }[];
    savings: number;
    bonus: string | null;
    surcharges: { name: string, value: number }[];
}


export const calculatePackagePrice = (selections: PackageSelections, lang: 'uz' | 'ru' | 'en' = 'uz'): PriceDetails => {
    const { selectedServices, wantsUpfrontPayment } = selections;
    const sd = getServiceDetails(lang);
    
    let basePrice = 0;
    let mainServicesCount = 0;
    
    const mainServices: (keyof SelectedServices)[] = ['namingPremium', 'namingVIP', 'logoPremium', 'logoVIP', 'brandbook', 'packaging', 'strategy'];
    const percentageServices: (keyof SelectedServices)[] = ['urgency', 'nda'];

    for (const serviceKey in selectedServices) {
        const key = serviceKey as keyof SelectedServices;
        if (
            sd[key] && 
            selectedServices[key] &&
            !percentageServices.includes(key)
        ) {
            basePrice += sd[key].price;
            if(mainServices.includes(key)) {
                mainServicesCount++;
            }
        }
    }

    let priceAfterSurcharges = basePrice;
    const surcharges: { name: string, value: number }[] = [];

    if (selectedServices.urgency) {
        const surchargeAmount = basePrice * urgencySurcharge;
        priceAfterSurcharges += surchargeAmount;
        let surchargeName;
        if (lang === 'ru') surchargeName = 'Надбавка за срочность (+50%)';
        else if (lang === 'en') surchargeName = 'Urgency Surcharge (+50%)';
        else surchargeName = 'Shoshilinch uchun ustama (+50%)';
        surcharges.push({ name: surchargeName, value: surchargeAmount });
    }

    if (selectedServices.nda) {
        const surchargeAmount = basePrice * ndaSurcharge;
        priceAfterSurcharges += surchargeAmount;
        let surchargeName;
        if (lang === 'ru') surchargeName = 'Надбавка за NDA (+25%)';
        else if (lang === 'en') surchargeName = 'NDA Surcharge (+25%)';
        else surchargeName = 'NDA uchun ustama (+25%)';
        surcharges.push({ name: surchargeName, value: surchargeAmount });
    }
    
    let priceAfterDiscount = priceAfterSurcharges;
    const discountsApplied: { name: string, value: number }[] = [];
    
    if (mainServicesCount >= packageDiscountThreshold) {
        const discountAmount = priceAfterSurcharges * packageDiscount;
        priceAfterDiscount -= discountAmount;
        let discountName;
        if (lang === 'ru') discountName = 'Пакетная скидка (-20%)';
        else if (lang === 'en') discountName = 'Package Discount (-20%)';
        else discountName = 'Paketli chegirma (-20%)';
        discountsApplied.push({ name: discountName, value: discountAmount });
    }

    if (wantsUpfrontPayment) {
        const discountAmount = priceAfterDiscount * upfrontDiscount;
        priceAfterDiscount -= discountAmount;
        let discountName;
        if (lang === 'ru') discountName = 'За предоплату (-10%)';
        else if (lang === 'en') discountName = 'For upfront payment (-10%)';
        else discountName = 'Oldindan to\'lov uchun (-10%)';
        discountsApplied.push({ name: discountName, value: discountAmount });
    }
    
    const finalPrice = priceAfterDiscount;
    const savings = priceAfterSurcharges - finalPrice;
    
    let bonusDescription;
    if (lang === 'ru') bonusDescription = "Аудит логотипа и 1-часовая консультация в подарок";
    else if (lang === 'en') bonusDescription = "Logo audit and 1-hour consultation as a gift";
    else bonusDescription = "Logotip auditi va 1 soatlik konsultatsiya sovg'a tariqasida";
    const bonus = finalPrice > bonusThreshold ? bonusDescription : null;

    return {
        base: basePrice,
        final: finalPrice,
        discountApplied: discountsApplied,
        savings,
        bonus,
        surcharges,
    };
}

export const generateSummary = (selections: PackageSelections, lang: 'uz' | 'ru' | 'en' = 'uz') => {
    const { selectedServices, wantsUpfrontPayment } = selections;
    const sd = getServiceDetails(lang);
    
    const services = [];
    for (const serviceKey in selectedServices) {
        if (serviceKey in sd && selectedServices[serviceKey as keyof SelectedServices]) {
            const service = sd[serviceKey as keyof SelectedServices];
            if(service.price > 0 || service.note?.includes('%')) {
                services.push(service.label);
            }
        }
    }

    let summary = `${lang === 'ru' ? 'Выбранные услуги' : lang === 'en' ? 'Selected services' : 'Tanlangan xizmatlar'}: ${services.join(', ') || (lang === 'ru' ? 'Нет' : lang === 'en' ? 'None' : 'Yo\'q')}`;

    const { discountApplied, bonus, surcharges } = calculatePackagePrice(selections, lang);
    
    const conditions = [];

    if (surcharges.some(s => s.name.includes('Shoshilinch') || s.name.includes('Срочность') || s.name.includes('Urgency'))) {
        conditions.push(lang === 'ru' ? "Срочный" : lang === 'en' ? 'Urgent' : "Shoshilinch");
    }
     if (surcharges.some(s => s.name.includes('NDA'))) {
        conditions.push("NDA");
    }
    if (wantsUpfrontPayment) {
        conditions.push(lang === 'ru' ? "100% предоплата" : lang === 'en' ? '100% upfront payment' : "100% oldindan to'lov");
    }

    if (conditions.length > 0) {
        summary += `\n${lang === 'ru' ? 'Особые условия' : lang === 'en' ? 'Special conditions' : 'Maxsus shartlar'}: ${conditions.join(', ')}`;
    }

    if (discountApplied.length > 0) {
        const discountText = discountApplied.map(d => `${d.name} (${formatPrice(d.value, lang)})`).join('; ');
        summary += `\n${lang === 'ru' ? 'Примененные скидки' : lang === 'en' ? 'Applied discounts' : 'Qo\'llanilgan chegirmalar'}: ${discountText}`;
    }

    if (bonus) {
        summary += `\n${lang === 'ru' ? 'Бонус' : 'Bonus'}: ${bonus}`;
    }

    return summary;
}
