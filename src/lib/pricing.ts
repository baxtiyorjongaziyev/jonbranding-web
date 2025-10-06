
const USD_TO_UZS_RATE = 12700;

const convertToUzs = (usd: number) => {
    if (usd === 0) return 0;
    // Round to nearest 100,000 UZS for cleaner pricing
    return Math.round(usd * USD_TO_UZS_RATE / 100000) * 100000;
}

const basePricesUSD = {
    audit: 100,
    namingCheck: 120,
    consultation: 80,
    strategy: 4700,
    commStrategy: 3900,
    namingStandard: 650, // 8,200,000 UZS
    namingPremium: 1000, // 12,700,000 UZS
    namingVIP: 1400, // 17,875,000 UZS
    logoStandard: 780, // 9,900,000 UZS
    logoPremium: 1540, // 19,552,500 UZS
    logoVIP: 2920, // 37,115,000 UZS
    packaging: 1000,
    smm: 1000,
    merch: 0,
    illustrations: 0,
    urgency: 0,
    nda: 0,
};


const uzServiceDetails = {
    audit: { label: "Logo Auditi", description: "Mavjud logotipni tahlil qilish va yaxshilash bo'yicha tavsiyalar.", price: basePricesUSD.audit, note: null, features: ["Logotipning kuchli va zaif tomonlari", "Raqobatchilarga nisbatan tahlil", "Yaxshilash bo'yicha aniq tavsiyalar"] },
    namingCheck: { label: "Neyming Tekshiruvi", description: "Brend nomining O'zbekiston va xalqaro bazalarda bo'shligini tekshirish.", price: basePricesUSD.namingCheck, note: null, features: ["O'zbekiston bazasi bo'yicha tekshiruv", "Xalqaro WIPO bazasi bo'yicha tekshiruv", "Domen bo'shligini tekshirish", "Huquqiy maslahat"] },
    consultation: { label: "1 soatlik konsultatsiya", description: "Brending bo'yicha har qanday savolingizga tezkor yo'l-yo'riq va professional maslahat.", price: basePricesUSD.consultation, note: null, features: ["Biznes-muammolarni aniqlash", "Brending bo'yicha savollarga javob", "Keyingi qadamlar bo'yicha tavsiyalar"] },
    strategy: { label: "Brend-strategiya va platforma", description: "Bozor tahlili, brend auditi, pozitsiyalash va qadriyatlar taklifini ishlab chiqish.", price: basePricesUSD.strategy, note: null, features: ["Bozor va raqobatchilar tahlili", "Brend platformasi (missiya, qadriyatlar)", "Pozitsiyalash strategiyasi", "Brend arxitekturasi"] },
    commStrategy: { label: "Kommunikatsion strategiya", description: "Mijozlar bilan muloqot strategiyasi: ohang, asosiy xabarlar, kanallar.", price: basePricesUSD.commStrategy, note: null, features: ["Maqsadli auditoriya segmentatsiyasi", "Brend ovozi (Tone of Voice)", "Asosiy xabarlar (Key Messages)", "Kommunikatsiya kanallari rejasi"] },
    namingStandard: { label: "Naming Standard", description: "Kichik biznes uchun ideal.", price: basePricesUSD.namingStandard, note: null, features: ["Kompaniya va soha qisqa o‘rganiladi", "Raqobatchilar umumiy ko‘rib chiqiladi", "Mijoz xohish-istaklari yig‘iladi", "3 ta nom varianti ishlab chiqiladi", "Domen va ijtimoiy tarmoqlarda bo‘shlik tekshiriladi", "Patent bo‘yicha 1 klass auditi qilinadi", "Har bir variant fonetik jihatdan tekshiriladi"], timeline: "Birinchi konsepsiyalar 7–10 ish kuni ichida taqdim etiladi" },
    namingPremium: { label: "Naming Premium", description: "O'rta va rivojlanayotgan biznes uchun.", price: basePricesUSD.namingPremium, note: null, features: ["Kompaniya va soha chuqurroq o‘rganiladi", "Raqobatchilar va bozor tahlili qilinadi", "5+ nom varianti ishlab chiqiladi", "Domen va ijtimoiy tarmoqlarda bo‘shlik tekshiriladi", "6 tilda semantik va fonetik tekshiruv (Ingliz, Rus, Turk, Ispan, Italyan, Fransuz)", "Patent bo‘yicha 2 klass auditi va huquqiy xulosa", "5 yilga domen band qilib beriladi", "Nom variantlari qisqa taqdimot shaklida ko‘rsatiladi"], recommended: true, timeline: "Birinchi konsepsiyalar 14–20 ish kuni ichida taqdim etiladi" },
    namingVIP: { label: "Naming VIP", description: "Katta va xalqaro bozorga mo'ljallangan loyihalar uchun.", price: basePricesUSD.namingVIP, note: null, features: ["Shaxsan Baxtiyorjon Gaziyev ishtiroki va nazorati", "Kompaniya, soha va auditoriya chuqur tahlil qilinadi", "Raqobatchilar va bozorning keng qamrovli tahlili qilinadi", "10+ keng konsepsiyali nom variantlari ishlab chiqiladi", "Domen va ijtimoiy tarmoqlarda bo‘shlik tekshiriladi", "6 tilda semantik + fonetik + huquqiy tekshiruv", "Patent tezlashtirilgan topshiruv (boj alohida)", "10 yilga domen band qilib beriladi", "Har bir nom uchun storytelling asosida tushuntirish beriladi", "Taqdimot professional prezentatsiya formatida qilinadi", "3 oygacha post-delivery huquqiy maslahat va kuzatuv"], timeline: "Birinchi konsepsiyalar 20–25 ish kuni ichida taqdim etiladi" },
    logoStandard: { label: "Logotip Standard", description: "Startaplar uchun tezkor yechim.", price: basePricesUSD.logoStandard, note: null, features: ["Kompaniya brifi asosida 3 ta logotip konsepsiyasi ishlab chiqiladi", "Raqobatchilar logotiplari tahlil qilinadi", "5 ta touchpoint vizualizatsiya (vizitka, post, web, qadoq, signage)", "Logotip vektor fayllari (AI, EPS, PNG, JPG, PDF) taqdim qilinadi", "Har bir konsepsiya texnik va vizual standartlarga tekshiriladi"], timeline: "Birinchi konsepsiyalar 7–10 ish kuni ichida taqdim etiladi" },
    logoPremium: { label: "Logo va firma uslubi", description: "O'z brendini jiddiy rivojlantirish niyatidagilar uchun.", price: basePricesUSD.logoPremium, note: null, features: ["Kompaniya qadriyatlari va strategiyasiga mos 5 ta logotip konsepsiyasi ishlab chiqiladi", "Raqobatchilar va bozor vizual identifikatsiyasi o‘rganiladi", "15+ touchpoint vizualizatsiya (vizitka, qadoq, reklama, web, social post)", "Firma uslubi (asosiy ranglar, shriftlar, logotip qo‘llash qoidalari) ishlab chiqiladi", "10 ta Telegram stiker tayyorlanadi", "Taqdimot professional maketlar bilan ko‘rsatiladi"], recommended: true, timeline: "Birinchi konsepsiyalar 14–20 ish kuni ichida taqdim etiladi" },
    logoVIP: { label: "Logotip VIP", description: "Kengaytirilgan identifikatsiya va to'liq qo'llab-quvvatlash.", price: basePricesUSD.logoVIP, note: null, features: ["Shaxsan Baxtiyorjon Gaziyev ishtiroki va nazorati", "Brend strategiyasi asosida 8+ logotip konsepsiyasi ishlab chiqiladi", "Raqobatchilar va soha bo‘yicha keng vizual tahlil qilinadi", "25+ touchpoint dizayn (offline va online)", "Vizual Brandbook: ranglar, shriftlar, logotip qo‘llash qoidalari, grid, minimal qo‘llanma", "Logobook (PDF + print-ready)", "30 ta Telegram stiker + 20 ikon", "Logotip animatsiyasi (premium sifatli)", "Patent topshiruv jarayonida hamrohlik (boj alohida)", "3 oygacha post-delivery qo‘llab-quvvatlash"], timeline: "Birinchi konsepsiyalar 20–30 ish kuni ichida taqdim etiladi" },
    packaging: { label: "Qadoq dizayni", description: "3 SKU uchun qadoq ishlab chiqish, chop etishga tayyorlash.", price: basePricesUSD.packaging, note: null, features: ["Bozor tahlili va konsepsiya", "3 SKU uchun dizayn", "Chop etishga tayyorlash (pre-press)", "3D vizualizatsiya"] },
    smm: { label: "Ijtimoiy tarmoqlar uchun stil", description: "Postlar va storislarni firma uslubida bezash.", price: basePricesUSD.smm, note: null, features: ["6 ta post uchun shablon", "6 ta storis uchun shablon", "Profil avatar va cover rasmi", "Aktual storislar uchun ikonikalar"] },
    merch: { label: "Brendli merch va nositellar", description: "Kiyim, aksessuarlar, POSM materiallari dizayni.", price: 0, note: "Individual", features: ["Futbolka, kepka dizayni", "Bloknot, ruchka dizayni", "Sumka, paket dizayni", "Mijoz talabiga ko'ra boshqalar"] },
    illustrations: { label: "Illustratsiyalar va animatsiya", description: "Firma grafikasi, infografika va animatsiyalar yaratish.", price: 0, note: "Individual", features: ["Brend personajini yaratish", "Sayt yoki reklama uchun illustratsiyalar", "Logo animatsiyasi", "2D/3D animatsion roliklar"] },
    urgency: { label: "Shoshilinch loyiha (+50%)", description: "Loyiha navbatsiz, qisqa muddatda (2-3 kun) tayyorlanadi.", price: 0, note: "+50%", features: ["Navbatdan tashqari ishlash", "Tezlashtirilgan tahlil va dizayn", "Birinchi natija 48 soatda", "Standart narxga 50% ustama"] },
    nda: { label: "Maxfiylik shartnomasi (NDA) (+25%)", description: "Loyiha ma'lumotlarini oshkor etmaslik shartnomasi.", price: 0, note: "+25%", features: ["Yuridik hujjat tayyorlash", "To'liq maxfiylik kafolati", "Loyiha ma'lumotlarini himoya qilish", "Standart narxga 25% ustama"] }
};

