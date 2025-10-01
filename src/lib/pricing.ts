const USD_TO_UZS_RATE = 12700;

const convertToUzs = (usd: number) => {
    if (usd === 0) return 0;
    // Round to nearest 100,000 UZS for cleaner pricing
    return Math.round(usd * USD_TO_UZS_RATE / 100000) * 100000;
}

const uzServiceDetails = {
    audit: { label: "Logo Auditi", description: "Mavjud logotipni tahlil qilish va yaxshilash bo'yicha tavsiyalar.", price: convertToUzs(100), note: null, features: ["Logotipning kuchli va zaif tomonlari", "Raqobatchilarga nisbatan tahlil", "Yaxshilash bo'yicha aniq tavsiyalar"] },
    namingCheck: { label: "Neyming Tekshiruvi", description: "Brend nomining O'zbekiston va xalqaro bazalarda bo'shligini tekshirish.", price: convertToUzs(120), note: null, features: ["O'zbekiston bazasi bo'yicha tekshiruv", "Xalqaro WIPO bazasi bo'yicha tekshiruv", "Domen bo'shligini tekshirish", "Huquqiy maslahat"] },
    consultation: { label: "1 soatlik konsultatsiya", description: "Brending bo'yicha har qanday savolingizga tezkor yo'l-yo'riq va professional maslahat.", price: convertToUzs(80), note: null, features: ["Biznes-muammolarni aniqlash", "Brending bo'yicha savollarga javob", "Keyingi qadamlar bo'yicha tavsiyalar"] },
    strategy: { label: "Brend-strategiya va platforma", description: "Bozor tahlili, brend auditi, pozitsiyalash va qadriyatlar taklifini ishlab chiqish.", price: convertToUzs(4700), note: null, features: ["Bozor va raqobatchilar tahlili", "Brend platformasi (missiya, qadriyatlar)", "Pozitsiyalash strategiyasi", "Brend arxitekturasi"] },
    commStrategy: { label: "Kommunikatsion strategiya", description: "Mijozlar bilan muloqot strategiyasi: ohang, asosiy xabarlar, kanallar.", price: convertToUzs(3900), note: null, features: ["Maqsadli auditoriya segmentatsiyasi", "Brend ovozi (Tone of Voice)", "Asosiy xabarlar (Key Messages)", "Kommunikatsiya kanallari rejasi"] },
    namingStandard: { label: "Naming Standard", description: "Kichik biznes uchun ideal.", price: 8200000, note: null, features: ["Kompaniya va soha qisqa o‘rganiladi", "Raqobatchilar umumiy ko‘rib chiqiladi", "Mijoz xohish-istaklari yig‘iladi", "3 ta nom varianti ishlab chiqiladi", "Domen va ijtimoiy tarmoqlarda bo‘shlik tekshiriladi", "Patent bo‘yicha 1 klass auditi qilinadi", "Har bir variant fonetik jihatdan tekshiriladi"], timeline: "Birinchi konsepsiyalar 7–10 ish kuni ichida taqdim etiladi" },
    namingPremium: { label: "Naming Premium", description: "O'rta va rivojlanayotgan biznes uchun.", price: 12700000, note: null, features: ["Kompaniya va soha chuqurroq o‘rganiladi", "Raqobatchilar va bozor tahlili qilinadi", "5+ nom varianti ishlab chiqiladi", "Domen va ijtimoiy tarmoqlarda bo‘shlik tekshiriladi", "6 tilda semantik va fonetik tekshiruv (Ingliz, Rus, Turk, Ispan, Italyan, Fransuz)", "Patent bo‘yicha 2 klass auditi va huquqiy xulosa", "5 yilga domen band qilib beriladi", "Nom variantlari qisqa taqdimot shaklida ko‘rsatiladi"], recommended: true, timeline: "Birinchi konsepsiyalar 14–20 ish kuni ichida taqdim etiladi" },
    namingVIP: { label: "Naming VIP", description: "Katta va xalqaro bozorga mo'ljallangan loyihalar uchun.", price: 17875000, note: null, features: ["Shaxsan Baxtiyorjon Gaziyev ishtiroki va nazorati", "Kompaniya, soha va auditoriya chuqur tahlil qilinadi", "Raqobatchilar va bozorning keng qamrovli tahlili qilinadi", "10+ keng konsepsiyali nom variantlari ishlab chiqiladi", "Domen va ijtimoiy tarmoqlarda bo‘shlik tekshiriladi", "6 tilda semantik + fonetik + huquqiy tekshiruv", "Patent tezlashtirilgan topshiruv (boj alohida)", "10 yilga domen band qilib beriladi", "Har bir nom uchun storytelling asosida tushuntirish beriladi", "Taqdimot professional prezentatsiya formatida qilinadi", "3 oygacha post-delivery huquqiy maslahat va kuzatuv"], timeline: "Birinchi konsepsiyalar 20–25 ish kuni ichida taqdim etiladi" },
    logoStandard: { label: "Logotip Standard", description: "Startaplar uchun tezkor yechim.", price: 9900000, note: null, features: ["Kompaniya brifi asosida 3 ta logotip konsepsiyasi ishlab chiqiladi", "Raqobatchilar logotiplari tahlil qilinadi", "5 ta touchpoint vizualizatsiya (vizitka, post, web, qadoq, signage)", "Logotip vektor fayllari (AI, EPS, PNG, JPG, PDF) taqdim qilinadi", "Har bir konsepsiya texnik va vizual standartlarga tekshiriladi"], timeline: "Birinchi konsepsiyalar 7–10 ish kuni ichida taqdim etiladi" },
    logoPremium: { label: "Logo va firma uslubi", description: "O'z brendini jiddiy rivojlantirish niyatidagilar uchun.", price: 19552500, note: null, features: ["Kompaniya qadriyatlari va strategiyasiga mos 5 ta logotip konsepsiyasi ishlab chiqiladi", "Raqobatchilar va bozor vizual identifikatsiyasi o‘rganiladi", "15+ touchpoint vizualizatsiya (vizitka, qadoq, reklama, web, social post)", "Firma uslubi (asosiy ranglar, shriftlar, logotip qo‘llash qoidalari) ishlab chiqiladi", "10 ta Telegram stiker tayyorlanadi", "Taqdimot professional maketlar bilan ko‘rsatiladi"], recommended: true, timeline: "Birinchi konsepsiyalar 14–20 ish kuni ichida taqdim etiladi" },
    logoVIP: { label: "Logotip VIP", description: "Kengaytirilgan identifikatsiya va to'liq qo'llab-quvvatlash.", price: 37115000, note: null, features: ["Shaxsan Baxtiyorjon Gaziyev ishtiroki va nazorati", "Brend strategiyasi asosida 8+ logotip konsepsiyasi ishlab chiqiladi", "Raqobatchilar va soha bo‘yicha keng vizual tahlil qilinadi", "25+ touchpoint dizayn (offline va online)", "Vizual Brandbook: ranglar, shriftlar, logotip qo‘llash qoidalari, grid, minimal qo‘llanma", "Logobook (PDF + print-ready)", "30 ta Telegram stiker + 20 ikon", "Logotip animatsiyasi (premium sifatli)", "Patent topshiruv jarayonida hamrohlik (boj alohida)", "3 oygacha post-delivery qo‘llab-quvvatlash"], timeline: "Birinchi konsepsiyalar 20–30 ish kuni ichida taqdim etiladi" },
    packaging: { label: "Qadoq dizayni", description: "3 SKU uchun qadoq ishlab chiqish, chop etishga tayyorlash.", price: convertToUzs(1000), note: null, features: ["Bozor tahlili va konsepsiya", "3 SKU uchun dizayn", "Chop etishga tayyorlash (pre-press)", "3D vizualizatsiya"] },
    smm: { label: "Ijtimoiy tarmoqlar uchun stil", description: "Postlar va storislarni firma uslubida bezash.", price: convertToUzs(1000), note: null, features: ["6 ta post uchun shablon", "6 ta storis uchun shablon", "Profil avatar va cover rasmi", "Aktual storislar uchun ikonikalar"] },
    merch: { label: "Brendli merch va nositellar", description: "Kiyim, aksessuarlar, POSM materiallari dizayni.", price: 0, note: "Individual", features: ["Futbolka, kepka dizayni", "Bloknot, ruchka dizayni", "Sumka, paket dizayni", "Mijoz talabiga ko'ra boshqalar"] },
    illustrations: { label: "Illustratsiyalar va animatsiya", description: "Firma grafikasi, infografika va animatsiyalar yaratish.", price: 0, note: "Individual", features: ["Brend personajini yaratish", "Sayt yoki reklama uchun illustratsiyalar", "Logo animatsiyasi", "2D/3D animatsion roliklar"] },
    urgency: { label: "Shoshilinch loyiha (+50%)", description: "Loyiha navbatsiz, qisqa muddatda (2-3 kun) tayyorlanadi.", price: 0, note: "+50%", features: ["Navbatdan tashqari ishlash", "Tezlashtirilgan tahlil va dizayn", "Birinchi natija 48 soatda", "Standart narxga 50% ustama"] },
    nda: { label: "Maxfiylik shartnomasi (NDA) (+25%)", description: "Loyiha ma'lumotlarini oshkor etmaslik shartnomasi.", price: 0, note: "+25%", features: ["Yuridik hujjat tayyorlash", "To'liq maxfiylik kafolati", "Loyiha ma'lumotlarini himoya qilish", "Standart narxga 25% ustama"] }
};

