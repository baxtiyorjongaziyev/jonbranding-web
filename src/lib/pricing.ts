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
            description: isUz ? "Mavjud logotipni strategik tahlil qilish va tavsiyalar." : (isRu ? "Стратегический анализ и рекомендации по вашему существующему логотипу." : (isZh ? "对您现有标志的战略分析和建议。" : "Strategic analysis and recommendations for your existing logo.")),
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
            description: isUz ? "Brend nomini huquqiy va raqamli bazalarda tekshirish." : (isRu ? "Проверка названия бренда в юридических и цифровых базах." : (isZh ? "在法律和数字数据库中检查品牌名称可用性。" : "Checking brand name availability in legal and digital databases.")),
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
            description: isUz ? "Brending va biznesni upakovka qilish bo'yicha professional maslahat." : (isRu ? "Профессиональная консультация по брендингу и упаковке бизнеса." : (isZh ? "关于品牌塑造和商业包装的专业建议。" : "Professional advice on branding and business packaging.")),
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
            description: isUz ? "Biznesingiz uchun poydevor." : (isRu ? "Фундамент для вашего бизнеса." : (isZh ? "您业务的基础。" : "A foundation for your business.")),
            price: basePricesUSD.strategy,
            timeline: isUz ? "⏱ 20-30 ish kuni" : (isRu ? "⏱ 20-30 рабочих дней" : (isZh ? "⏱ 20-30 个工作日" : "⏱ 20-30 business days")),
            features: isUz ? ["Bozor va raqobat tahlili", "Maqsadli auditoriya xaritasi", "Brend platformasi", "Pozitsiyalash strategiyasi", "Noyob Sotuv Taklifi (USP)"] : (isRu ? ["Анализ рынка и конкурентов", "Карта целевой аудитории", "Платформа бренда", "Стратегия позиционирования", "Уникальное торговое предложение (УТП)"] : (isZh ? ["市场分析", "受众地图", "品牌平台", "定位策略", "独特销售主张 (USP)"] : ["Market analysis", "Audience map", "Brand platform", "Positioning", "USP"])),
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
            description: isUz ? "Mijozlar bilan muloqot va reklama tili." : (isRu ? "Язык общения с клиентами и рекламы." : (isZh ? "与客户沟通的语言和广告语言。" : "Communication and advertising language for customers.")),
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
            description: isUz ? "Nom emas — aktiv" : (isRu ? "Не просто имя — актив" : (isZh ? "不仅是名称，更是资产" : "Not just a name — an asset")),
            subDescription: isUz ? "Nom emas — aktiv" : (isRu ? "Не просто имя — актив" : (isZh ? "不仅仅是名称" : "Not just a name — an asset")),
            price: basePricesUSD.namingVIP,
            timeline: isUz ? "⏱ 20–25 ish kuni" : (isRu ? "⏱ 20–25 рабочих дней" : (isZh ? "⏱ 20–25 个工作日" : "⏱ 20–25 business days")),
            features: isUz ? [
                "10 ta nom varianti tayyorlanadi",
                "Har bir nom uchun strategik izoh",
                "Nomning talaffuzi, esda qolishi va jaranglashi tekshiruvi",
                "Domen bo'shligini tekshirish (.com, .uz)",
                "Instagram va Telegram username bo'shligini tekshirish",
                "O'zbekistonda va xalqaro bazalarda patent tekshiruvi",
                "Raqobatchilar nomlari tahlili — eng farqli pozitsiya",
                "Nom boshqa tillarda noqulay ma'no bermasligini tekshirish",
                "Nomning hissiy ma'nosi — mijoz ko'nglidagi taassurot",
                "3 ta qisqa shior varianti (masalan: Nike — 'Just Do It')",
                "Patentga topshirish xizmati (davlat bojlari alohida)",
                "Nom sizning mulkingiz ekanligini tasdiqlovchi sertifikat",
                "Cheksiz tuzatish (30 kun ichida)"
            ] : (isRu ? [
                "10 вариантов названий",
                "Стратегическое обоснование для каждого имени",
                "Проверка произношения и запоминаемости",
                "Проверка доменов (.com, .uz)",
                "Проверка юзернеймов в Instagram и Telegram",
                "Патентная проверка (Узбекистан и международные базы)",
                "Анализ имен конкурентов",
                "Лингвистический анализ на 6 языках",
                "Анализ эмоционального воздействия",
                "3 варианта коротких слоганов",
                "Услуга подачи на патент",
                "Сертификат владения именем",
                "Безлимитные правки (в течение 30 дней)"
            ] : (isZh ? [
                "10 个名称方案",
                "每个名称的战略说明",
                "发音、记忆和响亮度检查",
                "域名可用性检查 (.com, .uz)",
                "社交媒体用户名检查",
                "乌兹别克斯坦及国际专利检查",
                "竞争对手名称分析",
                "多语言含义检查",
                "情感影响力分析",
                "3 个短口号方案",
                "专利申请服务",
                "所有权证书",
                "30 天内无限次修改"
            ] : ["10 concepts", "Strategy", "Phonetics", "Domain check", "Social check", "Patent check", "Competitor analysis", "Linguistics", "Emotional impact", "3 slogans", "Patent filing", "Certificate", "Unlimited revisions"])),
            benefits: isUz ? [
                { icon: "🌍", title: "Xalqaro bozorga tayyor", description: "Nomingiz boshqa tillarda ham tekshiriladi — dunyo bo'ylab ishlaydi." },
                { icon: "🔒", title: "To'liq sizning mulkingiz", description: "Patent va sertifikat bilan nomingiz rasman himoyalanadi." },
                { icon: "💎", title: "Biznesingizga qiymat qo'shiladi", description: "Himoyalangan kuchli nom — kompaniya qiymatining bir qismi." },
                { icon: "🎯", title: "To'g'ri qaror qabul qilasiz", description: "Strategik tahlil asosida to'g'ri yo'lni belgilaymiz." }
            ] : (isRu ? [
                { icon: "🌍", title: "Готовность к мировому рынку", description: "Имя проверяется на других языках — работает по всему миру." },
                { icon: "🔒", title: "Полная собственность", description: "Ваше имя официально защищено патентом и сертификатом." },
                { icon: "💎", title: "Ценность для бизнеса", description: "Защищенное сильное имя — часть стоимости компании." },
                { icon: "🎯", title: "Верное решение", description: "Определяем правильный путь на основе стратегического анализа." }
            ] : (isZh ? [
                { icon: "🌍", title: "走向全球", description: "通过6种语言检查，通行世界。" },
                { icon: "🔒", title: "完全所有权", description: "受专利保护的资产。" },
                { icon: "💎", title: "商业价值", description: "受保护的名称是企业估值的一部分。" },
                { icon: "🎯", title: "专家决策", description: "基于战略分析的决策。" }
            ] : [
                { icon: "🌍", title: "Global Ready", description: "Check in 6 languages." },
                { icon: "🔒", title: "Full Ownership", description: "Protected by patent." },
                { icon: "💎", title: "Business Value", description: "Asset for valuation." },
                { icon: "🎯", title: "Expert Decision", description: "Strategy session." }
            ]))
        },
        namingPremium: {
            label: "Naming Premium",
            description: isUz ? "To'g'ri nom, to'g'ri asos" : (isRu ? "Правильное имя, правильная основа" : (isZh ? "正确的名称，正确的基础" : "Right name, right foundation")),
            subDescription: isUz ? "To'g'ri nom, to'g'ri asos" : (isRu ? "Правильное имя, правильная основа" : (isZh ? "正确的基础" : "Right name, right foundation")),
            price: basePricesUSD.namingPremium,
            recommended: true,
            timeline: isUz ? "⏱ 14–20 ish kuni" : (isRu ? "⏱ 14–20 рабочих дней" : (isZh ? "⏱ 14–20 个工作日" : "⏱ 14–20 business days")),
            features: isUz ? [
                "6 ta nom varianti tayyorlanadi",
                "Har bir nom uchun strategik izoh",
                "Nomning talaffuzi, esda qolishi va jaranglashi tekshiruvi",
                "Domen bo'shligini tekshirish (.com, .uz)",
                "Instagram va Telegram username bo'shligini tekshirish",
                "O'zbekiston bazasida patent tekshiruvi",
                "Raqobatchilar nomlari tahlili",
                "Nomning hissiy ma'nosi va mijozga ta'siri",
                "3 ta tuzatish imkoniyati"
            ] : (isRu ? [
                "6 вариантов названий",
                "Стратегическое обоснование для каждого имени",
                "Проверка произношения и запоминаемости",
                "Проверка доменов (.com, .uz)",
                "Проверка юзернеймов в Instagram и Telegram",
                "Патентная проверка по базе Узбекистана",
                "Анализ имен конкурентов",
                "Анализ эмоционального воздействия",
                "3 возможности внесения правок"
            ] : (isZh ? [
                "6 个名称方案",
                "战略说明",
                "发音和记忆检查",
                "域名及社交媒体检查",
                "本地专利检查",
                "竞争对手分析",
                "情感影响力",
                "3 次修改机会"
            ] : ["6 concepts", "Strategy", "Phonetics", "Domain/Social check", "Local patent check", "Competitor analysis", "Emotional impact", "3 revisions"])),
            benefits: isUz ? [
                { icon: "⚖️", title: "Huquqiy xavfsizlik", description: "Kimdir nomingizni oldin patent qilmaganligini tekshiramiz." },
                { icon: "🏆", title: "Raqobatdan ajralib turasiz", description: "Bozordagi o'xshash nomlarni tahlil qilib, unikal nom find qilamiz." },
                { icon: "❤️", title: "Mijozlar yaxshi ko'radi", description: "Nomga his-tuyg'u yuklanadi — mijozlar eslab qoladi." },
                { icon: "📈", title: "Brendingiz kuchli boshlanadi", description: "Kuchli nom marketing xarajatlarini sezilarli kamaytiradi." }
            ] : (isRu ? [
                { icon: "⚖️", title: "Юридическая безопасность", description: "Мы проверяем, не запатентовал ли кто-то ваше имя ранее." },
                { icon: "🏆", title: "Отличие от конкурентов", description: "Анализируем похожие имена на рынке и находим уникальное решение." },
                { icon: "❤️", title: "Любовь клиентов", description: "Имя наделяется эмоциями — клиенты его запоминают." },
                { icon: "📈", title: "Сильный старт бренда", description: "Сильное имя значительно снижает расходы на маркетинг." }
            ] : (isZh ? [
                { icon: "⚖️", title: "法律安全", description: "避免冲突。" },
                { icon: "🏆", title: "脱颖而出", description: "独特名称。" },
                { icon: "❤️", title: "客户喜爱", description: "产生持久影响。" },
                { icon: "📈", title: "强力开启", description: "降低营销成本。" }
            ] : [
                { icon: "⚖️", title: "Legal Safety", description: "Avoid conflicts." },
                { icon: "🏆", title: "Stand Out", description: "Unique name." },
                { icon: "❤️", title: "Customer Love", description: "Memorable impact." },
                { icon: "📈", title: "Strong Start", description: "Lower marketing cost." }
            ]))
        },
        namingStandard: {
            label: "Naming Standart",
            description: isUz ? "Tez va ishonchli start" : (isRu ? "Быстрый и надежный старт" : (isZh ? "快速可靠的开启" : "Fast and reliable start")),
            subDescription: isUz ? "Tez va ishonchli start" : (isRu ? "Быстрый и надежный старт" : (isZh ? "快速开启" : "Fast and reliable start")),
            price: basePricesUSD.namingStandard,
            timeline: isUz ? "⏱ 7–10 ish kuni" : (isRu ? "⏱ 7–10 рабочих дней" : (isZh ? "⏱ 7–10 个工作日" : "⏱ 7–10 business days")),
            features: isUz ? [
                "3 ta nom varianti tayyorlanadi",
                "Har bir nom uchun qisqa izoh",
                "Nomning talaffuzi qulay va esda qolishi tekshiriladi",
                "Domen bo'shligini tekshirish (.com, .uz)",
                "Instagram va Telegram username bo'shligini tekshirish",
                "1 ta tuzatish imkoniyati"
            ] : (isRu ? [
                "3 варианта названий",
                "Краткое обоснование для каждого имени",
                "Проверка на удобство произношения и запоминаемость",
                "Проверка доменов (.com, .uz)",
                "Проверка юзернеймов в Instagram и Telegram",
                "1 возможность внесения правок"
            ] : (isZh ? [
                "3 个方案",
                "简要说明",
                "记忆测试",
                "域名及社交媒体检查",
                "1 次修改机会"
            ] : ["3 concepts", "Brief info", "Recall test", "Domain/Social check", "1 revision"])),
            benefits: isUz ? [
                { icon: "🛡️", title: "Xavfli nomdan qutulasiz", description: "Esda qolmaydigan yoki noto'g'ri talaffuz nom mijoz yo'qotadi." },
                { icon: "⚡", title: "Vaqt tejaysiz", description: "Yuzlab nom o'ylab o'tirmasdan, professional nom olasiz." },
                { icon: "✅", title: "Ishonch bilan boshlaysiz", description: "Tahlil qilingan, tekshirilgan nom qo'lingizda bo'ladi." },
                { icon: "📱", title: "Digital tayyor bo'lasiz", description: "Domen va social media username band emasligini bilasiz." }
            ] : (isRu ? [
                { icon: "🛡️", title: "Избежите рискованных имен", description: "Труднопроизносимые или незапоминающиеся имена ведут к потере клиентов." },
                { icon: "⚡", title: "Экономия времени", description: "Вам не нужно перебирать сотни имен самим — вы получаете профессиональный результат." },
                { icon: "✅", title: "Уверенный старт", description: "У вас на руках будет проанализированное и проверенное имя." },
                { icon: "📱", title: "Готовность к Digital", description: "Вы будете знать, что домен и юзернеймы свободны." }
            ] : (isZh ? [
                { icon: "🛡️", title: "无风险", description: "避免糟糕的名字。" },
                { icon: "⚡", title: "节省时间", description: "快速获得结果。" },
                { icon: "✅", title: "信赖", description: "经过验证的名称。" },
                { icon: "📱", title: "数字化就绪", description: "社交媒体已准备就绪。" }
            ] : [
                { icon: "🛡️", title: "Risk Free", description: "Avoid bad names." },
                { icon: "⚡", title: "Save Time", description: "Fast results." },
                { icon: "✅", title: "Trust", description: "Verified name." },
                { icon: "📱", title: "Digital Ready", description: "Socials ready." }
            ]))
        },
        logoStandard: {
            label: isUz ? "Logo Standart" : (isRu ? "Логотип Стандарт" : (isZh ? "标准标志" : "Standard Logo")),
            description: isUz ? "Logom tayyor bo'lsin" : (isRu ? "Мой логотип готов" : (isZh ? "标志已就绪" : "Logo ready to go")),
            subDescription: isUz ? "Endigina boshlamoqchi bo'lganlar uchun" : (isRu ? "Для тех, кто только начинает" : (isZh ? "适合刚起步的客户" : "For those just starting out")),
            price: basePricesUSD.logoStandard,
            timeline: isUz ? "⏱ 5 ish kuni" : (isRu ? "⏱ 5 рабочих дней" : (isZh ? "⏱ 5 个工作日" : "⏱ 5 business days")),
            features: isUz ? [
                "3 ta logo varianti tayyorlanadi — uchtalasidan birini tanlaysiz",
                "Har bir variant uchun izoh beriladi",
                "Logo 4 xil ko'rinishda (Gorizontal, Vertikal, Oq-qora, Belgi)",
                "Instagram va Telegram uchun profil rasmi",
                "3 xil fayl formatida (PNG, SVG, AI)",
                "8 ta aloqa nuqtasi (vizitka, profil, sayt, qadoq, peshlavha, forma, banner, email imzo)",
                "2 ta tuzatish imkoniyati"
            ] : (isRu ? [
                "3 варианта логотипа — выбираете один из трех",
                "Обоснование для каждого варианта",
                "Логотип в 4 видах (Горизонтальный, Вертикальный, Ч/Б, Знак)",
                "Фото профиля для Instagram и Telegram",
                "В 3 форматах (PNG, SVG, AI)",
                "8 точек контакта (визитка, профиль, сайт, упаковка и т.д.)",
                "2 возможности внесения правок"
            ] : (isZh ? [
                "3 个方案 - 选其一",
                "设计理念说明",
                "4 种组合方式",
                "社交媒体头像",
                "3 种格式",
                "8 个接触点展示",
                "2 次修改机会"
            ] : ["3 concepts", "Reasoning", "4 lockups", "Social pics", "3 formats", "8 touchpoints", "2 revisions"])),
            benefits: isUz ? [
                { icon: "🎯", title: "Hamma joyga tayyor", description: "Sayt, Instagram, chop etish — logongiz barcha formatda tayyor." },
                { icon: "✅", title: "Ishonch uyg'otadi", description: "Professional ko'rinish — o'zingiz yasaganga o'xshamaydi." },
                { icon: "👁️", title: "Real ko'rinish", description: "8 ta joyda logongiz qanday ko'rinishini ko'razsiz." },
                { icon: "🛡️", title: "Fayllar to'liq sizniki", description: "Barcha fayllar sizga topshiriladi." }
            ] : (isRu ? [
                { icon: "🎯", title: "Готов ко всему", description: "Сайт, Instagram, печать — ваш логотип готов во всех форматах." },
                { icon: "✅", title: "Вызывает доверие", description: "Профессиональный вид — не выглядит как самодельный." },
                { icon: "👁️", title: "Реальное видение", description: "Увидите, как логотип смотрится в 8 различных местах." },
                { icon: "🛡️", title: "Файлы полностью ваши", description: "Все исходники передаются вам в собственность." }
            ] : (isZh ? [
                { icon: "🎯", title: "全平台就绪", description: "适用于印刷和网络。" },
                { icon: "✅", title: "专业感", description: "建立即时信任。" },
                { icon: "👁️", title: "真实呈现", description: "8个场景展示。" },
                { icon: "🛡️", title: "完全所有权", description: "交付源文件。" }
            ] : [
                { icon: "🎯", title: "Ready everywhere", description: "Print & Web." },
                { icon: "✅", title: "Professional", description: "Instant trust." },
                { icon: "👁️", title: "Visualization", description: "8 locations." },
                { icon: "🛡️", title: "Full Ownership", description: "Source files." }
            ]))
        },
        logoPremium: {
            label: isUz ? "Logo + Firma Uslubi" : (isRu ? "Лого + Фирменный стиль" : (isZh ? "标志 + 企业形象" : "Logo + Visual Identity")),
            description: isUz ? "Brendingizga mos firma uslubini (Vizual aydentika) ishlab chiqish kiradi." : (isRu ? "Включает разработку фирменного стиля (Визуальная айдентика), подходящего вашему бренду." : (isZh ? "包括为您品牌量身定制的企业形象设计（视觉识别）。" : "Development of visual identity consistent with your brand")),
            subDescription: isUz ? "Brendingizga mos firma uslubini (Vizual aydentika) ishlab chiqish kiradi." : (isRu ? "Включает разработку фирменного стиля (Визуальная айдентика), подходящего вашему бренду." : (isZh ? "量身定制的形象设计" : "For those planning growth")),
            price: basePricesUSD.logoPremium,
            recommended: true,
            timeline: isUz ? "⏱ 10 ish kuni" : (isRu ? "⏱ 10 рабочих дней" : (isZh ? "⏱ 10 个工作日" : "⏱ 10 business days")),
            features: isUz ? [
                "4 ta logo varianti tayyorlanadi — to'rttasidan birini tanlaysiz",
                "Har bir variant uchun izoh beriladi",
                "Logo 4 xil ko'rinishda + Profil rasmlari",
                "3 xil fayl formatida (PNG, SVG, AI)",
                "Rasmiy ranglar to'plami (aniq kodlari bilan)",
                "Rasmiy shrift — brendingizning yagona uslubi",
                "O'ziga xos firma uslubini ishlab chiqish",
                "15 ta aloqa nuqtasi (SMM postlar, storislar, prezentatsiya, konvert, sumka, avto-brendlash va h.k.)",
                "3 ta tuzatish imkoniyati"
            ] : (isRu ? [
                "4 варианта логотипа — выбираете один из четырех",
                "Обоснование для каждого варианта",
                "Логотип в 4 видах + Фото профиля",
                "В 3 форматах (PNG, SVG, AI)",
                "Официальная цветовая палитра (с кодами)",
                "Официальный шрифт — единый стиль бренда",
                "Разработка уникального фирменного стиля",
                "15 точек контакта (SMM, презентация, пакеты и т.д.)",
                "3 возможности внесения правок"
            ] : (isZh ? [
                "4 个标志方案 - 选其一",
                "方案说明",
                "4 种组合方式 + 头像",
                "3 种格式 (PNG, SVG, AI)",
                "官方调色板 (附代码)",
                "官方字体系统",
                "独特的企业形象开发",
                "15 个接触点展示 (社交媒体, 包装等)",
                "3 次修改机会"
            ] : ["4 concepts", "Reasoning", "4 lockups", "3 formats", "Color palette", "Official fonts", "Unique style development", "15 touchpoints", "3 revisions"])),
            benefits: isUz ? [
                { icon: "🏆", title: "Professional qiyofa", description: "Sayt, Instagram, vizitka — hammasi bir xil professional uslubda." },
                { icon: "💼", title: "Xodimlaringiz ham to'g'ri ishlatadi", description: "Aniq qoidalar bo'lgach, hech kim adashmaydi." },
                { icon: "📸", title: "15 ta joyda vizual kafolat", description: "Har bir joyda brendingiz qanday ko'rinishi aniq bo'ladi." },
                { icon: "📈", title: "Brend qiymati oshadi", description: "Izchil ko'rinish — professional biznes belgisi." }
            ] : (isRu ? [
                { icon: "🏆", title: "Профессиональный облик", description: "Сайт, Instagram, визитка — все в едином профессиональном стиле." },
                { icon: "💼", title: "Сотрудники будут использовать правильно", description: "С четкими правилами никто не ошибется." },
                { icon: "📸", title: "Визуальная гарантия в 15 местах", description: "Будет точно ясно, как бренд выглядит на каждом носителе." },
                { icon: "📈", title: "Ценность бренда растет", description: "Последовательный облик — признак профессионального бизнеса." }
            ] : (isZh ? [
                { icon: "🏆", title: "品牌一致性", description: "统一的视觉风格。" },
                { icon: "💼", title: "团队规范", description: "清晰的使用规则。" },
                { icon: "📸", title: "全方位验证", description: "15个接触点展示。" },
                { icon: "📈", title: "提升估值", description: "专业的商业资产。" }
            ] : [
                { icon: "🏆", title: "Consistent", description: "Uniform style." },
                { icon: "💼", title: "Team Ready", description: "Clear bureaucratic rules." },
                { icon: "📸", title: "Verified", description: "15 touchpoints." },
                { icon: "📈", title: "Valuation", description: "Business asset." }
            ]))
        },
        logoVIP: {
            label: isUz ? "Logo + Stil + Brandbook" : (isRu ? "Лого + Стиль + Брендбук" : (isZh ? "标志 + 形象 + 品牌手册" : "Logo + Style + Brandbook")),
            description: isUz ? "Hamma narsani bir marta to'g'ri qiling" : (isRu ? "Сделайте все правильно один раз" : (isZh ? "一次到位，终身受用" : "Do everything right once")),
            subDescription: isUz ? "Jiddiy investitsiya qiladiganlar uchun" : (isRu ? "Для серьезных инвесторов" : (isZh ? "适合长期投资者" : "For serious investors")),
            price: basePricesUSD.logoVIP,
            timeline: isUz ? "⏱ 15–20 ish kuni" : (isRu ? "⏱ 15–20 рабочих дней" : (isZh ? "⏱ 15–20 个工作日" : "⏱ 15–20 business days")),
            features: isUz ? [
                "5 ta logo varianti — beshtasidan birini tanlaysiz",
                "Har bir variant uchun chuqur strategik izoh",
                "Logo 4 xil ko'rinishda + Profil rasmlari",
                "3 xil fayl formatida (PNG, SVG, AI)",
                "Rasmiy ranglar to'plami — brendingizning 3–5 ta rasmiy rangi va ularning aniq kodi",
                "Rasmiy shrift — brendingizda ishlatiladigan harflar uslubi",
                "Brandbook — brenddan foydalanish bo'yicha to'liq qo'llanma (30-50 bet)",
                "Logotip animatsiyasi (Motion design)",
                "Telegram stikerlar to'plami (10 ta)",
                "25 ta aloqa nuqtasi (mobil ilova, billbord, merch, ofis dizayni, ko'rgazma stendi, motion-reklama va h.k.)",
                "Logoning to'liq mulkchilik huquqi sertifikat",
                "Patent topshirish xizmati",
                "Cheksiz tuzatish (30 kun ichida)"
            ] : (isRu ? [
                "5 вариантов логотипа — выбираете один из пяти",
                "Глубокое стратегическое обоснование каждого варианта",
                "Логотип в 4 видах + Фото профиля",
                "В 3 форматах (PNG, SVG, AI)",
                "Официальная палитра — 3-5 цветов с кодами",
                "Официальный шрифт — уникальный стиль букв",
                "Брендбук — полное руководство по использованию (30-50 стр.)",
                "Анимация логотипа (Motion design)",
                "Набор стикеров для Telegram (10 шт.)",
                "25 точек контакта (приложение, билборд, мерч и т.д.)",
                "Сертификат о праве полной собственности",
                "Услуга подачи на патент",
                "Безлимитные правки (в течение 30 дней)"
            ] : (isZh ? [
                "5 个方案 - 选其一",
                "深度战略说明",
                "4 种组合方式 + 头像",
                "3 种格式 (PNG, SVG, AI)",
                "官方调色板 (3-5 种颜色及代码)",
                "官方字体系统",
                "完整品牌手册 (30-50 页)",
                "标志动画 (动态设计)",
                "10 个 Telegram 贴纸",
                "25 个接触点展示 (移动应用, 户外广告等)",
                "所有权证书",
                "专利申请服务",
                "30 天内无限次修改"
            ] : ["5 concepts", "Deep strategy", "4 lockups", "3 formats", "Color palette", "Official fonts", "Full Brandbook", "Logo animation", "10 stickers", "25 touchpoints", "Ownership cert", "Patent filing", "Unlimited revisions"])),
            benefits: isUz ? [
                { icon: "📖", title: "Istalgan odamga topshiring", description: "Dizayner yoki SMMchi qo'llanmani o'qib to'g'ri ishlatadi." },
                { icon: "🔒", title: "Abadiy sifat", description: "Hamma qoidalar yozilgan — brendingiz 10 yildan keyin ham kuchli qoladi." },
                { icon: "🌍", title: "Xalqaro standart", description: "Investor yoki hamkor ko'rsa — jiddiy kompaniya ekanini his qiladi." },
                { icon: "💎", title: "Oqilona sarmoya", description: "Har yili rebranding o'rniga — bir marta to'g'ri investitsiya." }
            ] : (isRu ? [
                { icon: "📖", title: "Легкая передача", description: "Любой дизайнер или SMM-специалист поймет правила из руководства." },
                { icon: "🔒", title: "Качество навсегда", description: "Все правила прописаны — бренд останется сильным и через 10 лет." },
                { icon: "🌍", title: "Международный стандарт", description: "Инвесторы и партнеры увидят уровень серьезной компании." },
                { icon: "💎", title: "Разумная инвестиция", description: "Вместо ежегодного ребрендинга — одна правильная инвестиция." }
            ] : (isZh ? [
                { icon: "📖", title: "易于交接", description: "新手也能快速上手。" },
                { icon: "🔒", title: "持久价值", description: "10年以上的使用价值。" },
                { icon: "🌍", title: "国际标准", description: "展现大企业风范。" },
                { icon: "💎", title: "明智资产", description: "一次性正确投资。" }
            ] : [
                { icon: "📖", title: "Transferable", description: "Easy handover." },
                { icon: "🔒", title: "Lasting", description: "10+ years value." },
                { icon: "🌍", title: "Global", description: "Standard quality." },
                { icon: "💎", title: "Smart Asset", description: "One-time investment." }
            ]))
        },
        packaging: { 
            label: isUz ? "Qadoq dizayni" : (isRu ? "Дизайн упаковки" : (isZh ? "包装设计" : "Packaging Design")), 
            description: isUz ? "Mahsulotingizning javondagi asosiy qurboni." : (isRu ? "Ваше главное оружие на полке магазина." : (isZh ? "您在货架上的核心竞争力。" : "Your product's main weapon on the shelf.")),
            price: basePricesUSD.packaging, 
            timeline: isUz ? "⏱ 10-15 ish kuni" : (isRu ? "⏱ 10-15 рабочих дней" : (isZh ? "⏱ 10-15 个工作日" : "⏱ 10-15 business days")),
            features: isUz ? ["Vizual konsepsiya", "Qadoqni 3D namoyish qilish", "Chop etishga tayyor fayllar", "Materiallar bo'yicha tavsiyalar"] : (isRu ? ["Визуальная концепция", "3D визуализация упаковки", "Файлы, готовые к печати", "Рекомендации по материалам"] : (isZh ? ["视觉概念", "3D 演示", "印刷文件", "材质建议"] : ["Visual concept", "3D Visualization", "Print files", "Material tips"])),
            benefits: isUz ? [
                { icon: "🎁", title: "Jozibador qadoq", description: "Mijoz mahsulotingizni ushlab ko'rgisi va sotib olgisi keladi." },
                { icon: "🏢", title: "Bozorda farqlanish", description: "Raqobatchilardan vizual jihatdan keskin ajralib turasiz." }
            ] : (isRu ? [
                { icon: "🎁", title: "Привлекательная упаковка", description: "Клиент захочет взять товар в руки и купить его." },
                { icon: "🏢", title: "Отличие на рынке", description: "Вы будете резко выделяться среди конкурентов на полке." }
            ] : (isZh ? [
                { icon: "🎁", title: "吸睛包装", description: "让产品自己会说话。" },
                { icon: "🏢", title: "货架差异化", description: "脱颖而出。" }
            ] : [
                { icon: "🎁", title: "Attractive", description: "Sales magnet." },
                { icon: "🏢", title: "Stand Out", description: "Shelf differentiation." }
            ]))
        },
        smm: { 
            label: isUz ? "Instagram uchun stil" : (isRu ? "Стиль для Instagram" : (isZh ? "社交媒体视觉风格" : "Social Media Style")), 
            description: isUz ? "Sahifangizni tartibli va brendga mos qilish." : (isRu ? "Сделайте вашу страницу упорядоченной и соответствующей бренду." : (isZh ? "使您的页面井然有序并保持品牌一致性。" : "Make your page organized and brand-consistent.")),
            price: basePricesUSD.smm, 
            timeline: isUz ? "⏱ 5-7 ish kuni" : (isRu ? "⏱ 5-7 рабочих дней" : (isZh ? "⏱ 5-7 个工作日" : "⏱ 5-7 business days")),
            features: isUz ? ["Profil rasmi va bio dizayni", "9 ta post uchun shablon", "Storislar uchun dizayn tizimi", "Highlight ikonkalari"] : (isRu ? ["Дизайн фото профиля и био", "Шаблоны для 9 постов", "Дизайн-система для сторис", "Иконки актуального"] : (isZh ? ["个人资料/简介设计", "9 个帖子模板", "故事设计系统", "高光图标"] : ["Bio/Profile design", "9 post templates", "Story system", "Highlight icons"])),
            benefits: isUz ? [
                { icon: "📱", title: "Tartibli sahifa", description: "Instagram profilingiz professional va ishonchli ko'rinadi." },
                { icon: "✨", title: "Oson kontent", description: "Tayyor shablonlar bilan post tayyorlash 2 barobar tezlashadi." }
            ] : (isRu ? [
                { icon: "📱", title: "Упорядоченная страница", description: "Ваш Instagram будет выглядеть профессионально и надежно." },
                { icon: "✨", title: "Легкий контент", description: "Создание постов с готовыми шаблонами ускорится в 2 раза." }
            ] : (isZh ? [
                { icon: "📱", title: "井然有序", description: "建立信任感。" },
                { icon: "✨", title: "高效创作", description: "提升创作速度。" }
            ] : [
                { icon: "📱", title: "Organized", description: "Trust building." },
                { icon: "✨", title: "Easy", description: "Fast content creation." }
            ]))
        },
        urgency: { 
            label: isUz ? "Shoshilinch loyiha" : (isRu ? "Срочный проект" : (isZh ? "加急项目" : "Urgent Project")), 
            description: isUz ? "Loyihangizni navbatsiz va tezkor tayyorlab berish." : (isRu ? "Выполнение вашего проекта вне очереди и в кратчайшие сроки." : (isZh ? "插队并加速交付您的项目。" : "Expedited delivery ahead of queue.")),
            price: 0,
            timeline: isUz ? "⏱ 2-3 barobar tezroq" : (isRu ? "⏱ в 2-3 раза быстрее" : (isZh ? "⏱ 快 2-3 倍" : "⏱ 2-3x faster")),
            features: isUz ? ["Ishchi guruhni safarbar qilish", "Dam olish kunlarisiz ishlash", "Muddati 2-3 barobarga qisqaradi", "Loyiha birinchi darajali ustuvorlikda bo'ladi"] : (isRu ? ["Мобилизация рабочей группы", "Работа без выходных", "Срок сокращается в 2-3 раза", "Проект будет в приоритете №1"] : (isZh ? ["动员团队", "全天候工作", "交付速度提升", "最高优先级"] : ["Mobilization", "24/7 work", "Fast delivery", "Top priority"])),
            benefits: isUz ? [
                { icon: "🚀", title: "Vaqtdan yutasiz", description: "Bozorga raqobatchilardan tezroq kirib borasiz." },
                { icon: "🔥", title: "Prioritet", description: "Sizning loyihangiz biz uchun birinchi darajali." }
            ] : (isRu ? [
                { icon: "🚀", title: "Выигрываете время", description: "Выйдете на рынок быстрее конкурентов." },
                { icon: "🔥", title: "Приоритет", description: "Ваш проект будет для нас на первом месте." }
            ] : (isZh ? [
                { icon: "🚀", title: "节省时间", description: "快速抢占市场。" },
                { icon: "🔥", title: "优先级", description: "核心关注点。" }
            ] : [
                { icon: "🚀", title: "Save Time", description: "Speed to market." },
                { icon: "🔥", title: "Priority", description: "Number 1 focus." }
            ]))
        },
        nda: { 
            label: isUz ? "NDA — Maxfiylik" : (isRu ? "NDA — Конфиденциальность" : (isZh ? "NDA — 保密协议" : "NDA — Confidentiality")), 
            description: isUz ? "Loyihangiz ma'lumotlari sir saqlanishini kafolatlash." : (isRu ? "Гарантия сохранения тайны данных вашего проекта." : (isZh ? "保证项目数据的机密性。" : "Confidentiality guaranteed.")),
            price: 0,
            timeline: isUz ? "⏱ Darhol kuchga kiradi" : (isRu ? "⏱ Вступает в силу немедленно" : (isZh ? "⏱ 立即生效" : "⏱ Immediate")),
            features: isUz ? ["Yuridik shartnoma (NDA)", "Ma'luotlar uchinchi shaxsga berilmaydi", "Portfolioga qo'yilmaydi", "Barcha qidiruv bazalaridan maxfiylik"] : (isRu ? ["Юридический договор (NDA)", "Данные не передаются третьим лицам", "Проект не выставляется в портфолио", "Скрыто от всех поисковых баз"] : (isZh ? ["法律协议 (NDA)", "严禁分享", "不录入作品集", "隐私保护"] : ["Legal agreement", "No sharing", "No portfolio", "Private"])),
            benefits: isUz ? [
                { icon: "🔒", title: "Maxfiylik", description: "Biznes sirlaringiz biz bilan xavfsiz." },
                { icon: "🛡️", title: "Xavfsizlik", description: "Ma'lumotlar to'liq himoyalangan." }
            ] : (isRu ? [
                { icon: "🔒", title: "Секретность", description: "Ваши бизнес-секреты в безопасности с нами." },
                { icon: "🛡️", title: "Безопасность", description: "Данные полностью защищены." }
            ] : (isZh ? [
                { icon: "🔒", title: "隐私", description: "您的商业秘密很安全。" },
                { icon: "🛡️", title: "安全", description: "全面保护。" }
            ] : [
                { icon: "🔒", title: "Privacy", description: "Business secrets safe." },
                { icon: "🛡️", title: "Security", description: "Full protection." }
            ]))
        }
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