const ruServiceDetails = {
    audit: { ...uzServiceDetails.audit, label: "Аудит логотипа", description: "Анализ существующего логотипа и рекомендации по улучшению.", features: ["Сильные и слабые стороны логотипа", "Анализ относительно конкурентов", "Конкретные рекомендации по улучшению"] },
    namingCheck: { ...uzServiceDetails.namingCheck, label: "Проверка нейминга", description: "Проверка доступности имени бренда в базах данных Узбекистана и международных базах.", features: ["Проверка по базе Узбекистана", "Проверка по международной базе WIPO", "Проверка доступности домена", "Юридическая консультация"] },
    consultation: { ...uzServiceDetails.consultation, label: "1-часовая консультация", description: "Быстрые рекомендации и профессиональные советы по любому вопросу брендинга.", features: ["Выявление бизнес-проблем", "Ответы на вопросы по брендингу", "Рекомендации по следующим шагам"] },
    strategy: { ...uzServiceDetails.strategy, label: "Бренд-стратегия и платформа", description: "Анализ рынка, аудит бренда, разработка позиционирования и ценностного предложения.", features: ["Анализ рынка и конкурентов", "Платформа бренда (миссия, ценности)", "Стратегия позиционирования", "Архитектура бренда"] },
    commStrategy: { ...uzServiceDetails.commStrategy, label: "Коммуникационная стратегия", description: "Стратегия общения с клиентами: тон, ключевые сообщения, каналы.", features: ["Сегментация целевой аудитории", "Голос бренда (Tone of Voice)", "Ключевые сообщения (Key Messages)", "План коммуникационных каналов"] },
    namingStandard: { ...uzServiceDetails.namingStandard, label: "Нейминг Standard", description: "Идеально для малого бизнеса.", features: ["Краткое изучение компании и сферы", "Общий обзор конкурентов", "Сбор пожеланий клиента", "Разработка 3 вариантов имени", "Проверка доступности домена и в соцсетях", "Аудит 1 класса по патенту", "Фонетическая проверка каждого варианта"], timeline: "Первые концепции предоставляются в течение 7–10 рабочих дней" },
    namingPremium: { ...uzServiceDetails.namingPremium, label: "Нейминг Premium", description: "Для среднего и развивающегося бизнеса.", features: ["Более глубокое изучение компании и сферы", "Анализ конкурентов и рынка", "Разработка 5+ вариантов имени", "Проверка доступности домена и в соцсетях", "Семантическая и фонетическая проверка на 6 языках (Английский, Русский, Турецкий, Испанский, Итальянский, Французский)", "Аудит 2 классов по патенту и юридическое заключение", "Бронирование домена на 5 лет", "Варианты имени представляются в виде краткой презентации"], timeline: "Первые концепции предоставляются в течение 14–20 рабочих дней" },
    namingVIP: { ...uzServiceDetails.namingVIP, label: "Нейминг VIP", description: "Для крупных и международных проектов.", features: ["Личное участие и контроль Бахтиёржона Газиева", "Глубокий анализ компании, сферы и аудитории", "Всесторонний анализ конкурентов и рынка", "Разработка 10+ вариантов имени с широкими концепциями", "Проверка доступности домена и в соцсетях", "Семантическая + фонетическая + юридическая проверка на 6 языках", "Ускоренная подача патента (пошлина отдельно)", "Бронирование домена на 10 лет", "Объяснение каждого имени на основе сторителлинга", "Представление в формате профессиональной презентации", "До 3 месяцев юридических консультаций и сопровождения после сдачи"], timeline: "Первые концепции предоставляются в течение 20–25 рабочих дней" },
    logoStandard: { ...uzServiceDetails.logoStandard, label: "Логотип Standard", description: "Быстрое решение для стартапов.", features: ["Разработка 3 концепций логотипа на основе брифа компании", "Анализ логотипов конкурентов", "Визуализация на 5 носителях (визитка, пост, веб, упаковка, вывеска)", "Предоставление векторных файлов логотипа (AI, EPS, PNG, JPG, PDF)", "Проверка каждой концепции на технические и визуальные стандарты"], timeline: "Первые концепции предоставляются в течение 7–10 рабочих дней" },
    logoPremium: { ...uzServiceDetails.logoPremium, label: "Логотип и фирменный стиль", description: "Для тех, кто серьезно настроен развивать свой бренд.", features: ["Разработка 5 концепций логотипа в соответствии с ценностями и стратегией компании", "Изучение визуальной идентификации конкурентов и рынка", "15+ визуализаций на носителях (визитка, упаковка, реклама, веб, пост в соцсетях)", "Разработка фирменного стиля (основные цвета, шрифты, правила использования логотипа)", "Подготовка 10 Telegram-стикеров", "Представление с профессиональными макетами"], timeline: "Первые концепции предоставляются в течение 14–20 рабочих дней" },
    logoVIP: { ...uzServiceDetails.logoVIP, label: "Логотип VIP", description: "Расширенная айдентика и полная поддержка.", features: ["Личное участие и контроль Бахтиёржона Газиева", "Разработка 8+ концепций логотипа на основе бренд-стратегии", "Широкий визуальный анализ конкурентов и отрасли", "25+ дизайнов носителей (офлайн и онлайн)", "Визуальный брендбук: цвета, шрифты, правила использования логотипа, сетка, минимальное руководство", "Логобук (PDF + pre-press)", "30 Telegram-стикеров + 20 иконок", "Анимация логотипа (премиум-качество)", "Сопровождение при подаче патента (пошлина отдельно)", "До 3 месяцев поддержки после сдачи"], timeline: "Первые концепции предоставляются в течение 20–30 рабочих дней" },
    packaging: { ...uzServiceDetails.packaging, label: "Дизайн упаковки", description: "Разработка упаковки для 3 SKU, подготовка к печати.", features: ["Анализ рынка и концепция", "Дизайн для 3 SKU", "Подготовка к печати (pre-press)", "3D-визуализация"] },
    smm: { ...uzServiceDetails.smm, label: "Стиль для социальных сетей", description: "Оформление постов и сторис в фирменном стиле.", features: ["6 шаблонов для постов", "6 шаблонов для сторис", "Аватар и обложка профиля", "Иконки для актуальных сторис"] },
    merch: { ...uzServiceDetails.merch, label: "Брендированный мерч и носители", description: "Дизайн одежды, аксессуаров, POSM-материалов.", features: ["Дизайн футболки, кепки", "Дизайн блокнота, ручки", "Дизайн сумки, пакета", "Другое по требованию клиента"] },
    illustrations: { ...uzServiceDetails.illustrations, label: "Иллюстрации и анимация", description: "Создание фирменной графики, инфографики и анимаций.", features: ["Создание бренд-персонажа", "Иллюстрации для сайта или рекламы", "Анимация логотипа", "2D/3D анимационные ролики"] },
    urgency: { ...uzServiceDetails.urgency, label: "Срочный проект (+50%)", description: "Проект выполняется вне очереди, в короткие сроки (2-3 дня).", features: ["Работа вне очереди", "Ускоренный анализ и дизайн", "Первый результат через 48 часов", "Надбавка 50% к стандартной цене"] },
    nda: { ...uzServiceDetails.nda, label: "Договор о неразглашении (NDA) (+25%)", description: "Договор о неразглашении информации о проекте.", features: ["Подготовка юридического документа", "Полная гарантия конфиденциальности", "Защита информации о проекте", "Надбавка 25% к стандартной цене"] }
};

