

const USD_TO_UZS_RATE = 12700;

const convertToUzs = (usd: number) => {
    if (usd === 0) return 0;
    // Round to nearest 100,000 UZS for cleaner pricing
    return Math.round(usd * USD_TO_UZS_RATE / 100000) * 100000;
}

const basePricesUSD = {
    audit: 59,
    namingCheck: 79,
    consultation: 51,
    strategy: 4750,
    commStrategy: 3950,
    namingStandard: 650,
    namingPremium: 980,
    namingVIP: 1450,
    logoStandard: 780,
    logoPremium: 1550,
    logoVIP: 2950,
    packaging: 1150,
    smm: 980,
    merch: 0,
    illustrations: 0,
    urgency: 0,
    nda: 0,
};


const uzServiceDetails = {
    audit: {
        label: "Logo Auditi",
        description: "Mavjud logotipni tahlil qilish va yaxshilash bo'yicha tavsiyalar.",
        price: basePricesUSD.audit,
        oldPrice: 118,
        discount: 0.5,
        note: null,
        features: [
            { feature: "Logotipning kuchli va zaif tomonlari", benefit: "Brendingizni qayerda kuchaytirish kerakligini aniq bilib olasiz." },
            { feature: "Raqobatchilarga nisbatan tahlil", benefit: "Bozorda qanday ajralib turish mumkinligi haqida tushunchaga ega bo'lasiz." },
            { feature: "Yaxshilash bo'yicha aniq tavsiyalar", benefit: "Keyingi qadamlaringiz aniq va tushunarli bo'ladi, taxminlarga asoslanib pul sarflamaysiz." }
        ],
        benefits: ["Brendingizni kuchaytirish uchun aniq yo'l-yo'riq oling", "Raqobatchilardan qanday ajralib turishni tushuning"]
    },
    namingCheck: {
        label: "Neyming Tekshiruvi",
        description: "Brend nomining O'zbekiston va xalqaro bazalarda bo'shligini tekshirish.",
        price: basePricesUSD.namingCheck,
        oldPrice: 158,
        discount: 0.5,
        note: null,
        features: [
            { feature: "O'zbekiston bazasi bo'yicha tekshiruv", benefit: "Mahalliy bozorda huquqiy muammolarning oldini olasiz." },
            { feature: "Xalqaro WIPO bazasi bo'yicha tekshiruv", benefit: "Xalqaro miqyosda kengayish imkoniyatini saqlab qolasiz." },
            { feature: "Domen va ijtimoiy tarmoqlarda bo'shlik tekshiruvi", benefit: "Tanlagan nomingiz internetda band bo'lmaydi, marketingda to'siqsiz ishlaysiz." },
            { feature: "Huquqiy maslahat", benefit: "Patentlash jarayonida nimalarga e'tibor berish kerakligini bilib olasiz." }
        ],
        benefits: ["Kelajakdagi yuridik muammolardan saqlaning", "Brendingiz uchun mustahkam poydevor yarating"]
    },
    consultation: {
        label: "30 daqiqalik konsultatsiya",
        description: "Brending bo'yicha har qanday savolingizga tezkor yo'l-yo'riq va professional maslahat.",
        price: basePricesUSD.consultation,
        note: null,
        features: [
            { feature: "Biznes-muammolarni aniqlash", benefit: "Asosiy muammoingizni aniqlab, uni hal qilishga e'tiboringizni qaratasiz." },
            { feature: "Brending bo'yicha savollarga javob", benefit: "Ikki-uch haftalik izlanish o'rniga, 30 daqiqada aniq javoblar olasiz." },
            { feature: "Keyingi qadamlar bo'yicha tavsiyalar", benefit: "Harakatingizni qayerdan boshlashni bilib olasiz, vaqtingiz tejaladi." }
        ],
        benefits: ["Biznesingiz uchun to'g'ri yo'nalishni tezda aniqlang", "Qimmatli vaqt va pulingizni tejang"]
    },
    strategy: {
        label: "Brend-strategiya va platforma",
        description: "Biznesingiz uchun natija keltiradigan poydevor — bozor tahlili, pozitsiyalash va kommunikatsiya.",
        price: basePricesUSD.strategy,
        note: null,
        features: [
            { feature: "Chuqurlashtirilgan bozor va raqobatchilar tahlili", benefit: "Bozordagi o'rningizni aniq bilasiz va raqobatchilardan ajralib turish uchun aniq strategiyaga ega bo'lasiz." },
            { feature: "Maqsadli auditoriyani segmentlash", benefit: "Marketing byudjetingizni aniq mijozlarga yo'naltirib, uning samaradorligini keskin oshirasiz." },
            { feature: "Brend platformasi (missiya, qadriyatlar, falsafa)", benefit: "Brendingiz shunchaki mahsulot emas, balki mijozlar ishonadigan va ergashadigan g'oyaga aylanadi." },
            { feature: "Brend ovozi (Tone of Voice)", benefit: "Mijozlar bilan ularning tilida gaplashib, ular bilan mustahkam hissiy aloqa o'rnatasiz." },
            { feature: "Pozitsiyalash va Unikal Savdo Taklifi (UST)", benefit: "Mijozlar ongida 'Nega aynan siz?' degan savolga aniq va ishonchli javobga ega bo'lasiz." },
            { feature: "Brend arxitekturasi va hikoyasi (Storytelling)", benefit: "Brendingiz tarixi va mahsulotlaringiz o'rtasidagi bog'liqlik mijozlar uchun jozibali va esda qolarli bo'ladi." }
        ],
        benefits: ["Biznesingiz uchun aniq rivojlanish xaritasini oling", "Marketing xarajatlaringizni optimallashtiring", "Bozorda mustahkam o'rin egallang"]
    },
    commStrategy: {
        label: "Kommunikatsion strategiya",
        description: "Mijozlar bilan muloqot strategiyasi: ohang, asosiy xabarlar, kanallar.",
        price: basePricesUSD.commStrategy,
        note: null,
        features: [
            { feature: "Brend ovozini (Tone of Voice) aniqlashtirish", benefit: "Brendingiz barcha kanallarda yagona va taniladigan 'ovoz'ga ega bo'ladi, bu ishonchni oshiradi." },
            { feature: "Asosiy xabarlarni (Key Messages) ishlab chiqish", benefit: "Har bir auditoriya segmenti uchun eng samarali ta'sir qiluvchi xabarlarni aniqlaysiz." },
            { feature: "Kommunikatsiya kanallarini rejalashtirish", benefit: "Marketing byudjetingizni eng ko'p natija keltiradigan kanallarga (ijtimoiy tarmoqlar, PR, reklama) yo'naltirasiz." },
            { feature: "Kontent strategiyasi yo'nalishlari", benefit: "Mijozlarni jalb qiladigan va ularni sodiq muxlislarga aylantiradigan kontent yaratish uchun aniq rejaga ega bo'lasiz." }
        ],
        benefits: ["Mijozlaringiz bilan to'g'ri til topishing", "Sotuvlaringizni oshiruvchi muloqot tizimini yarating", "Brendingizga sodiqlikni oshiring"]
    },
    namingStandard: {
        label: "Naming Standard",
        description: "Kichik biznes va startaplar uchun ideal.",
        price: basePricesUSD.namingStandard,
        note: null,
        features: [
            { feature: "3 ta qisqa, jarangli va esda qolarli nom", benefit: "Brendingiz uchun tez va sifatli start olasiz." },
            { feature: "Domen va ijtimoiy tarmoqlarda bo'shligini tekshirish", benefit: "Tanlagan nomingiz raqamli muhitda band bo'lmaydi." },
            { feature: "Eshitgan odam yoza oladigan va topa oladigan nomlar", benefit: "Mijozlar sizni qidirganda adashib qolishmaydi." },
            { feature: "100% Mamnuniyat Kafolati", benefit: "Sizga to'liq ma'qul keladigan nom topmagunimizcha ishlaymiz." }
        ],
        benefits: ["Tez va hamyonbop nomga ega bo'ling", "Biznesingizga professional start bering"],
        timeline: "Birinchi konsepsiyalar 7–10 ish kuni ichida taqdim etiladi"
    },
    namingPremium: {
        label: "Naming Premium",
        description: "O'rta va rivojlanayotgan biznes uchun strategik yondashuv.",
        price: basePricesUSD.namingPremium,
        note: null,
        features: [
            { feature: "5 ta strategik nom variantlari", benefit: "Nomlar shunchaki chiroyli emas, biznes maqsadingizga xizmat qiladi." },
            { feature: "Domen, ijtimoiy tarmoqlar va 2 ta klass bo'yicha patentga yaroqlilik tekshiruvi", benefit: "Nomning huquqiy va raqamli jihatdan tozaligiga ishonch hosil qilasiz." },
            { feature: "Bir nechta tilda fonetik va semantik tahlil", benefit: "Xalqaro bozorga chiqsangiz, nomingiz boshqa tillarda salbiy ma'no anglatmasligiga ishonch hosil qilasiz." },
            { feature: "5 yilga bepul domen (.uz/.com)", benefit: "Eng muhim raqamli aktivingizni qo'lga kiritasiz, qo'shimcha xarajatsiz." },
            { feature: "Eshitgan odam yoza oladigan va topa oladigan nomlar", benefit: "Mijozlar sizni qidirganda adashib qolishmaydi." },
            { feature: "100% Mamnuniyat Kafolati", benefit: "Sizga to'liq ma'qul keladigan nom topmagunimizcha ishlaymiz." }
        ],
        benefits: ["Brendingiz uchun strategik jihatdan kuchli nom oling", "Xalqaro bozorga chiqish imkoniyatini yarating", "Huquqiy jihatdan himoyalangan nomga ega bo'ling"],
        recommended: true,
        timeline: "Birinchi konsepsiyalar 14–20 ish kuni ichida taqdim etiladi"
    },
    namingVIP: {
        label: "Naming VIP",
        description: "Katta va xalqaro bozorga mo'ljallangan loyihalar uchun.",
        price: basePricesUSD.namingVIP,
        note: null,
        features: [
            { feature: "10+ ta eksklyuziv nom variantlari va shaxsiy art-direktor nazorati", benefit: "Eng yuqori darajadagi ijodiy yondashuv va tajribaga ega bo'lasiz." },
            { feature: "Brendingiz uchun hikoya (storytelling) bilan taqdimot", benefit: "Nom shunchaki so'z emas, balki mijozlarni o'ziga tortadigan hikoyaga aylanadi." },
            { feature: "Domen, ijtimoiy tarmoqlar va 5 tagacha klass bo'yicha chuqur patent tekshiruvi", benefit: "Maksimal darajada huquqiy himoya va xotirjamlikka erishasiz." },
            { feature: "10 yilga bepul domen (.uz va .com)", benefit: "Uzoq muddatli raqamli kelajagingizni ta'minlaysiz." },
            { feature: "Patentga topshirishda yordam (davlat boji alohida)", benefit: "Biz siz uchun barcha murakkab yuridik jarayonlarni osonlashtiramiz." },
            { feature: "Eshitgan odam yoza oladigan va topa oladigan nomlar", benefit: "Mijozlar sizni qidirganda adashib qolishmaydi." },
            { feature: "100% Mamnuniyat Kafolati", benefit: "Sizga to'liq ma'qul keladigan nom topmagunimizcha ishlaymiz." }
        ],
        benefits: ["Bozorda mutlaq yetakchilikka da'vogar nomga ega bo'ling", "Maksimal darajada himoyalangan va puxta o'ylangan brend nomi", "Shaxsiy ekspert nazorati va qo'llab-quvvatlash"],
        timeline: "Birinchi konsepsiyalar 20–25 ish kuni ichida taqdim etiladi"
    },
    logoStandard: {
        label: "Logotip Standard",
        description: "Startaplar uchun tezkor yechim.",
        price: basePricesUSD.logoStandard,
        note: null,
        features: [
            { feature: "2 ta logotip konsepsiyasi", benefit: "Biznesingiz uchun professional vizual asosga ega bo'lasiz." },
            { feature: "Logotip vektor fayllari (AI, EPS, PNG, JPG, PDF)", benefit: "Logotipni har qanday o'lchamda va istalgan joyda sifatini yo'qotmasdan ishlata olasiz." },
            { feature: "100% Mamnuniyat Kafolati", benefit: "Sizga to'liq ma'qul keladigan logotip yaratmagunimizcha ishlaymiz." }
        ],
        benefits: ["Biznesingiz uchun professional vizual asos yarating", "Tez va sifatli logotipga ega bo'ling"],
        timeline: "Birinchi konsepsiyalar 7–10 ish kuni ichida taqdim etiladi"
    },
    logoPremium: {
        label: "Logo va firma uslubi",
        description: "O'z brendini jiddiy rivojlantirish niyatidagilar uchun.",
        price: basePricesUSD.logoPremium,
        note: null,
        features: [
            { feature: "5 ta logotip konsepsiyasi", benefit: "Brendingiz uchun eng mukammal vizual yechimni tanlash imkoniyatiga ega bo'lasiz." },
            { feature: "Firma uslubi (asosiy ranglar, shriftlar, qoidalar)", benefit: "Brendingiz barcha aloqa nuqtalarida yagona va professional ko'rinishga ega bo'ladi." },
            { feature: "15+ real maketlarda namoyish", benefit: "Logotip va uslubingiz real hayotda qanday ko'rinishini aniq tasavvur qilasiz." },
            { feature: "Logotip vektor fayllari (AI, EPS, PNG, JPG, PDF)", benefit: "Logotipni har qanday o'lchamda va istalgan joyda sifatini yo'qotmasdan ishlata olasiz." },
            { feature: "100% Mamnuniyat Kafolati", benefit: "Sizga to'liq ma'qul keladigan logotip yaratmagunimizcha ishlaymiz." }
        ],
        benefits: ["Brendingiz uchun to'liq va tizimli vizual yechimga ega bo'ling", "Mijozlar ongida mustahkam va yagona obraz yarating", "Marketing materiallaringizda professional ko'rinishga erishing"],
        recommended: true,
        timeline: "Birinchi konsepsiyalar 14–20 ish kuni ichida taqdim etiladi"
    },
    logoVIP: {
        label: "Logo + Firma uslubi + Brendbuk",
        description: "Kengaytirilgan identifikatsiya va to'liq qo'llab-quvvatlash.",
        price: basePricesUSD.logoVIP,
        note: null,
        features: [
            { feature: "7+ ta premium logotip konsepsiyasi va shaxsiy art-direktor ishtiroki", benefit: "Eng yuqori darajadagi ijodkorlik va individual yondashuvga ega bo'lasiz." },
            { feature: "To'liq firma uslubi (asosiy ranglar, shriftlar, qoidalar)", benefit: "Brendingiz barcha aloqa nuqtalarida yagona va professional ko'rinishga ega bo'ladi." },
            { feature: "To'liq Brendbuk (30-50 sahifa)", benefit: "Brendingizni boshqarish uchun barcha qoidalar va standartlar jamlangan 'konstitutsiya'ga ega bo'lasiz." },
            { feature: "Logotip vektor fayllari (AI, EPS, PNG, JPG, PDF)", benefit: "Logotipni har qanday o'lchamda va istalgan joyda sifatini yo'qotmasdan ishlata olasiz." },
            { feature: "100% Mamnuniyat Kafolati", benefit: "Sizga to'liq ma'qul keladigan logotip yaratmagunimizcha ishlaymiz." }
        ],
        benefits: ["Brendingiz uchun noldan boshlab to'liq tayyor yechimga ega bo'ling", "Bozorda premium segmentga da'vo qiling", "Brendingizni boshqarish uchun to'liq qo'llanma va vositalarga ega bo'ling"],
        timeline: "Birinchi konsepsiyalar 20–30 ish kuni ichida taqdim etiladi"
    },
    packaging: {
        label: "Qadoq dizayni",
        description: "3 SKU uchun qadoq ishlab chiqish, chop etishga tayyorlash.",
        price: basePricesUSD.packaging,
        note: null,
        features: [],
        benefits: ["Mahsulotingizni javonda ajralib turadigan qiling", "Xaridorlarda birinchi qarashdayoq ishonch uyg'oting"]
    },
    smm: {
        label: "Ijtimoiy tarmoqlar uchun stil",
        description: "Postlar va storislarni firma uslubida bezash.",
        price: basePricesUSD.smm,
        note: null,
        features: [],
        benefits: ["Ijtimoiy tarmoqlarda professional va yagona obraz yarating", "Obunachilarning e'tiborini torting va saqlab qoling"]
    },
    merch: {
        label: "Brendli merch va nositellar",
        description: "Kiyim, aksessuarlar, POSM materiallari dizayni.",
        price: 0,
        note: "Individual",
        features: [],
        benefits: ["Brendingizni oflayn hayotga olib chiqing", "Mijozlar va xodimlar uchun esda qolarli sovg'alar yarating"]
    },
    illustrations: {
        label: "Illustratsiyalar va animatsiya",
        description: "Firma grafikasi, infografika va animatsiyalar yaratish.",
        price: 0,
        note: "Individual",
        features: [],
        benefits: ["Brendingizga o'ziga xos va jonli ko'rinish bering", "Murakkab ma'lumotlarni oson va qiziqarli tarzda yetkazing"]
    },
    urgency: {
        label: "Shoshilinch loyiha (+50%)",
        description: "Loyiha navbatsiz, qisqa muddatda (2-3 kun) tayyorlanadi.",
        price: 0,
        note: "+50%",
        features: [],
        benefits: ["Loyiha natijalarini tezroq oling", "Bozorga tezda kirib borish imkoniyati"]
    },
    nda: {
        label: "Maxfiylik shartnomasi (NDA) (+50%)",
        description: "Loyiha ma'lumotlarini oshkor etmaslik shartnomasi.",
        price: 0,
        note: "+50%",
        features: [],
        benefits: ["Loyiha g'oyalaringiz va ma'lumotlaringiz xavfsizligini ta'minlang", "Tijoriy sirlaringizni himoya qiling"]
    }
};