const ruServiceDetails = {
    audit: { label: "Аудит логотипа", description: "Анализ существующего логотипа и рекомендации по улучшению.", price: convertToUzs(100), note: null, features: ["Сильные и слабые стороны логотипа", "Анализ относительно конкурентов", "Конкретные рекомендации по улучшению"] },
    namingCheck: { label: "Проверка нейминга", description: "Проверка доступности имени бренда в базах данных Узбекистана и международных базах.", price: convertToUzs(120), note: null, features: ["Проверка по базе Узбекистана", "Проверка по международной базе WIPO", "Проверка доступности домена", "Юридическая консультация"] },
    consultation: { label: "1-часовая консультация", description: "Быстрые рекомендации и профессиональные советы по любому вопросу брендинга.", price: convertToUzs(80), note: null, features: ["Выявление бизнес-проблем", "Ответы на вопросы по брендингу", "Рекомендации по следующим шагам"] },
    strategy: { label: "Бренд-стратегия и платформа", description: "Анализ рынка, аудит бренда, разработка позиционирования и ценностного предложения.", price: convertToUzs(4700), note: null, features: ["Анализ рынка и конкурентов", "Платформа бренда (миссия, ценности)", "Стратегия позиционирования", "Архитектура бренда"] },
    commStrategy: { label: "Коммуникационная стратегия", description: "Стратегия общения с клиентами: тон, ключевые сообщения, каналы.", price: convertToUzs(3900), note: null, features: ["Сегментация целевой аудитории", "Голос бренда (Tone of Voice)", "Ключевые сообщения (Key Messages)", "План коммуникационных каналов"] },
    namingStandard: { label: "Нейминг Standard", description: "Идеально для малого бизнеса.", price: 8200000, note: null, features: ["Краткое изучение компании и сферы", "Общий обзор конкурентов", "Сбор пожеланий клиента", "Разработка 3 вариантов имени", "Проверка доступности домена и в соцсетях", "Аудит 1 класса по патенту", "Фонетическая проверка каждого варианта"], timeline: "Первые концепции предоставляются в течение 7–10 рабочих дней" },
    namingPremium: { label: "Нейминг Premium", description: "Для среднего и развивающегося бизнеса.", price: 12700000, note: null, features: ["Более глубокое изучение компании и сферы", "Анализ конкурентов и рынка", "Разработка 5+ вариантов имени", "Проверка доступности домена и в соцсетях", "Семантическая и фонетическая проверка на 6 языках (Английский, Русский, Турецкий, Испанский, Итальянский, Французский)", "Аудит 2 классов по патенту и юридическое заключение", "Бронирование домена на 5 лет", "Варианты имени представляются в виде краткой презентации"], recommended: true, timeline: "Первые концепции предоставляются в течение 14–20 рабочих дней" },
    namingVIP: { label: "Нейминг VIP", description: "Для крупных и международных проектов.", price: 17875000, note: null, features: ["Личное участие и контроль Бахтиёржона Газиева", "Глубокий анализ компании, сферы и аудитории", "Всесторонний анализ конкурентов и рынка", "Разработка 10+ вариантов имени с широкими концепциями", "Проверка доступности домена и в соцсетях", "Семантическая + фонетическая + юридическая проверка на 6 языках", "Ускоренная подача патента (пошлина отдельно)", "Бронирование домена на 10 лет", "Объяснение каждого имени на основе сторителлинга", "Представление в формате профессиональной презентации", "До 3 месяцев юридических консультаций и сопровождения после сдачи"], timeline: "Первые концепции предоставляются в течение 20–25 рабочих дней" },
    logoStandard: { label: "Логотип Standard", description: "Быстрое решение для стартапов.", price: 9900000, note: null, features: ["Разработка 3 концепций логотипа на основе брифа компании", "Анализ логотипов конкурентов", "Визуализация на 5 носителях (визитка, пост, веб, упаковка, вывеска)", "Предоставление векторных файлов логотипа (AI, EPS, PNG, JPG, PDF)", "Проверка каждой концепции на технические и визуальные стандарты"], timeline: "Первые концепции предоставляются в течение 7–10 рабочих дней" },
    logoPremium: { label: "Логотип и фирменный стиль", description: "Для тех, кто серьезно настроен развивать свой бренд.", price: 19552500, note: null, features: ["Разработка 5 концепций логотипа в соответствии с ценностями и стратегией компании", "Изучение визуальной идентификации конкурентов и рынка", "15+ визуализаций на носителях (визитка, упаковка, реклама, веб, пост в соцсетях)", "Разработка фирменного стиля (основные цвета, шрифты, правила использования логотипа)", "Подготовка 10 Telegram-стикеров", "Представление с профессиональными макетами"], recommended: true, timeline: "Первые концепции предоставляются в течение 14–20 рабочих дней" },
    logoVIP: { label: "Логотип VIP", description: "Расширенная айдентика и полная поддержка.", price: 37115000, note: null, features: ["Личное участие и контроль Бахтиёржона Газиева", "Разработка 8+ концепций логотипа на основе бренд-стратегии", "Широкий визуальный анализ конкурентов и отрасли", "25+ дизайнов носителей (офлайн и онлайн)", "Визуальный брендбук: цвета, шрифты, правила использования логотипа, сетка, минимальное руководство", "Логобук (PDF + pre-press)", "30 Telegram-стикеров + 20 иконок", "Анимация логотипа (премиум-качество)", "Сопровождение при подаче патента (пошлина отдельно)", "До 3 месяцев поддержки после сдачи"], timeline: "Первые концепции предоставляются в течение 20–30 рабочих дней" },
    packaging: { label: "Дизайн упаковки", description: "Разработка упаковки для 3 SKU, подготовка к печати.", price: convertToUzs(1000), note: null, features: ["Анализ рынка и концепция", "Дизайн для 3 SKU", "Подготовка к печати (pre-press)", "3D-визуализация"] },
    smm: { label: "Стиль для социальных сетей", description: "Оформление постов и сторис в фирменном стиле.", price: convertToUzs(1000), note: null, features: ["6 шаблонов для постов", "6 шаблонов для сторис", "Аватар и обложка профиля", "Иконки для актуальных сторис"] },
    merch: { label: "Брендированный мерч и носители", description: "Дизайн одежды, аксессуаров, POSM-материалов.", price: 0, note: "Индивидуально", features: ["Дизайн футболки, кепки", "Дизайн блокнота, ручки", "Дизайн сумки, пакета", "Другое по требованию клиента"] },
    illustrations: { label: "Иллюстрации и анимация", description: "Создание фирменной графики, инфографики и анимаций.", price: 0, note: "Индивидуально", features: ["Создание бренд-персонажа", "Иллюстрации для сайта или рекламы", "Анимация логотипа", "2D/3D анимационные ролики"] },
    urgency: { label: "Срочный проект (+50%)", description: "Проект выполняется вне очереди, в короткие сроки (2-3 дня).", price: 0, note: "+50%", features: ["Работа вне очереди", "Ускоренный анализ и дизайн", "Первый результат через 48 часов", "Надбавка 50% к стандартной цене"] },
    nda: { label: "Договор о неразглашении (NDA) (+25%)", description: "Договор о неразглашении информации о проекте.", price: 0, note: "+25%", features: ["Подготовка юридического документа", "Полная гарантия конфиденциальности", "Защита информации о проекте", "Надбавка 25% к стандартной цене"] }
};