const enServiceDetails = {
    audit: { ...uzServiceDetails.audit, label: "Logo Audit", description: "Analysis of the existing logo and recommendations for improvement.", features: ["Logo's strengths and weaknesses", "Analysis against competitors", "Specific recommendations for improvement"] },
    namingCheck: { ...uzServiceDetails.namingCheck, label: "Naming Check", description: "Checking the availability of the brand name in Uzbekistan and international databases.", features: ["Check in Uzbekistan database", "Check in international WIPO database", "Domain availability check", "Legal advice"] },
    consultation: { ...uzServiceDetails.consultation, label: "1-hour consultation", description: "Quick guidance and professional advice on any branding question.", features: ["Identifying business problems", "Answering branding questions", "Recommendations for next steps"] },
    strategy: { ...uzServiceDetails.strategy, label: "Brand Strategy and Platform", description: "Market analysis, brand audit, positioning and value proposition development.", features: ["Market and competitor analysis", "Brand platform (mission, values)", "Positioning strategy", "Brand architecture"] },
    commStrategy: { ...uzServiceDetails.commStrategy, label: "Communication Strategy", description: "Customer communication strategy: tone, key messages, channels.", features: ["Target audience segmentation", "Brand Tone of Voice", "Key Messages", "Communication channels plan"] },
    namingStandard: { ...uzServiceDetails.namingStandard, label: "Naming Standard", description: "Ideal for small businesses.", features: ["Brief study of the company and industry", "General overview of competitors", "Collection of client's wishes", "Development of 3 name variants", "Domain and social media availability check", "Patent audit for 1 class", "Phonetic check of each variant"], timeline: "First concepts are presented within 7–10 working days" },
    namingPremium: { ...uzServiceDetails.namingPremium, label: "Naming Premium", description: "For medium and growing businesses.", features: ["Deeper study of the company and industry", "Analysis of competitors and market", "Development of 5+ name variants", "Domain and social media availability check", "Semantic and phonetic check in 6 languages (English, Russian, Turkish, Spanish, Italian, French)", "Patent audit for 2 classes and legal opinion", "5-year domain reservation", "Name variants are presented in a short presentation format"], timeline: "First concepts are presented within 14–20 working days" },
    namingVIP: { ...uzServiceDetails.namingVIP, label: "Naming VIP", description: "For large and international projects.", features: ["Personal involvement and supervision by Bakhtiyorjon Gaziyev", "In-depth analysis of the company, industry, and audience", "Comprehensive analysis of competitors and market", "Development of 10+ name variants with broad concepts", "Domain and social media availability check", "Semantic + phonetic + legal check in 6 languages", "Expedited patent filing (fee separate)", "10-year domain reservation", "Storytelling-based explanation for each name", "Presentation in a professional format", "Up to 3 months of post-delivery legal advice and monitoring"], timeline: "First concepts are presented within 20–25 working days" },
    logoStandard: { ...uzServiceDetails.logoStandard, label: "Logo Standard", description: "A quick solution for startups.", features: ["Development of 3 logo concepts based on the company brief", "Analysis of competitors' logos", "5 touchpoint visualizations (business card, post, web, packaging, signage)", "Provision of logo vector files (AI, EPS, PNG, JPG, PDF)", "Check of each concept for technical and visual standards"], timeline: "First concepts are presented within 7–10 working days" },
    logoPremium: { ...uzServiceDetails.logoPremium, label: "Logo & Corporate Identity", description: "For those serious about developing their brand.", features: ["Development of 5 logo concepts matching the company's values and strategy", "Study of competitors' and market's visual identity", "15+ touchpoint visualizations (business card, packaging, advertising, web, social post)", "Development of corporate identity (main colors, fonts, logo usage rules)", "Creation of 10 Telegram stickers", "Presentation with professional mockups"], timeline: "First concepts are presented within 14–20 working days" },
    logoVIP: { ...uzServiceDetails.logoVIP, label: "Logo VIP", description: "Expanded identity and full support.", features: ["Personal involvement and supervision by Bakhtiyorjon Gaziyev", "Development of 8+ logo concepts based on brand strategy", "Broad visual analysis of competitors and industry", "25+ touchpoint designs (offline and online)", "Visual Brandbook: colors, fonts, logo usage rules, grid, mini-guide", "Logobook (PDF + print-ready)", "30 Telegram stickers + 20 icons", "Logo animation (premium quality)", "Assistance with patent filing (fee separate)", "Up to 3 months of post-delivery support"], timeline: "First concepts are presented within 20–30 working days" },
    packaging: { ...uzServiceDetails.packaging, label: "Packaging Design", description: "Packaging development for 3 SKUs, preparation for printing.", features: ["Market analysis and concept", "Design for 3 SKUs", "Preparation for printing (pre-press)", "3D visualization"] },
    smm: { ...uzServiceDetails.smm, label: "Style for Social Networks", description: "Design of posts and stories in corporate style.", features: ["6 post templates", "6 story templates", "Profile avatar and cover image", "Icons for highlight stories"] },
    merch: { ...uzServiceDetails.merch, label: "Branded Merch and Carriers", description: "Design of clothing, accessories, POSM materials.", features: ["T-shirt, cap design", "Notebook, pen design", "Bag, package design", "Other upon client's request"] },
    illustrations: { ...uzServiceDetails.illustrations, label: "Illustrations and Animation", description: "Creation of corporate graphics, infographics and animations.", features: ["Creating a brand character", "Illustrations for website or advertising", "Logo animation", "2D/3D animated videos"] },
    urgency: { ...uzServiceDetails.urgency, label: "Urgent Project (+50%)", description: "The project is carried out out of turn, in a short time (2-3 days).", features: ["Out-of-turn work", "Accelerated analysis and design", "First result in 48 hours", "50% surcharge on standard price"] },
    nda: { ...uzServiceDetails.nda, label: "Non-Disclosure Agreement (NDA) (+25%)", description: "Agreement on non-disclosure of project information.", features: ["Preparation of a legal document", "Full confidentiality guarantee", "Project information protection", "25% surcharge on standard price"] }
};