const ruServiceDetails: typeof uzServiceDetails = JSON.parse(JSON.stringify(uzServiceDetails));
Object.assign(ruServiceDetails, {
    audit: { ...ruServiceDetails.audit, label: "Аудит логотипа", description: "Анализ существующего логотипа и рекомендации по улучшению.", features: [], benefits: [] },
    namingCheck: { ...ruServiceDetails.namingCheck, label: "Проверка нейминга", description: "Проверка доступности имени бренда в базах данных Узбекистана и международных базах.", features: [], benefits: [] },
    consultation: { ...ruServiceDetails.consultation, label: "30-минутная консультация", description: "Быстрые рекомендации и профессиональные советы по любому вопросу брендинга.", features: [], benefits: [] },
    strategy: { ...ruServiceDetails.strategy, label: "Бренд-стратегия и платформа", description: "Анализ рынка, аудит бренда, разработка позиционирования и ценностного предложения.",
        features: [],
        benefits: []
    },
    commStrategy: { ...ruServiceDetails.commStrategy, label: "Коммуникационная стратегия", description: "Стратегия общения с клиентами: тон, ключевые сообщения, каналы.", features: [], benefits: [] },
    namingStandard: { ...ruServiceDetails.namingStandard, label: "Нейминг Standard", description: "Идеально для малого бизнеса и стартапов.", features: [], benefits: [] },
    namingPremium: { ...ruServiceDetails.namingPremium, label: "Нейминг Premium", description: "Для среднего и развивающегося бизнеса.", features: [], benefits: [] },
    namingVIP: { ...ruServiceDetails.namingVIP, label: "Нейминг VIP", description: "Для крупных и международных проектов.", features: [], benefits: [] },
    logoStandard: { ...ruServiceDetails.logoStandard, label: "Логотип Standard", description: "Быстрое решение для стартапов.", features: [], benefits: [] },
    logoPremium: { ...ruServiceDetails.logoPremium, label: "Логотип и фирменный стиль", description: "Для тех, кто серьезно настроен развивать свой бренд.", features: [], benefits: [] },
    logoVIP: { ...ruServiceDetails.logoVIP, label: "Логотип + Фирменный стиль + Брендбук", description: "Расширенная айдентика и полная поддержка.", features: [], benefits: [] },
    packaging: { ...ruServiceDetails.packaging, label: "Дизайн упаковки", description: "Разработка упаковки для 3 SKU, подготовка к печати.", features: [], benefits: [] },
    smm: { ...ruServiceDetails.smm, label: "Стиль для социальных сетей", description: "Оформление постов и сторис в фирменном стиле.", features: [], benefits: [] },
    merch: { ...ruServiceDetails.merch, label: "Брендированный мерч и носители", description: "Дизайн одежды, аксессуаров, POSM-материалов.", features: [], benefits: [] },
    illustrations: { ...ruServiceDetails.illustrations, label: "Иллюстрации и анимация", description: "Создание фирменной графики, инфографики и анимаций.", features: [], benefits: [] },
    urgency: { ...ruServiceDetails.urgency, label: "Срочный проект (+50%)", description: "Проект выполняется вне очереди, в короткие сроки (2-3 дня).", features: [], benefits: [] },
    nda: { ...ruServiceDetails.nda, label: "Договор о неразглашении (NDA) (+50%)", description: "Договор о неразглашении информации о проекте.", features: [], benefits: [] }
});