const enServiceDetails = {
    audit: { label: "Logo Audit", description: "Analysis of the existing logo and recommendations for improvement.", price: convertToUzs(100), note: null, features: ["Logo's strengths and weaknesses", "Analysis against competitors", "Specific recommendations for improvement"] },
    namingCheck: { label: "Naming Check", description: "Checking the availability of the brand name in Uzbekistan and international databases.", price: convertToUzs(120), note: null, features: ["Check in Uzbekistan database", "Check in international WIPO database", "Domain availability check", "Legal advice"] },
    consultation: { label: "1-hour consultation", description: "Quick guidance and professional advice on any branding question.", price: convertToUzs(80), note: null, features: ["Identifying business problems", "Answering branding questions", "Recommendations for next steps"] },
    strategy: { label: "Brand Strategy and Platform", description: "Market analysis, brand audit, positioning and value proposition development.", price: convertToUzs(4700), note: null, features: ["Market and competitor analysis", "Brand platform (mission, values)", "Positioning strategy", "Brand architecture"] },
    commStrategy: { label: "Communication Strategy", description: "Customer communication strategy: tone, key messages, channels.", price: convertToUzs(3900), note: null, features: ["Target audience segmentation", "Brand Tone of Voice", "Key Messages", "Communication channels plan"] },
    namingStandard: { label: "Naming Standard", description: "Ideal for small businesses.", price: 8200000, note: null, features: ["Brief study of the company and industry", "General overview of competitors", "Collection of client's wishes", "Development of 3 name variants", "Domain and social media availability check", "Patent audit for 1 class", "Phonetic check of each variant"], timeline: "First concepts are presented within 7–10 working days" },
    namingPremium: { label: "Naming Premium", description: "For medium and growing businesses.", price: 12700000, note: null, features: ["Deeper study of the company and industry", "Analysis of competitors and market", "Development of 5+ name variants", "Domain and social media availability check", "Semantic and phonetic check in 6 languages (English, Russian, Turkish, Spanish, Italian, French)", "Patent audit for 2 classes and legal opinion", "5-year domain reservation", "Name variants are presented in a short presentation format"], recommended: true, timeline: "First concepts are presented within 14–20 working days" },
    namingVIP: { label: "Naming VIP", description: "For large and international projects.", price: 17875000, note: null, features: ["Personal involvement and supervision by Bakhtiyorjon Gaziyev", "In-depth analysis of the company, industry, and audience", "Comprehensive analysis of competitors and market", "Development of 10+ name variants with broad concepts", "Domain and social media availability check", "Semantic + phonetic + legal check in 6 languages", "Expedited patent filing (fee separate)", "10-year domain reservation", "Storytelling-based explanation for each name", "Presentation in a professional format", "Up to 3 months of post-delivery legal advice and monitoring"], timeline: "First concepts are presented within 20–25 working days" },
    logoStandard: { label: "Logo Standard", description: "A quick solution for startups.", price: 9900000, note: null, features: ["Development of 3 logo concepts based on the company brief", "Analysis of competitors' logos", "5 touchpoint visualizations (business card, post, web, packaging, signage)", "Provision of logo vector files (AI, EPS, PNG, JPG, PDF)", "Check of each concept for technical and visual standards"], timeline: "First concepts are presented within 7–10 working days" },
    logoPremium: { label: "Logo & Corporate Identity", description: "For those serious about developing their brand.", price: 19552500, note: null, features: ["Development of 5 logo concepts matching the company's values and strategy", "Study of competitors' and market's visual identity", "15+ touchpoint visualizations (business card, packaging, advertising, web, social post)", "Development of corporate identity (main colors, fonts, logo usage rules)", "Creation of 10 Telegram stickers", "Presentation with professional mockups"], recommended: true, timeline: "First concepts are presented within 14–20 working days" },
    logoVIP: { label: "Logo VIP", description: "Expanded identity and full support.", price: 37115000, note: null, features: ["Personal involvement and supervision by Bakhtiyorjon Gaziyev", "Development of 8+ logo concepts based on brand strategy", "Broad visual analysis of competitors and industry", "25+ touchpoint designs (offline and online)", "Visual Brandbook: colors, fonts, logo usage rules, grid, mini-guide", "Logobook (PDF + print-ready)", "30 Telegram stickers + 20 icons", "Logo animation (premium quality)", "Assistance with patent filing (fee separate)", "Up to 3 months of post-delivery support"], timeline: "First concepts are presented within 20–30 working days" },
    packaging: { label: "Packaging Design", description: "Packaging development for 3 SKUs, preparation for printing.", price: convertToUzs(1000), note: null, features: ["Market analysis and concept", "Design for 3 SKUs", "Preparation for printing (pre-press)", "3D visualization"] },
    smm: { label: "Style for Social Networks", description: "Design of posts and stories in corporate style.", price: convertToUzs(1000), note: null, features: ["6 post templates", "6 story templates", "Profile avatar and cover image", "Icons for highlight stories"] },
    merch: { label: "Branded Merch and Carriers", description: "Design of clothing, accessories, POSM materials.", price: 0, note: "Individual", features: ["T-shirt, cap design", "Notebook, pen design", "Bag, package design", "Other upon client's request"] },
    illustrations: { label: "Illustrations and Animation", description: "Creation of corporate graphics, infographics and animations.", price: 0, note: "Individual", features: ["Creating a brand character", "Illustrations for website or advertising", "Logo animation", "2D/3D animated videos"] },
    urgency: { label: "Urgent Project (+50%)", description: "The project is carried out out of turn, in a short time (2-3 days).", price: 0, note: "+50%", features: ["Out-of-turn work", "Accelerated analysis and design", "First result in 48 hours", "50% surcharge on standard price"] },
    nda: { label: "Non-Disclosure Agreement (NDA) (+25%)", description: "Agreement on non-disclosure of project information.", price: 0, note: "+25%", features: ["Preparation of a legal document", "Full confidentiality guarantee", "Project information protection", "25% surcharge on standard price"] }
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

export const packageDiscountThreshold = 2;
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
    
    let nonVipBasePrice = 0;
    let vipServicesPrice = 0;
    let mainServicesCount = 0;
    
    const mainServices: (keyof SelectedServices)[] = ['namingPremium', 'logoPremium', 'packaging', 'strategy'];
    const vipServices: (keyof SelectedServices)[] = ['namingVIP', 'logoVIP'];
    const percentageServices: (keyof SelectedServices)[] = ['urgency', 'nda'];

    for (const serviceKey in selectedServices) {
        const key = serviceKey as keyof SelectedServices;
        if (sd[key] && selectedServices[key]) {
            const servicePrice = sd[key].price;
            if (vipServices.includes(key)) {
                vipServicesPrice += servicePrice;
            } else if (!percentageServices.includes(key)) {
                nonVipBasePrice += servicePrice;
                if (mainServices.includes(key)) {
                    mainServicesCount++;
                }
            }
        }
    }

    const totalBasePrice = nonVipBasePrice + vipServicesPrice;
    let priceAfterSurcharges = totalBasePrice;
    const surcharges: { name: string, value: number }[] = [];

    if (selectedServices.urgency) {
        const surchargeAmount = totalBasePrice * urgencySurcharge;
        priceAfterSurcharges += surchargeAmount;
        let surchargeName;
        if (lang === 'ru') surchargeName = 'Надбавка за срочность (+50%)';
        else if (lang === 'en') surchargeName = 'Urgency Surcharge (+50%)';
        else surchargeName = 'Shoshilinch uchun ustama (+50%)';
        surcharges.push({ name: surchargeName, value: surchargeAmount });
    }

    if (selectedServices.nda) {
        const surchargeAmount = totalBasePrice * ndaSurcharge;
        priceAfterSurcharges += surchargeAmount;
        let surchargeName;
        if (lang === 'ru') surchargeName = 'Надбавка за NDA (+25%)';
        else if (lang === 'en') surchargeName = 'NDA Surcharge (+25%)';
        else surchargeName = 'NDA uchun ustama (+25%)';
        surcharges.push({ name: surchargeName, value: surchargeAmount });
    }
    
    let finalPrice = vipServicesPrice > 0 ? vipServicesPrice + (priceAfterSurcharges - totalBasePrice) : priceAfterSurcharges;

    const discountsApplied: { name: string, value: number }[] = [];
    
    // Apply package discount only on non-VIP services
    let nonVipPriceAfterDiscount = nonVipBasePrice;
    if (mainServicesCount >= packageDiscountThreshold) {
        const discountAmount = nonVipBasePrice * packageDiscount;
        nonVipPriceAfterDiscount -= discountAmount;
        let discountName;
        if (lang === 'ru') discountName = 'Пакетная скидка (-20%)';
        else if (lang === 'en') discountName = 'Package Discount (-20%)';
        else discountName = 'Paketli chegirma (-20%)';
        discountsApplied.push({ name: discountName, value: discountAmount });
    }

    // Apply upfront discount on the sum of discounted non-VIP and all VIP services
    let priceBeforeUpfrontDiscount = nonVipPriceAfterDiscount + vipServicesPrice + (priceAfterSurcharges - totalBasePrice);

    if (wantsUpfrontPayment) {
        const discountAmount = priceBeforeUpfrontDiscount * upfrontDiscount;
        finalPrice = priceBeforeUpfrontDiscount - discountAmount;
        let discountName;
        if (lang === 'ru') discountName = 'За предоплату (-10%)';
        else if (lang === 'en') discountName = 'For upfront payment (-10%)';
        else discountName = 'Oldindan to\'lov uchun (-10%)';
        discountsApplied.push({ name: discountName, value: discountAmount });
    } else {
        finalPrice = priceBeforeUpfrontDiscount;
    }
    
    const savings = priceAfterSurcharges - finalPrice;
    
    let bonusDescription;
    if (lang === 'ru') bonusDescription = "Аудит логотипа и 1-часовая консультация в подарок";
    else if (lang === 'en') bonusDescription = "Logo audit and 1-hour consultation as a gift";
    else bonusDescription = "Logotip auditi va 1 soatlik konsultatsiya sovg'a tariqasida";
    const bonus = finalPrice > bonusThreshold ? bonusDescription : null;

    return {
        base: totalBasePrice,
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