const zhServiceDetails = {
    audit: { ...uzServiceDetails.audit, label: "标志审核", description: "对现有标志进行分析并提供改进建议。", features: ["标志的优缺点", "与竞争对手的对比分析", "具体的改进建议"] },
    namingCheck: { ...uzServiceDetails.namingCheck, label: "名称检查", description: "检查品牌名称在乌兹别克斯坦和国际数据库中的可用性。", features: ["在乌兹别克斯坦数据库中检查", "在国际WIPO数据库中检查", "域名可用性检查", "法律咨询"] },
    consultation: { ...uzServiceDetails.consultation, label: "1小时咨询", description: "为任何品牌问题提供快速指导和专业建议。", features: ["识别业务问题", "回答品牌问题", "后续步骤建议"] },
    strategy: { ...uzServiceDetails.strategy, label: "品牌策略与平台", description: "市场分析、品牌审核、定位和价值主张开发。", features: ["市场与竞争对手分析", "品牌平台（使命、价值观）", "定位策略", "品牌架构"] },
    commStrategy: { ...uzServiceDetails.commStrategy, label: "传播策略", description: "客户传播策略：语调、关键信息、渠道。", features: ["目标受众细分", "品牌语调（Tone of Voice）", "关键信息（Key Messages）", "传播渠道计划"] },
    namingStandard: { ...uzServiceDetails.namingStandard, label: "标准命名", description: "适合小型企业。", features: ["公司和行业简要研究", "竞争对手概览", "收集客户意愿", "开发3个名称方案", "域名和社交媒体可用性检查", "1个类别的专利审核", "每个方案的语音检查"], timeline: "初步概念在7-10个工作日内提交" },
    namingPremium: { ...uzServiceDetails.namingPremium, label: "高级命名", description: "适合中型和成长型企业。", features: ["公司和行业深入研究", "竞争对手和市场分析", "开发5个以上名称方案", "域名和社交媒体可用性检查", "6种语言的语义和语音检查（英语、俄语、土耳其语、西班牙语、意大利语、法语）", "2个类别的专利审核和法律意见", "5年域名预留", "以简短演示文稿形式呈现名称方案"], timeline: "初步概念在14-20个工作日内提交" },
    namingVIP: { ...uzServiceDetails.namingVIP, label: "VIP命名", description: "适合大型和国际项目。", features: ["巴赫蒂约尔洪·加济耶夫亲自参与和监督", "公司、行业和受众的深入分析", "竞争对手和市场的全面分析", "开发10个以上具有广泛概念的名称方案", "域名和社交媒体可用性检查", "6种语言的语义+语音+法律检查", "加急专利申请（费用另计）", "10年域名预留", "为每个名称提供基于故事的解释", "以专业格式进行演示", "交付后长达3个月的法律咨询和监控"], timeline: "初步概念在20-25个工作日内提交" },
    logoStandard: { ...uzServiceDetails.logoStandard, label: "标准标志", description: "为初创公司提供的快速解决方案。", features: ["根据公司简介开发3个标志概念", "竞争对手标志分析", "5个接触点可视化（名片、帖子、网站、包装、标牌）", "提供标志矢量文件（AI, EPS, PNG, JPG, PDF）", "检查每个概念的技术和视觉标准"], timeline: "初步概念在7-10个工作日内提交" },
    logoPremium: { ...uzServiceDetails.logoPremium, label: "标志与企业形象", description: "为那些认真发展品牌的企业。", features: ["开发5个符合公司价值观和战略的标志概念", "研究竞争对手和市场的视觉识别", "15个以上接触点可视化（名片、包装、广告、网站、社交帖子）", "开发企业形象（主色、字体、标志使用规则）", "制作10个Telegram贴纸", "使用专业模型进行演示"], timeline: "初步概念在14-20个工作日内提交" },
    logoVIP: { ...uzServiceDetails.logoVIP, label: "VIP标志", description: "扩展的形象和全面支持。", features: ["巴赫蒂约尔洪·加济耶夫亲自参与和监督", "基于品牌策略开发8个以上标志概念", "竞争对手和行业的广泛视觉分析", "25个以上接触点设计（线下和线上）", "视觉品牌手册：颜色、字体、标志使用规则、网格、迷你指南", "标志手册（PDF + 印刷版）", "30个Telegram贴纸 + 20个图标", "标志动画（高级质量）", "协助专利申请（费用另计）", "交付后长达3个月的支持"], timeline: "初步概念在20-30个工作日内提交" },
    packaging: { ...uzServiceDetails.packaging, label: "包装设计", description: "为3个SKU开发包装，为印刷做准备。", features: ["市场分析与概念", "为3个SKU设计", "为印刷做准备（印前）", "3D可视化"] },
    smm: { ...uzServiceDetails.smm, label: "社交网络风格", description: "以企业风格设计帖子和故事。", features: ["6个帖子模板", "6个故事模板", "个人资料头像和封面图片", "亮点故事图标"] },
    merch: { ...uzServiceDetails.merch, label: "品牌商品和载体", description: "服装、配饰、POSM材料的设计。", features: ["T恤、帽子设计", "笔记本、笔设计", "包、包装袋设计", "根据客户要求提供其他服务"] },
    illustrations: { ...uzServiceDetails.illustrations, label: "插图与动画", description: "创建企业图形、信息图和动画。", features: ["创建品牌角色", "网站或广告插图", "标志动画", "2D/3D动画视频"] },
    urgency: { ...uzServiceDetails.urgency, label: "紧急项目（+50%）", description: "该项目将不按顺序在短时间内（2-3天）执行。", features: ["不按顺序工作", "加速分析与设计", "48小时内出第一稿", "标准价格加收50%"] },
    nda: { ...uzServiceDetails.nda, label: "保密协议（NDA）（+25%）", description: "关于不披露项目信息的协议。", features: ["准备法律文件", "完全保密保证", "项目信息保护", "标准价格加收25%"] }
};