const enServiceDetails: typeof uzServiceDetails = JSON.parse(JSON.stringify(uzServiceDetails));
Object.assign(enServiceDetails, {
    audit: { ...enServiceDetails.audit, label: "Logo Audit", description: "Analysis of the existing logo and recommendations for improvement.", features: [], benefits: [] },
    namingCheck: { ...enServiceDetails.namingCheck, label: "Naming Check", description: "Checking the availability of the brand name in Uzbekistan and international databases.", features: [], benefits: [] },
    consultation: { ...enServiceDetails.consultation, label: "30-minute consultation", description: "Quick guidance and professional advice on any branding question.", features: [], benefits: [] },
    strategy: { ...enServiceDetails.strategy, label: "Brand Strategy and Platform", description: "Market analysis, brand audit, positioning and value proposition development.",
        features: [],
        benefits: []
    },
    commStrategy: { ...enServiceDetails.commStrategy, label: "Communication Strategy", description: "Customer communication strategy: tone, key messages, channels.", features: [], benefits: [] },
    namingStandard: { ...enServiceDetails.namingStandard, label: "Naming Standard", description: "Ideal for small businesses and startups.", features: [], benefits: [] },
    namingPremium: { ...enServiceDetails.namingPremium, label: "Naming Premium", description: "A strategic approach for medium and growing businesses.", features: [], benefits: [] },
    namingVIP: { ...enServiceDetails.namingVIP, label: "Naming VIP", description: "For large and international projects.", features: [], benefits: [] },
    logoStandard: { ...enServiceDetails.logoStandard, label: "Logo Standard", description: "A quick solution for startups.", features: [], benefits: [] },
    logoPremium: { ...enServiceDetails.logoPremium, label: "Logo & Corporate Identity", description: "For those serious about developing their brand.", features: [], benefits: [] },
    logoVIP: { ...enServiceDetails.logoVIP, label: "Logo + Corporate Identity + Brandbook", description: "Expanded identity and full support.", features: [], benefits: [] },
    packaging: { ...enServiceDetails.packaging, label: "Packaging Design", description: "Packaging development for 3 SKUs, preparation for printing.", features: [], benefits: [] },
    smm: { ...enServiceDetails.smm, label: "Style for Social Networks", description: "Design of posts and stories in corporate style.", features: [], benefits: [] },
    merch: { ...enServiceDetails.merch, label: "Branded Merch and Carriers", description: "Design of clothing, accessories, POSM materials.", features: [], benefits: [] },
    illustrations: { ...enServiceDetails.illustrations, label: "Illustrations and Animation", description: "Creation of corporate graphics, infographics and animations.", features: [], benefits: [] },
    urgency: { ...enServiceDetails.urgency, label: "Urgent Project (+50%)", description: "The project is carried out out of turn, in a short time (2-3 days).", features: [], benefits: [] },
    nda: { ...enServiceDetails.nda, label: "Non-Disclosure Agreement (NDA) (+50%)", description: "Agreement on non-disclosure of project information.", features: [], benefits: [] }
});

