
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
            features: isUz ? ["Logoning texnik tahlili", "Bozorga moslik tekshiruvi", "Kamchiliklar ro'yxati", "Yaxshilash bo'yicha tavsiyalar"] : (isRu ? ["Технический анализ логотипа", "Проверка на соответствие рынку", "Список недостатков", "Рекомендации по улучшению"] : (isZh ? ["标志技术分析", "市场契合度检查", "弱点清单", "改进建议"] : ["Technical analysis", "Market fit check", "List of weaknesses", "Improvement tips"])),
            benefits: isUz ? [
                { icon: "🔍", title: "Kamchiliklarni bilasiz", description: "Logotipingizdagi barcha xato va kamchiliklar aniqlanadi." },
                { icon: "💡", title: "Yaxshilash yo'li", description: "Logotipni qanday qilib zamonaviy qilish bo'yicha aniq yo'l xaritasi olasiz." }
            ] : (isRu ? [
                { icon: "🔍", title: "Узнаете недостатки", description: "Будут выявлены все ошибки и недостатки вашего логотипа." },
                { icon: "💡", title: "Путь к улучшению", description: "Вы получите четкую дорожную карту по модернизации логотипа." }
            ] : (isZh ? [
                { icon: "🔍", title: "识别缺陷", description: "发现您标志中的所有技术和战略错误。" },
                { icon: "💡", title: "改进路径", description: "获得关于如何实现视觉形象现代化的清晰路线图。" }
            ] : [
                { icon: "🔍", title: "Identify flaws", description: "Discover all technical and strategic errors in your logo." },
                { icon: "💡", title: "Improvement path", description: "Get a clear roadmap on how to modernize your visual identity." }
            ]))
        },
        namingCheck: {
            label: isUz ? "Neyming Tekshiruvi" : (isRu ? "Проверка нейминга" : (isZh ? "命名检查" : "Naming Check")),
            price: basePricesUSD.namingCheck,
            timeline: isUz ? "⏱ 1-2 ish kuni" : (isRu ? "⏱ 1-2 рабочих дня" : (isZh ? "⏱ 1-2 个工作日" : "⏱ 1-2 business days")),
            features: isUz ? ["O'zbekistondan tekshiruv", "Xalqaro bazadan tekshiruv", "Internetda mashhur nomlar tekshiruvi"] : (isRu ? ["Проверка по Узбекистану", "Проверка по международной базе", "Проверка популярных имен в интернете"] : (isZh ? ["本地检查", "国际检查", "知名名称检查"] : ["Local check", "International check", "Famous names check"])),
            benefits: isUz ? [
                { icon: "⚖️", title: "Huquqiy xavfsizlik", description: "Nomingiz boshqa patent bilan to'qnash kelmasligini bilasiz." },
                { icon: "✅", title: "Ishonch bilan boshlash", description: "Nomning band emasligiga amin bo'lib, ishni boshlaysiz." }
            ] : (isRu ? [
                { icon: "⚖️", title: "Юридическая безопасность", description: "Вы будете знать, что ваше имя не конфликтует с другими патентами." },
                { icon: "✅", title: "Уверенный старт", description: "Начинайте работу, будучи уверенным, что имя свободно." }
            ] : (isZh ? [
                { icon: "⚖️", title: "法律安全", description: "确保您的名称不与其他专利冲突。" },
                { icon: "✅", title: "信心开启", description: "在确认名称可用后开始您的业务。" }
            ] : [
                { icon: "⚖️", title: "Legal Safety", description: "Check availability." },
                { icon: "✅", title: "Confident Start", description: "Start knowing the name is free." }
            ]))
        },
        consultation: {
            label: isUz ? "Konsultatsiya" : (isRu ? "Консультация" : (isZh ? "咨询" : "Consultation")),
            price: basePricesUSD.consultation,
            timeline: isUz ? "⏱ 60 daqiqa" : (isRu ? "⏱ 60 минут" : (isZh ? "⏱ 60 分钟" : "⏱ 60 minutes")),
            features: isUz ? ["Muammolarni tahlil qilish", "Brending strategiyasi", "Savollarga javoblar", "Yo'l xaritasi tuzish"] : (isRu ? ["Анализ проблем", "Стратегия брендинга", "Ответы на вопросы", "Составление дорожной карты"] : (isZh ? ["问题分析", "品牌策略", "问答", "路线图制定"] : ["Problem analysis", "Branding strategy", "Q&A", "Roadmap"])),
            benefits: isUz ? [
                { icon: "💬", title: "Ekspert fikri", description: "9 yillik tajribaga ega mutaxassisdan shaxsiy maslahat." },
                { icon: "🎯", title: "Aniq maqsad", description: "Biznesingiz uchun qaysi brending bosqichi kerakligini aniqlaysiz." }
            ] : (isRu ? [
                { icon: "💬", title: "Мнение эксперта", description: "Личная консультация от специалиста с 9-летним опытом." },
                { icon: "🎯", title: "Четкая цель", description: "Вы определите, какой этап брендинга необходим вашему бизнесу." }
            ] : (isZh ? [
                { icon: "💬", title: "专家意见", description: "来自拥有9年经验的专家的个人建议。" },
                { icon: "🎯", title: "明确目标", description: "确定您业务所需的品牌塑造阶段。" }
            ] : [
                { icon: "💬", title: "Expert opinion", description: "Personal advice." },
                { icon: "🎯", title: "Clear Goal", description: "Define branding steps." }
            ]))
        },
        strategy: {
            label: isUz ? "Brend-strategiya" : (isRu ? "Бренд-стратегия" : (isZh ? "品牌策略" : "Brand Strategy")),
            price: basePricesUSD.strategy,
            timeline: isUz ? "⏱ 20-30 ish kuni" : (isRu ? "⏱ 20-30 рабочих дней" : (isZh ? "⏱ 20-30 个工作日" : "⏱ 20-30 business days")),
            features: isUz ? ["Bozor va raqobat tahlili", "Maqsadli auditoriya xaritasi", "Brend platformasi", "Pozitsiyalash strategiyasi", "USP"] : (isRu ? ["Анализ рынка и конкурентов", "Карта целевой аудитории", "Платформа бренда", "Стратегия позиционирования", "УТП"] : (isZh ? ["市场分析", "受众地图", "品牌平台", "定位策略", "USP"] : ["Market analysis", "Audience map", "Brand platform", "Positioning", "USP"])),
            benefits: isUz ? [
                { icon: "📊", title: "Bozorda aniq o'rin", description: "Raqobatchilaringizdan qanday ajralib turishni aniq bilasiz." },
                { icon: "🚀", title: "Sotuvlar o'sishi", description: "To'g'ri pozitsiyalash mijozlar sonini oshiradi." }
            ] : (isRu ? [
                { icon: "📊", title: "Четкое место на рынке", description: "Вы будете точно знать, как выделиться среди конкурентов." },
                { icon: "🚀", title: "Рост продаж", description: "Правильное позиционирование увеличивает количество клиентов." }
            ] : (isZh ? [
                { icon: "📊", title: "市场定位", description: "明确如何在竞争中脱颖而出。" },
                { icon: "🚀", title: "销售增长", description: "正确的定位提高转化率。" }
            ] : [
                { icon: "📊", title: "Market Position", description: "Stand out." },
                { icon: "🚀", title: "Sales Growth", description: "Increase conversion." }
            ]))
        },
        commStrategy: {
            label: isUz ? "Kommunikatsion strategiya" : (isRu ? "Коммуникационная стратегия" : (isZh ? "传播策略" : "Communication Strategy")),
            price: basePricesUSD.commStrategy,
            timeline: isUz ? "⏱ 15-20 ish kuni" : (isRu ? "⏱ 15-20 рабочих дней" : (isZh ? "⏱ 15-20 个工作日" : "⏱ 15-20 business days")),
            features: isUz ? ["Brend ovozi (Tone of Voice)", "Asosiy xabarlar tizimi", "Media kanallar tanlovi", "Kontent rejasi tamoyillari"] : (isRu ? ["Голос бренда (Tone of Voice)", "Система ключевых сообщений", "Выбор медиа-каналов", "Принципы контент-плана"] : (isZh ? ["品牌语调", "核心信息系统", "媒体渠道选择", "内容计划原则"] : ["Tone of Voice", "Messaging", "Media channels", "Content plan"])),
            benefits: isUz ? [
                { icon: "📢", title: "Mijoz bilan til topishish", description: "Auditoriya bilan qaysi tilda gaplashishni belgilaysiz." },
                { icon: "🔗", title: "Yaxlit muloqot", description: "Barcha kanallarda brendingiz bir xil va kuchli yangraydi." }
            ] : (isRu ? [
                { icon: "📢", title: "Общий язык с клиентом", description: "Вы определите, на каком языке говорить с аудиторией." },
                { icon: "🔗", title: "Целостная коммуникация", description: "Ваш бренд будет звучать одинаково сильно во всех каналах." }
            ] : (isZh ? [
                { icon: "📢", title: "建立联系", description: "确定与受众沟通的语言。" },
                { icon: "🔗", title: "统一声音", description: "在所有渠道保持品牌一致性。" }
            ] : [
                { icon: "📢", title: "Connection", description: "Define language." },
                { icon: "🔗", title: "Unified Voice", description: "Sound consistent." }
            ]))
        },
        namingVIP: {
            label: "Naming VIP",
            price: basePricesUSD.namingVIP,
            timeline: isUz ? "⏱ 20–25 ish kuni" : (isRu ? "⏱ 20–25 рабочих дней" : (isZh ? "⏱ 20–25 个工作日" : "⏱ 20–25 business days")),
            features: isUz ? [
                "10 ta nom varianti tayyorlanadi",
                "Har bir nom uchun strategik izoh",
                "Nomning talaffuzi va esda qolishi tekshiruvi",
                "Domen bo'shligini tekshirish (.uz, .com)",
                "Social media username tekshiruvi",
                "O'zbekistonda patent tekshiruvi",
                "Raqobatchilar tahlili",
                "Linguistik tahlil (6 tilda)",
                "Hissiy ma'no tahlili",
                "3 ta shior varianti",
                "Patentga topshirish xizmati",
                "Mulkchilik sertifikati",
                "Cheksiz tahrirlash imkoniyati (30 kun)"
            ] : (isRu ? [
                "10 вариантов названий", "Стратегическое обоснование", "Проверка произношения", "Проверка доменов", "Проверка соцсетей", "Патентная проверка", "Анализ конкурентов", "Лингвистический анализ (6 языков)", "Анализ эмоций", "3 варианта слоганов", "Подача на патент", "Сертификат владения", "Безлимитные правки (30 дней)"
            ] : (isZh ? [
                "10个方案", "战略说明", "发音检查", "域名检查", "社交账号检查", "专利检查", "竞争分析", "语言分析", "情感分析", "3个口号", "专利服务", "证书", "30天无限修改"
            ] : ["10 concepts", "Strategy", "Phonetics", "Domain check", "Social check", "Patent check", "Competitor analysis", "Linguistics (6 lang)", "Emotional impact", "3 slogans", "Patent filing", "Certificate", "Unlimited revisions (30 days)"])),
            benefits: isUz ? [
                { icon: "🌍", title: "Global tayyor", description: "Nomingiz dunyo bo'ylab ishlaydi." },
                { icon: "🔒", title: "To'liq himoya", description: "Patent va sertifikat bilan nomingiz faqat sizniki." }
            ] : (isRu ? [
                { icon: "🌍", title: "Готов к миру", description: "Ваше имя работает глобально." },
                { icon: "🔒", title: "Полная защита", description: "Имя защищено патентом." }
            ] : (isZh ? [
                { icon: "🌍", title: "全球就绪", description: "名称全球通行。" },
                { icon: "🔒", title: "全面保护", description: "专利保护。" }
            ] : [
                { icon: "🌍", title: "Global Ready", description: "Works worldwide." },
                { icon: "🔒", title: "Full Protection", description: "Patent protected." }
            ]))
        },
        namingPremium: {
            label: "Naming Premium",
            price: basePricesUSD.namingPremium,
            recommended: true,
            timeline: isUz ? "⏱ 14–20 ish kuni" : (isRu ? "⏱ 14–20 рабочих дней" : (isZh ? "⏱ 14–20 个工作日" : "⏱ 14–20 business days")),
            features: isUz ? [
                "6 ta nom varianti tayyorlanadi",
                "Strategik izohlar",
                "Domen va Social media tekshiruvi",
                "O'zbekiston bazasida patent tekshiruvi",
                "Raqobatchilar tahlili",
                "Nomning hissiy ma'nosi",
                "3 ta tahrirlash imkoniyati"
            ] : (isRu ? [
                "6 вариантов названий", "Стратегические обоснования", "Проверка доменов и соцсетей", "Патентная проверка", "Анализ конкурентов", "Эмоциональный смысл", "3 правки"
            ] : (isZh ? [
                "6个方案", "战略说明", "域名和社交账号检查", "本地专利检查", "竞争分析", "情感意义", "3次修改"
            ] : ["6 concepts", "Strategy", "Digital check", "Local patent check", "Competitor analysis", "Emotional impact", "3 revisions"])),
            benefits: isUz ? [
                { icon: "⚖️", title: "Huquqiy xavfsizlik", description: "Patent to'qnashuvidan qutulasiz." },
                { icon: "🏆", title: "Noyoblik", description: "Raqobatchilaringizdan ajralib turasiz." }
            ] : (isRu ? [
                { icon: "⚖️", title: "Юр. безопасность", description: "Избежите патентных споров." },
                { icon: "🏆", title: "Уникальность", description: "Выделитесь среди конкурентов." }
            ] : (isZh ? [
                { icon: "⚖️", title: "法律安全", description: "避免纠纷。" },
                { icon: "🏆", title: "独特", description: "脱颖而出。" }
            ] : [
                { icon: "⚖️", title: "Legal Safety", description: "No conflicts." },
                { icon: "🏆", title: "Uniqueness", description: "Stand out." }
            ]))
        },
        namingStandard: {
            label: "Naming Standart",
            price: basePricesUSD.namingStandard,
            timeline: isUz ? "⏱ 7–10 ish kuni" : (isRu ? "⏱ 7–10 рабочих дней" : (isZh ? "⏱ 7–10 个工作日" : "⏱ 7–10 business days")),
            features: isUz ? ["3 ta nom varianti", "Qisqa izoh", "Domen tekshiruvi", "1 ta tahrir"] : (isRu ? ["3 варианта", "Краткое обоснование", "Проверка домена", "1 правка"] : (isZh ? ["3个方案", "简要说明", "域名检查", "1次修改"] : ["3 concepts", "Brief info", "Domain check", "1 revision"])),
            benefits: isUz ? [
                { icon: "⚡", title: "Tezkorlik", description: "Vaqt tejaysiz." },
                { icon: "✅", title: "Professional", description: "Tahlil qilingan nom olasiz." }
            ] : (isRu ? [
                { icon: "⚡", title: "Скорость", description: "Экономия времени." },
                { icon: "✅", title: "Профи", description: "Проанализированное имя." }
            ] : (isZh ? [
                { icon: "⚡", title: "快速", description: "节省时间。" },
                { icon: "✅", title: "专业", description: "经过分析。" }
            ] : [
                { icon: "⚡", title: "Speed", description: "Save time." },
                { icon: "✅", title: "Professional", description: "Analyzed name." }
            ]))
        },
        logoStandard: {
            label: isUz ? "Logo Standart" : (isRu ? "Логотип Стандарт" : (isZh ? "标准标志" : "Standard Logo")),
            price: basePricesUSD.logoStandard,
            timeline: isUz ? "⏱ 5 ish kuni" : (isRu ? "⏱ 5 рабочих дней" : (isZh ? "⏱ 5 个工作日" : "⏱ 5 business days")),
            features: isUz ? ["3 ta logo varianti", "Logo 4 xil ko'rinishda", "3 xil format (PNG, SVG, AI)", "8 ta aloqa nuqtasi", "2 ta tahrirlash"] : (isRu ? ["3 варианта", "4 вида логотипа", "3 формата", "8 точек контакта", "2 правки"] : (isZh ? ["3个方案", "4种样式", "3种格式", "8个接触点", "2次修改"] : ["3 concepts", "4 lockups", "3 formats", "8 touchpoints", "2 revisions"])),
            benefits: isUz ? [
                { icon: "🎯", title: "Tayyor", description: "Hamma joyda ishlatish mumkin." },
                { icon: "🛡️", title: "Mulk", description: "Fayllar to'liq sizniki." }
            ] : (isRu ? [
                { icon: "🎯", title: "Готов", description: "Можно использовать везде." },
                { icon: "🛡️", title: "Собственность", description: "Файлы ваши." }
            ] : (isZh ? [
                { icon: "🎯", title: "就绪", description: "全平台通用。" },
                { icon: "🛡️", title: "所有权", description: "文件归您。" }
            ] : [
                { icon: "🎯", title: "Ready", description: "Use anywhere." },
                { icon: "🛡️", title: "Ownership", description: "Files are yours." }
            ]))
        },
        logoPremium: {
            label: isUz ? "Logo + Firma Uslubi" : (isRu ? "Лого + Фирменный стиль" : (isZh ? "标志 + 企业形象" : "Logo + Visual Identity")),
            subDescription: isUz ? "Brendingizga mos firma uslubini (Vizual aydentika) ishlab chiqish kiradi." : (isRu ? "Включает разработку фирменного стиля бренда." : (isZh ? "包含企业形象开发。" : "Includes visual identity development.")),
            price: basePricesUSD.logoPremium,
            recommended: true,
            timeline: isUz ? "⏱ 10 ish kuni" : (isRu ? "⏱ 10 рабочих дней" : (isZh ? "⏱ 10 个工作日" : "⏱ 10 business days")),
            features: isUz ? ["4 ta logo varianti", "O'ziga xos firma uslubini ishlab chiqish", "3 xil format", "Rasmiy ranglar va shriftlar", "15 ta aloqa nuqtasi", "3 ta tahrirlash"] : (isRu ? ["4 варианта", "Разработка стиля", "3 формата", "Цвета и шрифты", "15 точек контакта", "3 правки"] : (isZh ? ["4个方案", "独特形象开发", "3种格式", "标准色和字体", "15个接触点", "3次修改"] : ["4 concepts", "Unique style development", "3 formats", "Colors & fonts", "15 touchpoints", "3 revisions"])),
            benefits: isUz ? [
                { icon: "🏆", title: "Professional", description: "Barcha joyda bir xil uslub." },
                { icon: "📈", title: "Qiymat", description: "Brend obro'si oshadi." }
            ] : (isRu ? [
                { icon: "🏆", title: "Профи", description: "Единый стиль везде." },
                { icon: "📈", title: "Ценность", description: "Рост престижа бренда." }
            ] : (isZh ? [
                { icon: "🏆", title: "专业", description: "风格统一。" },
                { icon: "📈", title: "价值", description: "提升品牌价值。" }
            ] : [
                { icon: "🏆", title: "Professional", description: "Consistent style." },
                { icon: "📈", title: "Value", description: "Increase prestige." }
            ]))
        },
        logoVIP: {
            label: isUz ? "Logo + Stil + Brandbook" : (isRu ? "Лого + Стиль + Брендбук" : (isZh ? "标志 + 形象 + 品牌手册" : "Logo + Style + Brandbook")),
            price: basePricesUSD.logoVIP,
            timeline: isUz ? "⏱ 15–20 ish kuni" : (isRu ? "⏱ 15–20 рабочих дней" : (isZh ? "⏱ 15–20 个工作日" : "⏱ 15–20 business days")),
            features: isUz ? [
                "5 ta logo varianti",
                "Strategik tahlil",
                "Brandbook (30-50 bet)",
                "Logo animatsiyasi (Motion)",
                "Telegram stiker paketi (10 ta)",
                "25 ta aloqa nuqtasi",
                "Mulkchilik sertifikati",
                "Patent topshirish xizmati",
                "Cheksiz tahrirlash imkoniyati (30 kun)",
                "Ijtimoiy tarmoqlar uchun dizayn (9 ta shablon)",
                "Vizitka va korporativ blanklar dizayni",
                "Bir yillik brending nazorati (support)",
                "Tashqi reklama (banner) dizayni"
            ] : (isRu ? [
                "5 вариантов логотипа", "Стратегический анализ", "Брендбук (30-50 стр)", "Анимация логотипа", "10 стикеров", "25 точек контакта", "Сертификат владения", "Подача на патент", "Безлимитные правки (30 дней)", "9 шаблонов для соцсетей", "Дизайн визиток и бланков", "Годовая поддержка", "Дизайн наружной рекламы"
            ] : (isZh ? [
                "5个方案", "战略分析", "品牌手册 (30-50页)", "标志动画", "10个社交贴纸", "25个接触点", "所有权证书", "专利服务", "无限修改", "9个社交媒体模板", "名片和信头", "一年的品牌支持", "户外广告设计"
            ] : ["5 concepts", "Strategic analysis", "Brandbook (30-50 pages)", "Logo animation", "10 stickers", "25 touchpoints", "Ownership cert", "Patent filing", "Unlimited revisions (30 days)", "9 social templates", "Business cards & letterheads", "1-year support", "Outdoor ads design"])),
            benefits: isUz ? [
                { icon: "📖", title: "Qo'llanma", description: "Istalgan dizayner to'g'ri ishlatadi." },
                { icon: "💎", title: "Sarmoya", description: "Bir marta to'g'ri investitsiya." }
            ] : (isRu ? [
                { icon: "📖", title: "Гайд", description: "Любой дизайнер поймет правила." },
                { icon: "💎", title: "Инвестиция", description: "Правильный вклад один раз." }
            ] : (isZh ? [
                { icon: "📖", title: "指南", description: "易于后续执行。" },
                { icon: "💎", title: "资产", description: "长久投资。" }
            ] : [
                { icon: "📖", title: "Guide", description: "Easy execution." },
                { icon: "💎", title: "Investment", description: "One-time smart asset." }
            ]))
        },
        packaging: { 
            label: isUz ? "Qadoq dizayni" : (isRu ? "Дизайн упаковки" : (isZh ? "包装设计" : "Packaging Design")), 
            price: basePricesUSD.packaging, 
            timeline: isUz ? "⏱ 10-15 ish kuni" : (isRu ? "⏱ 10-15 рабочих дней" : (isZh ? "⏱ 10-15 个工作日" : "⏱ 10-15 business days")),
            features: isUz ? ["Vizual konsepsiya", "3D namoyish", "Chop etish fayllari"] : (isRu ? ["Визуал", "3D визуализация", "Файлы для печати"] : (isZh ? ["视觉概念", "3D演示", "印刷文件"] : ["Visual concept", "3D Visualization", "Print files"])),
            benefits: isUz ? [
                { icon: "🎁", title: "Joziba", description: "Mijoz sotib olgisi keladi." },
                { icon: "🏢", title: "Farqlanish", description: "Javonda ajralib turasiz." }
            ] : (isRu ? [
                { icon: "🎁", title: "Привлекательность", description: "Захочется купить." },
                { icon: "🏢", title: "Отличие", description: "Выделитесь на полке." }
            ] : (isZh ? [
                { icon: "🎁", title: "吸引力", description: "产生购买欲。" },
                { icon: "🏢", title: "差异化", description: "货架脱颖而出。" }
            ] : [
                { icon: "🎁", title: "Attractive", description: "Sales magnet." },
                { icon: "🏢", title: "Stand Out", description: "Shelf differentiation." }
            ]))
        },
        smm: { 
            label: isUz ? "Instagram uchun stil" : (isRu ? "Стиль для Instagram" : (isZh ? "社交媒体风格" : "Social Media Style")), 
            price: basePricesUSD.smm, 
            timeline: isUz ? "⏱ 5-7 ish kuni" : (isRu ? "⏱ 5-7 рабочих дней" : (isZh ? "⏱ 5-7 个工作日" : "⏱ 5-7 business days")),
            features: isUz ? ["Bio dizayn", "9 ta post shabloni", "Story tizimi"] : (isRu ? ["Дизайн био", "9 шаблонов постов", "Стиль сторис"] : (isZh ? ["简介设计", "9个帖子模板", "故事系统"] : ["Bio design", "9 post templates", "Story system"])),
            benefits: isUz ? [
                { icon: "📱", title: "Tartib", description: "Professional sahifa." },
                { icon: "✨", title: "Oson", description: "Post tayyorlash tezlashadi." }
            ] : (isRu ? [
                { icon: "📱", title: "Порядок", description: "Профи-страница." },
                { icon: "✨", title: "Легкость", description: "Создание постов быстрее." }
            ] : (isZh ? [
                { icon: "📱", title: "有序", description: "专业主页。" },
                { icon: "✨", title: "简单", description: "快速创作内容。" }
            ] : [
                { icon: "📱", title: "Organized", description: "Trust building." },
                { icon: "✨", title: "Easy", description: "Fast content creation." }
            ]))
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
    const isRu = lang === 'ru';
    const isZh = lang === 'zh';
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
        const name = isUz ? 'Shoshilinch loyiha (+50%)' : (isRu ? 'Срочный проект (+50%)' : (isZh ? '加急项目 (+50%)' : 'Urgent (+50%)'));
        surchargesApplied.push({ name, value: val });
    }
    if (selectedServices.nda) {
        const val = basePrice * 0.5;
        surchargesTotal += val;
        const name = isUz ? 'NDA (Maxfiylik) (+50%)' : (isRu ? 'NDA (Конфиденциальность) (+50%)' : (isZh ? 'NDA (保密协议) (+50%)' : 'NDA (+50%)'));
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
        const name = isUz ? 'Ramazon chegirmasi (-30%)' : (isRu ? 'Скидка Рамадан (-30%)' : (isZh ? '斋月折扣 (-30%)' : 'Ramazon discount (-30%)'));
        discountsApplied.push({ name, value: val });
        finalPrice -= val;
    } else if (isSpecialPromo) {
        const val = totalBeforeDiscounts * 0.50;
        const name = isUz ? 'Maxsus chegirma (-50%)' : (isRu ? 'Специальная скидка (-50%)' : (isZh ? '特别折扣 (-50%)' : 'Special (-50%)'));
        discountsApplied.push({ name, value: val });
        finalPrice -= val;
    } else {
        if (discountType === 'package' && mainServicesCount >= 2) {
            const val = totalBeforeDiscounts * 0.20;
            const name = isUz ? 'Paketli chegirma (-20%)' : (isRu ? 'Пакетная скидка (-20%)' : (isZh ? '套餐折扣 (-20%)' : 'Package (-20%)'));
            discountsApplied.push({ name, value: val });
            finalPrice -= val;
        } else if (discountType === 'full') {
            if (mainServicesCount >= 2) {
                const packageVal = totalBeforeDiscounts * 0.20;
                const packageName = isUz ? 'Paketli chegirma (-20%)' : (isRu ? 'Пакетная скидка (-20%)' : (isZh ? '套餐折扣 (-20%)' : 'Package (-20%)'));
                discountsApplied.push({ name: packageName, value: packageVal });
                finalPrice -= packageVal;
                
                const upfrontVal = finalPrice * 0.10;
                const upfrontName = isUz ? "Oldindan to'lov (-10%)" : (isRu ? "Предоплата (-10%)" : (isZh ? "预付款 (-10%)" : "Upfront (-10%)"));
                discountsApplied.push({ name: upfrontName, value: upfrontVal });
                finalPrice -= upfrontVal;
            } else {
                const upfrontVal = totalBeforeDiscounts * 0.10;
                const upfrontName = isUz ? "Oldindan to'lov (-10%)" : (isRu ? "Предоплата (-10%)" : (isZh ? "预付款 (-10%)" : "Upfront (-10%)"));
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
    const isRu = lang === 'ru';
    const isZh = lang === 'zh';

    return [
        { 
            feature: isUz ? "Naming Premium" : (isRu ? "Нейминг Премиум" : (isZh ? "命名（高级版）" : "Naming Premium")), 
            competitors: { jon: "$980", mano: "$3,150", abba: "$3,000", mountain: "$2,750" } 
        },
        { 
            feature: isUz ? "Logo va firma uslubi" : (isRu ? "Логотип и фирменный стиль" : (isZh ? "标志和企业形象" : "Logo & Visual Identity")), 
            competitors: { jon: "$1,550", mano: "$6,450", abba: "$6,150", mountain: "$5,600" } 
        },
        { 
            feature: isUz ? "Qadoq dizayni" : (isRu ? "Дизайн упаковки" : (isZh ? "包装设计" : "Packaging Design")), 
            competitors: { jon: "$1,150", mano: "$9,450", abba: "$6,300", mountain: "$4,700" } 
        },
        { 
            feature: isUz ? "Brend-strategiya va platforma" : (isRu ? "Бренд-стратегия и платформа" : (isZh ? "品牌战略和平台" : "Brand Strategy & Platform")), 
            competitors: { jon: "$4,750", mano: "$18,900", abba: null, mountain: false } 
        },
        { 
            feature: isUz ? "Kommunikatsion strategiya" : (isRu ? "Коммуникационная стратегия" : (isZh ? "传播策略" : "Communication Strategy")), 
            competitors: { jon: "$3,950", mano: "$15,000", abba: null, mountain: false } 
        },
        { 
            feature: isUz ? "Ijtimoiy tarmoqlar uchun stil" : (isRu ? "Стиль для соцсетей" : (isZh ? "社交媒体视觉风格" : "Social Media Style")), 
            competitors: { jon: "$980", mano: "$3,500", abba: null, mountain: null } 
        },
        { 
            feature: isUz ? "100% Mamnuniyat Kafolati" : (isRu ? "100% Гарантия удовлетворенности" : (isZh ? "100% 满意保证" : "100% Satisfaction Guarantee")), 
            competitors: { jon: true, mano: false, abba: false, mountain: false } 
        },
        { 
            feature: isUz ? "Shaffof jarayon va doimiy aloqa" : (isRu ? "Прозрачный процесс и связь" : (isZh ? "透明的过程和沟通" : "Transparent Process & Communication")), 
            competitors: { jon: true, mano: true, abba: null, mountain: true } 
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
        const label = lang === 'uz' ? 'Promokod' : (lang === 'ru' ? 'Промокод' : (lang === 'zh' ? '优惠码' : 'Promo Code'));
        summary += ` (${label}: ${selections.promoCode})`;
    }
    if (selections.discountType === 'full') {
        const label = lang === 'uz' ? "100% Oldindan to'lov" : (lang === 'ru' ? "100% Предоплата" : (lang === 'zh' ? "100% 预付款" : "100% Upfront"));
        summary += ` (${label})`;
    }
    
    return summary;
};