export const getServiceDetails = (lang: 'uz' | 'ru' | 'en' | 'zh') => {
    switch (lang) {
        case 'ru': return ruServiceDetails;
        case 'en': return enServiceDetails;
        case 'zh': return zhServiceDetails;
        default: return uzServiceDetails;
    }
};

type ServiceDetailsType = typeof uzServiceDetails;

export function formatPrice(priceInUSD: number, lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz', currency: 'uzs' | 'usd' = 'usd', showCurrencySymbol = true) {
    if (priceInUSD === 0) {
        if (lang === 'ru') return 'По догов.';
        if (lang === 'en') return 'On Request';
        if (lang === 'zh') return '面议';
        return "Kelishiladi";
    }

    let price: number;
    let currencyString: string;

    if (currency === 'uzs') {
        price = convertToUzs(priceInUSD);
        currencyString = lang === 'ru' ? 'сум' : (lang === 'en' ? 'sum' : (lang === 'zh' ? '苏姆' : "so'm"));
    } else {
        price = priceInUSD;
        currencyString = '$';
    }

    if (currency === 'usd' && showCurrencySymbol) {
         return `${currencyString}${price.toLocaleString('en-US')}`;
    }

    if (!showCurrencySymbol) {
        return price.toLocaleString('fr-FR');
    }

    return `${price.toLocaleString('fr-FR')} ${currencyString}`;
}