const zhServiceDetails: typeof uzServiceDetails = JSON.parse(JSON.stringify(uzServiceDetails));
Object.assign(zhServiceDetails, {
    audit: { ...zhServiceDetails.audit, label: "标志审核", description: "对现有标志进行分析并提供改进建议。", features: [], benefits: [] },
    namingCheck: { ...zhServiceDetails.namingCheck, label: "名称检查", description: "检查品牌名称在乌兹别克斯坦和国际数据库中的可用性。", features: [], benefits: [] },
    consultation: { ...zhServiceDetails.consultation, label: "30分钟咨询", description: "为任何品牌问题提供快速指导和专业建议。", features: [], benefits: [] },
    strategy: { ...zhServiceDetails.strategy, label: "品牌策略与平台", description: "市场分析、品牌审核、定位和价值主张开发。",
        features: [],
        benefits: []
    },
    commStrategy: { ...zhServiceDetails.commStrategy, label: "传播策略", description: "客户传播策略：语调、关键信息、渠道。", features: [], benefits: [] },
    namingStandard: { ...zhServiceDetails.namingStandard, label: "标准命名", description: "适合小型企业和初创公司。", features: [], benefits: [] },
    namingPremium: { ...zhServiceDetails.namingPremium, label: "高级命名", description: "适合中型和成长型企业的战略方法。", features: [], benefits: [] },
    namingVIP: { ...zhServiceDetails.namingVIP, label: "VIP命名", description: "适合大型和国际项目。", features: [], benefits: [] },
    logoStandard: { ...zhServiceDetails.logoStandard, label: "标准标志", description: "为初创公司提供的快速解决方案。", features: [], benefits: [] },
    logoPremium: { ...zhServiceDetails.logoPremium, label: "标志与企业形象", description: "为那些认真发展品牌的企业。", features: [], benefits: [] },
    logoVIP: { ...zhServiceDetails.logoVIP, label: "标志 + 企业形象 + 品牌手册", description: "扩展的形象和全面支持。", features: [], benefits: [] },
    packaging: { ...zhServiceDetails.packaging, label: "包装设计", description: "为3个SKU开发包装，为印刷做准备。", features: [], benefits: [] },
    smm: { ...zhServiceDetails.smm, label: "社交网络风格", description: "以企业风格设计帖子和故事。", features: [], benefits: [] },
    merch: { ...zhServiceDetails.merch, label: "品牌商品和载体", description: "服装、配饰、POSM材料的设计。", features: [], benefits: [] },
    illustrations: { ...zhServiceDetails.illustrations, label: "插图与动画", description: "创建企业图形、信息图和动画。", features: [], benefits: [] },
    urgency: { ...zhServiceDetails.urgency, label: "紧急项目（+50%）", description: "该项目将不按顺序在短时间内（2-3天）执行。", features: [], benefits: [] },
    nda: { ...zhServiceDetails.nda, label: "保密协议（NDA）（+50%）", description: "关于不披露项目信息的协议。", features: [], benefits: [] }
});


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
    const pcgDiscount = lang === 'ru' ? 'Специальные скидки для членов PCG' : lang === 'en' ? 'Special discounts for PCG members' : lang === 'zh' ? 'PCG会员特别折扣' : 'PCG a\'zolari uchun maxsus chegirmalar';

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
export const ndaSurcharge = 0.50; // Changed from 0.25 to 0.50
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

    const premiumServices: (keyof SelectedServices)[] = ['namingPremium', 'logoPremium', 'packaging', 'strategy'];
    const standardServices: (keyof SelectedServices)[] = ['namingStandard', 'logoStandard'];
    const vipServices: (keyof SelectedServices)[] = ['namingVIP', 'logoVIP'];
    const percentageServices: (keyof SelectedServices)[] = ['urgency', 'nda'];

    let hasNamingStandard = false;
    let hasLogoStandard = false;

    for (const serviceKey in selectedServices) {
        const key = serviceKey as keyof SelectedServices;
        if (sd[key] && selectedServices[key]) {
            const servicePrice = sd[key].price;

            if (key === 'namingStandard') hasNamingStandard = true;
            if (key === 'logoStandard') hasLogoStandard = true;

            if (vipServices.includes(key)) {
                vipServicesPrice += servicePrice;
            } else if (!percentageServices.includes(key)) {
                nonVipBasePrice += servicePrice;
                if (premiumServices.includes(key)) {
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
        let discountName;
        if (lang === 'ru') discountName = 'Надбавка за NDA (+50%)';
        else if (lang === 'en') discountName = 'NDA Surcharge (+50%)';
        else if (lang === 'zh') discountName = '保密协议附加费 (+50%)';
        else discountName = 'NDA uchun ustama (+50%)';
        surcharges.push({ name: discountName, value: surchargeAmount });
    }

    let finalPrice = vipServicesPrice > 0 ? vipServicesPrice + (priceAfterSurcharges - totalBasePrice) : priceAfterSurcharges;

    const discountsApplied: { name: string, value: number }[] = [];

    // Apply package discount only on non-VIP services
    let nonVipPriceAfterDiscount = nonVipBasePrice;

    // Check for standard package discount
    if (hasNamingStandard && hasLogoStandard) {
        const standardPackagePrice = sd.namingStandard.price + sd.logoStandard.price;
        const discountAmount = standardPackagePrice * packageDiscount;
        nonVipPriceAfterDiscount -= discountAmount;
        let discountName;
        if (lang === 'ru') discountName = 'Пакетная скидка (Стандарт) (-20%)';
        else if (lang === 'en') discountName = 'Package Discount (Standard) (-20%)';
        else if (lang === 'zh') discountName = '套餐折扣 (标准) (-20%)';
        else discountName = 'Paketli chegirma (Standard) (-20%)';
        discountsApplied.push({ name: discountName, value: discountAmount });
    }

    if (mainServicesCount >= packageDiscountThreshold) {
        const discountableAmount = nonVipBasePrice - (hasNamingStandard && hasLogoStandard ? (sd.namingStandard.price + sd.logoStandard.price) : 0);
        const discountAmount = discountableAmount * packageDiscount;
        if(discountAmount > 0) {
            nonVipPriceAfterDiscount -= discountAmount;
            let discountName;
            if (lang === 'ru') discountName = 'Пакетная скидка (-20%)';
            else if (lang === 'en') discountName = 'Package Discount (-20%)';
            else if (lang === 'zh') discountName = '套餐折扣 (-20%)';
            else discountName = 'Paketli chegirma (-20%)';
            discountsApplied.push({ name: discountName, value: discountAmount });
        }
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
    if (lang === 'ru') bonusDescription = "Аудит логотипа и 30-минутная консультация в подарок";
    else if (lang === 'en') bonusDescription = "Logo audit and 30-minute consultation as a gift";
    else if (lang === 'zh') bonusDescription = "免费赠送标志审核和30分钟咨询";
    else bonusDescription = "Logotip auditi va 30 daqiqalik konsultatsiya sovg'a tariqasida";
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
        summary += `
${lang === 'ru' ? 'Особые условия' : lang === 'en' ? 'Special conditions' : lang === 'zh' ? '特殊条件' : 'Maxsus shartlar'}: ${conditions.join(', ')}`;
    }

    if (discountApplied.length > 0) {
        const discountText = discountApplied.map(d => `${d.name} (${formatPrice(d.value, lang, 'usd')})`).join('; ');
        summary += `
${lang === 'ru' ? 'Примененные скидки' : lang === 'en' ? 'Applied discounts' : lang === 'zh' ? '应用的折扣' : 'Qo\'llanilgan chegirmalar'}: ${discountText}`;
    }

    if (bonus) {
        summary += `
${lang === 'ru' ? 'Бонус' : lang === 'en' ? 'Bonus' : 'Bonus'}: ${bonus}`;
    }

    return summary;
}