export const comparisonData = (lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz') => {
    const sd = getServiceDetails(lang);
    const satisfactionGuarantee = lang === 'ru' ? '100% Гарантия Удовлетворенности' : lang === 'en' ? '100% Satisfaction Guarantee' : lang === 'zh' ? '100% 满意保证' : '100% Mamnuniyat Kafolati';
    const transparentProcess = lang === 'ru' ? 'Прозрачный процесс и постоянная связь' : lang === 'en' ? 'Transparent process and constant communication' : lang === 'zh' ? '透明的流程和持续的沟通' : 'Shaffof jarayon va doimiy aloqa';
    const pcgDiscount = lang === 'ru' ? 'Скидка -50% для членов PCG' : lang === 'en' ? '-50% discount for PCG members' : lang === 'zh' ? 'PCG会员-50%折扣' : 'PCG a\'zolari uchun -50% chegirma';

    const formatCompPrice = (price: number) => {
        return formatPrice(price, lang, 'usd');
    }

    return [
      { 
        feature: sd.namingPremium.label,
        competitors: { jon: formatCompPrice(sd.namingPremium.price), mano: formatCompPrice(3150), abba: formatCompPrice(3000), mountain: formatCompPrice(2750) }
      },
      { 
        feature: sd.logoPremium.label,
        competitors: { jon: formatCompPrice(sd.logoPremium.price), mano: formatCompPrice(6450), abba: formatCompPrice(6150), mountain: formatCompPrice(5600) }
      },
      { 
        feature: sd.packaging.label,
        competitors: { jon: formatCompPrice(sd.packaging.price), mano: formatCompPrice(9450), abba: formatCompPrice(6300), mountain: formatCompPrice(4700) }
      },
      { 
        feature: sd.strategy.label,
        competitors: { jon: formatCompPrice(sd.strategy.price), mano: formatCompPrice(18900), abba: null, mountain: false }
      },
      { 
        feature: sd.commStrategy.label,
        competitors: { jon: formatCompPrice(sd.commStrategy.price), mano: formatCompPrice(15000), abba: null, mountain: false }
      },
      { 
        feature: sd.smm.label,
        competitors: { jon: formatCompPrice(sd.smm.price), mano: formatCompPrice(3500), abba: null, mountain: null }
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
export const bonusThreshold = 4000;


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


export const calculatePackagePrice = (selections: PackageSelections, lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz'): PriceDetails => {
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
        else if (lang === 'zh') surchargeName = '紧急项目附加费 (+50%)';
        else surchargeName = 'Shoshilinch uchun ustama (+50%)';
        surcharges.push({ name: surchargeName, value: surchargeAmount });
    }

    if (selectedServices.nda) {
        const surchargeAmount = totalBasePrice * ndaSurcharge;
        priceAfterSurcharges += surchargeAmount;
        let surchargeName;
        if (lang === 'ru') surchargeName = 'Надбавка за NDA (+25%)';
        else if (lang === 'en') surchargeName = 'NDA Surcharge (+25%)';
        else if (lang === 'zh') surchargeName = '保密协议附加费 (+25%)';
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
        else if (lang === 'zh') discountName = '套餐折扣 (-20%)';
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
        else if (lang === 'zh') discountName = '预付款折扣 (-10%)';
        else discountName = 'Oldindan to\'lov uchun (-10%)';
        discountsApplied.push({ name: discountName, value: discountAmount });
    } else {
        finalPrice = priceBeforeUpfrontDiscount;
    }
    
    const savings = priceAfterSurcharges - finalPrice;
    
    let bonusDescription;
    if (lang === 'ru') bonusDescription = "Аудит логотипа и 1-часовая консультация в подарок";
    else if (lang === 'en') bonusDescription = "Logo audit and 1-hour consultation as a gift";
    else if (lang === 'zh') bonusDescription = "免费赠送标志审核和1小时咨询";
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


export const generateSummary = (selections: PackageSelections, lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz') => {
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

    let summary = `${lang === 'ru' ? 'Выбранные услуги' : lang === 'en' ? 'Selected services' : lang === 'zh' ? '所选服务' : 'Tanlangan xizmatlar'}: ${services.join(', ') || (lang === 'ru' ? 'Нет' : lang === 'en' ? 'None' : lang === 'zh' ? '无' : 'Yo\'q')}`;

    const { discountApplied, bonus, surcharges } = calculatePackagePrice(selections, lang);
    
    const conditions = [];

    if (surcharges.some(s => s.name.includes('Shoshilinch') || s.name.includes('Срочность') || s.name.includes('Urgency') || s.name.includes('紧急'))) {
        conditions.push(lang === 'ru' ? "Срочный" : lang === 'en' ? 'Urgent' : lang === 'zh' ? '紧急' : "Shoshilinch");
    }
     if (surcharges.some(s => s.name.includes('NDA'))) {
        conditions.push("NDA");
    }
    if (wantsUpfrontPayment) {
        conditions.push(lang === 'ru' ? "100% предоплата" : lang === 'en' ? '100% upfront payment' : lang === 'zh' ? '100% 预付款' : "100% oldindan to'lov");
    }

    if (conditions.length > 0) {
        summary += `\n${lang === 'ru' ? 'Особые условия' : lang === 'en' ? 'Special conditions' : lang === 'zh' ? '特殊条件' : 'Maxsus shartlar'}: ${conditions.join(', ')}`;
    }

    if (discountApplied.length > 0) {
        const discountText = discountApplied.map(d => `${d.name} (${formatPrice(d.value, lang, 'usd')})`).join('; ');
        summary += `\n${lang === 'ru' ? 'Примененные скидки' : lang === 'en' ? 'Applied discounts' : lang === 'zh' ? '应用的折扣' : 'Qo\'llanilgan chegirmalar'}: ${discountText}`;
    }

    if (bonus) {
        summary += `\n${lang === 'ru' ? 'Бонус' : lang === 'en' ? 'Bonus' : 'Bonus'}: ${bonus}`;
    }

    return summary;
}

    