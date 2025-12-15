

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
        benefits: []
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
        benefits: []
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
        benefits: []
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
        benefits: []
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
        benefits: []
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
        benefits: [],
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
        benefits: [],
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
        benefits: [],
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
        benefits: [],
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
        benefits: [],
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
            { feature: "Firma uslubi (asosiy ranglar, shriftlar, qoidalar)", benefit: "Brendingiz barcha aloqa nuqtalarida yagona va professional ko'rinishga ega bo'ladi." },
            { feature: "To'liq Brendbuk (30-50 sahifa)", benefit: "Brendingizni boshqarish uchun barcha qoidalar va standartlar jamlangan 'konstitutsiya'ga ega bo'lasiz." },
            { feature: "Logotip vektor fayllari (AI, EPS, PNG, JPG, PDF)", benefit: "Logotipni har qanday o'lchamda va istalgan joyda sifatini yo'qotmasdan ishlata olasiz." },
            { feature: "100% Mamnuniyat Kafolati", benefit: "Sizga to'liq ma'qul keladigan logotip yaratmagunimizcha ishlaymiz." }
        ],
        benefits: [],
        timeline: "Birinchi konsepsiyalar 20–30 ish kuni ichida taqdim etiladi"
    },
    packaging: {
        label: "Qadoq dizayni",
        description: "3 SKU uchun qadoq ishlab chiqish, chop etishga tayyorlash.",
        price: basePricesUSD.packaging,
        note: null,
        features: [
             { feature: "Bozor va raqobatchilar tahlili", benefit: "Javonda mahsulotingizni ajralib turishini ta'minlaydigan yechim topasiz." },
             { feature: "2 ta dizayn konsepsiyasi", benefit: "Brendingiz uchun eng mos uslubni tanlash imkoniga ega bo'lasiz." },
             { feature: "3 tagacha SKU (mahsuot turi) uchun dizayn adaptatsiyasi", benefit: "Butun mahsulot liniyangiz uchun yagona va izchil dizayn tizimiga ega bo'lasiz." },
             { feature: "Chop etishga tayyor fayllar", benefit: "Ishlab chiqarishda hech qanday muammosiz, sifatli natijaga erishasiz." }
        ],
        benefits: []
    },
    smm: {
        label: "Ijtimoiy tarmoqlar uchun stil",
        description: "Postlar va storislarni firma uslubida bezash.",
        price: basePricesUSD.smm,
        note: null,
        features: [
            { feature: "6 ta post uchun shablon", benefit: "Turli xil kontent turlari (mahsulot, aksiya, foydali maslahat) uchun tayyor dizayn yechimlariga ega bo'lasiz." },
            { feature: "6 ta stories uchun shablon", benefit: "Stories formatida ham brendingizning yagona uslubini saqlab qolasiz." },
            { feature: "Profil uchun avatar va highlight cover'lar", benefit: "Profilingiz professional va jozibador ko'rinishga ega bo'ladi." },
            { feature: "Instagram uchun qo'llanma", benefit: "Shablonlardan qanday samarali foydalanish haqida aniq ko'rsatmalarga ega bo'lasiz." }
        ],
        benefits: []
    },
    merch: {
        label: "Brendli merch va nositellar",
        description: "Kiyim, aksessuarlar, POSM materiallari dizayni.",
        price: 0,
        note: "Individual",
        features: [
            { feature: "Xodimlar uchun futbolka, kepka, xudi dizayni", benefit: "Jamoangizda korporativ ruhni va brendga mansublik hissini kuchaytirasiz." },
            { feature: "Mijozlar uchun sovg'alar (bloknot, ruchka, stakan)", benefit: "Brendingiz mijozlaringizning kundalik hayotiga kirib boradi va doimiy eslatma bo'lib turadi." },
            { feature: "POSM materiallari (flayer, banner, stend)", benefit: "Sotuv nuqtalarida va tadbirlarda brendingizni samarali targ'ib qilasiz." }
        ],
        benefits: []
    },
    illustrations: {
        label: "Illustratsiyalar va animatsiya",
        description: "Firma grafikasi, infografika va animatsiyalar yaratish.",
        price: 0,
        note: "Individual",
        features: [
            { feature: "Brend uchun unikal illustratsiyalar to'plami", benefit: "Brendingizga o'ziga xos, raqobatchilarda yo'q vizual tilga ega bo'lasiz." },
            { feature: "Infografika dizayni", benefit: "Murakkab ma'lumotlarni oson va qiziqarli tarzda auditoriyangizga yetkazasiz." },
            { feature: "Logotip va elementlar animatsiyasi", benefit: "Raqamli platformalarda (sayt, ijtimoiy tarmoqlar) brendingizni yanada jonli va e'tiborni tortadigan qilasiz." }
        ],
        benefits: []
    },
    urgency: {
        label: "Shoshilinch loyiha (+50%)",
        description: "Loyiha navbatsiz, qisqa muddatda (2-3 kun) tayyorlanadi.",
        price: 0,
        note: "+50%",
        features: [
            { feature: "Navbatdan tashqari ish boshlash", benefit: "Loyiha birinchi prioritetga aylanadi." },
            { feature: "Qisqartirilgan muddatlar", benefit: "Natijalarni standart muddatlardan ancha oldin olasiz." }
        ],
        benefits: []
    },
    nda: {
        label: "Maxfiylik shartnomasi (NDA) (+50%)",
        description: "Loyiha ma'lumotlarini oshkor etmaslik shartnomasi.",
        price: 0,
        note: "+50%",
        features: [
            { feature: "Yuridik kuchga ega hujjat imzolanishi", benefit: "Sizning loyihangiz ma'lumotlari uchinchi tomonga oshkor etilmasligiga qonuniy kafolat olasiz." },
            { feature: "To'liq maxfiylik", benefit: "Bizning jamoamiz loyiha tafsilotlarini hech qayerda (portfolio, ijtimoiy tarmoqlar) e'lon qilmaydi." }
        ],
        benefits: []
    }
};

const ruServiceDetails: typeof uzServiceDetails = JSON.parse(JSON.stringify(uzServiceDetails));
Object.assign(ruServiceDetails, {
    audit: { ...ruServiceDetails.audit, label: "Аудит логотипа", description: "Анализ существующего логотипа и рекомендации по улучшению.", features: [
            { feature: "Сильные и слабые стороны логотипа", benefit: "Вы точно узнаете, где нужно усилить ваш брендинг." },
            { feature: "Анализ по сравнению с конкурентами", benefit: "Вы получите представление о том, как выделиться на рынке." },
            { feature: "Конкретные рекомендации по улучшению", benefit: "Ваши следующие шаги будут четкими и понятными, вы не будете тратить деньги на догадки." }
        ], benefits: [] },
    namingCheck: { ...ruServiceDetails.namingCheck, label: "Проверка нейминга", description: "Проверка доступности имени бренда в базах данных Узбекистана и международных базах.", features: [
            { feature: "Проверка по базе данных Узбекистана", benefit: "Вы избежите юридических проблем на местном рынке." },
            { feature: "Проверка по международной базе WIPO", benefit: "Вы сохраните возможность расширения на международный уровень." },
            { feature: "Проверка доступности в доменах и социальных сетях", benefit: "Выбранное вами имя не будет занято в интернете, и вы сможете без препятствий работать в маркетинге." },
            { feature: "Юридическая консультация", benefit: "Вы узнаете, на что следует обратить внимание в процессе патентования." }
        ], benefits: [] },
    consultation: { ...ruServiceDetails.consultation, label: "30-минутная консультация", description: "Быстрые рекомендации и профессиональные советы по любому вопросу брендинга.", features: [
            { feature: "Выявление бизнес-проблем", benefit: "Вы выявите свою основную проблему и сможете сосредоточиться на ее решении." },
            { feature: "Ответы на вопросы по брендингу", benefit: "Вместо двух-трех недель поиска вы получите четкие ответы за 30 минут." },
            { feature: "Рекомендации по следующим шагам", benefit: "Вы будете знать, с чего начать свои действия, и сэкономите свое время." }
        ], benefits: [] },
    strategy: { ...ruServiceDetails.strategy, label: "Бренд-стратегия и платформа", description: "Анализ рынка, аудит бренда, разработка позиционирования и ценностного предложения.",
        features: [
            { feature: "Углубленный анализ рынка и конкурентов", benefit: "Вы будете точно знать свое место на рынке и получите четкую стратегию, чтобы выделиться среди конкурентов." },
            { feature: "Сегментация целевой аудитории", benefit: "Вы направите свой маркетинговый бюджет на конкретных клиентов, резко повысив его эффективность." },
            { feature: "Платформа бренда (миссия, ценности, философия)", benefit: "Ваш бренд станет не просто продуктом, а идеей, которой клиенты доверяют и следуют." },
            { feature: "Голос бренда (Tone of Voice)", benefit: "Вы будете говорить с клиентами на их языке, устанавливая с ними прочную эмоциональную связь." },
            { feature: "Позиционирование и Уникальное Торговое Предложение (УТП)", benefit: "Вы получите четкий и убедительный ответ на вопрос 'Почему именно вы?' в сознании клиентов." },
            { feature: "Архитектура бренда и повествование (Storytelling)", benefit: "Связь между историей вашего бренда и вашими продуктами станет привлекательной и запоминающейся для клиентов." }
        ],
        benefits: []
    },
    commStrategy: { ...ruServiceDetails.commStrategy, label: "Коммуникационная стратегия", description: "Стратегия общения с клиентами: тон, ключевые сообщения, каналы.", features: [
            { feature: "Уточнение голоса бренда (Tone of Voice)", benefit: "Ваш бренд будет иметь единый и узнаваемый 'голос' на всех каналах, что повысит доверие." },
            { feature: "Разработка ключевых сообщений (Key Messages)", benefit: "Вы определите наиболее эффективные сообщения для каждого сегмента аудитории." },
            { feature: "Планирование каналов коммуникации", benefit: "Вы направите свой маркетинговый бюджет на каналы, приносящие наибольший результат (социальные сети, PR, реклама)." },
            { feature: "Направления контент-стратегии", benefit: "Вы получите четкий план по созданию контента, который привлекает клиентов и превращает их в преданных поклонников." }
        ], benefits: [] },
    namingStandard: { ...ruServiceDetails.namingStandard, label: "Нейминг Standard", description: "Идеально для малого бизнеса и стартапов.", features: [
            { feature: "3 коротких, звучных и запоминающихся названия", benefit: "Вы получите быстрый и качественный старт для вашего бренда." },
            { feature: "Проверка доступности в доменах и социальных сетях", benefit: "Выбранное вами имя не будет занято в цифровой среде." },
            { feature: "Имена, которые легко написать и найти на слух", benefit: "Клиенты не ошибутся при поиске вас." },
            { feature: "100% Гарантия Удовлетворенности", benefit: "Мы будем работать, пока не найдем имя, которое вам полностью понравится." }
        ], benefits: [] },
    namingPremium: { ...ruServiceDetails.namingPremium, label: "Нейминг Premium", description: "Для среднего и развивающегося бизнеса.", features: [
            { feature: "5 стратегических вариантов названий", benefit: "Названия будут не просто красивыми, а будут служить целям вашего бизнеса." },
            { feature: "Проверка пригодности к патентованию по доменам, социальным сетям и 2 классам", benefit: "Вы будете уверены в юридической и цифровой чистоте имени." },
            { feature: "Фонетический и семантический анализ на нескольких языках", benefit: "Вы будете уверены, что ваше имя не будет иметь негативного значения на других языках при выходе на международный рынок." },
            { feature: "Бесплатный домен на 5 лет (.uz/.com)", benefit: "Вы получите свой самый важный цифровой актив без дополнительных затрат." },
            { feature: "Имена, которые легко написать и найти на слух", benefit: "Клиенты не ошибутся при поиске вас." },
            { feature: "100% Гарантия Удовлетворенности", benefit: "Мы будем работать, пока не найдем имя, которое вам полностью понравится." }
        ], benefits: [] },
    namingVIP: { ...ruServiceDetails.namingVIP, label: "Нейминг VIP", description: "Для крупных и международных проектов.", features: [
            { feature: "10+ эксклюзивных вариантов названий и личный контроль арт-директора", benefit: "Вы получите высочайший уровень творческого подхода и опыта." },
            { feature: "Презентация с историей (storytelling) для вашего бренда", benefit: "Имя станет не просто словом, а историей, привлекающей клиентов." },
            { feature: "Глубокая проверка патентоспособности по доменам, социальным сетям и до 5 классов", benefit: "Вы достигнете максимальной юридической защиты и спокойствия." },
            { feature: "Бесплатный домен на 10 лет (.uz и .com)", benefit: "Вы обеспечите свое долгосрочное цифровое будущее." },
            { feature: "Помощь в подаче заявки на патент (госпошлина оплачивается отдельно)", benefit: "Мы облегчим для вас все сложные юридические процессы." },
            { feature: "Имена, которые легко написать и найти на слух", benefit: "Клиенты не ошибутся при поиске вас." },
            { feature: "100% Гарантия Удовлетворенности", benefit: "Мы будем работать, пока не найдем имя, которое вам полностью понравится." }
        ], benefits: [] },
    logoStandard: { ...ruServiceDetails.logoStandard, label: "Логотип Standard", description: "Быстрое решение для стартапов.", features: [
            { feature: "2 концепции логотипа", benefit: "Вы получите профессиональную визуальную основу для вашего бизнеса." },
            { feature: "Векторные файлы логотипа (AI, EPS, PNG, JPG, PDF)", benefit: "Вы сможете использовать логотип в любом размере и в любом месте без потери качества." },
            { feature: "100% Гарантия Удовлетворенности", benefit: "Мы будем работать, пока не создадим логотип, который вам полностью понравится." }
        ], benefits: [] },
    logoPremium: { ...ruServiceDetails.logoPremium, label: "Логотип и фирменный стиль", description: "Для тех, кто серьезно настроен развивать свой бренд.", features: [
            { feature: "5 концепций логотипа", benefit: "Вы получите возможность выбрать наиболее совершенное визуальное решение для вашего бренда." },
            { feature: "Фирменный стиль (основные цвета, шрифты, правила)", benefit: "Ваш бренд будет иметь единый и профессиональный вид на всех точках контакта." },
            { feature: "Демонстрация на 15+ реальных макетах", benefit: "Вы точно представите, как ваш логотип и стиль будут выглядеть в реальной жизни." },
            { feature: "Векторные файлы логотипа (AI, EPS, PNG, JPG, PDF)", benefit: "Вы сможете использовать логотип в любом размере и в любом месте без потери качества." },
            { feature: "100% Гарантия Удовлетворенности", benefit: "Мы будем работать, пока не создадим логотип, который вам полностью понравится." }
        ], benefits: [] },
    logoVIP: { ...ruServiceDetails.logoVIP, label: "Логотип + Фирменный стиль + Брендбук", description: "Расширенная айдентика и полная поддержка.", features: [
            { feature: "7+ премиальных концепций логотипа и личное участие арт-директора", benefit: "Вы получите высочайший уровень креативности и индивидуального подхода." },
            { feature: "Фирменный стиль (основные цвета, шрифты, правила)", benefit: "Ваш бренд будет иметь единый и профессиональный вид на всех точках контакта." },
            { feature: "Полный Брендбук (30-50 страниц)", benefit: "Вы получите 'конституцию' для управления вашим брендом, в которой собраны все правила и стандарты." },
            { feature: "Векторные файлы логотипа (AI, EPS, PNG, JPG, PDF)", benefit: "Вы сможете использовать логотип в любом размере и в любом месте без потери качества." },
            { feature: "100% Гарантия Удовлетворенности", benefit: "Мы будем работать, пока не создадим логотип, который вам полностью понравится." }
        ], benefits: [] },
    packaging: { ...ruServiceDetails.packaging, label: "Дизайн упаковки", description: "Разработка упаковки для 3 SKU, подготовка к печати.", features: [
            { feature: "Анализ рынка и конкурентов", benefit: "Вы найдете решение, которое обеспечит вашему продукту выделение на полке." },
            { feature: "2 концепции дизайна", benefit: "Вы получите возможность выбрать наиболее подходящий стиль для вашего бренда." },
            { feature: "Адаптация дизайна до 3 SKU (типов продукции)", benefit: "Вы получите единую и последовательную систему дизайна для всей вашей продуктовой линейки." },
            { feature: "Готовые к печати файлы", benefit: "Вы достигнете качественного результата без каких-либо проблем в производстве." }
        ], benefits: [] },
    smm: { ...ruServiceDetails.smm, label: "Стиль для социальных сетей", description: "Оформление постов и сторис в фирменном стиле.", features: [
            { feature: "6 шаблонов для постов", benefit: "Вы получите готовые дизайнерские решения для различных типов контента (продукт, акция, полезный совет)." },
            { feature: "6 шаблонов для сторис", benefit: "Вы сохраните единый стиль вашего бренда и в формате сторис." },
            { feature: "Аватар и обложки для актуального для профиля", benefit: "Ваш профиль приобретет профессиональный и привлекательный вид." },
            { feature: "Руководство для Instagram", benefit: "Вы получите четкие инструкции по эффективному использованию шаблонов." }
        ], benefits: [] },
    merch: { ...ruServiceDetails.merch, label: "Брендированный мерч и носители", description: "Дизайн одежды, аксессуаров, POSM-материалов.", features: [
            { feature: "Дизайн футболок, кепок, худи для сотрудников", benefit: "Вы укрепите корпоративный дух и чувство принадлежности к бренду в вашей команде." },
            { feature: "Подарки для клиентов (блокноты, ручки, стаканы)", benefit: "Ваш бренд войдет в повседневную жизнь ваших клиентов и будет служить постоянным напоминанием." },
            { feature: "POSM-материалы (флаеры, баннеры, стенды)", benefit: "Вы будете эффективно продвигать свой бренд в точках продаж и на мероприятиях." }
        ], benefits: [] },
    illustrations: { ...ruServiceDetails.illustrations, label: "Иллюстрации и анимация", description: "Создание фирменной графики, инфографики и анимаций.", features: [
            { feature: "Набор уникальных иллюстраций для бренда", benefit: "Ваш бренд получит собственный, не имеющий аналогов у конкурентов визуальный язык." },
            { feature: "Дизайн инфографики", benefit: "Вы будете доносить сложную информацию до вашей аудитории легко и интересно." },
            { feature: "Анимация логотипа и элементов", benefit: "Вы сделаете свой бренд более живым и привлекающим внимание на цифровых платформах (сайт, социальные сети)." }
        ], benefits: [] },
    urgency: { ...ruServiceDetails.urgency, label: "Срочный проект (+50%)", description: "Проект выполняется вне очереди, в короткие сроки (2-3 дня).", features: [
            { feature: "Начало работы вне очереди", benefit: "Проект становится главным приоритетом." },
            { feature: "Сокращенные сроки", benefit: "Вы получите результаты значительно раньше стандартных сроков." }
        ], benefits: [] },
    nda: { ...ruServiceDetails.nda, label: "Договор о неразглашении (NDA) (+50%)", description: "Договор о неразглашении информации о проекте.", features: [
            { feature: "Подписание юридически обязывающего документа", benefit: "Вы получите юридическую гарантию того, что информация о вашем проекте не будет раскрыта третьим лицам." },
            { feature: "Полная конфиденциальность", benefit: "Наша команда не будет публиковать детали проекта нигде (портфолио, социальные сети)." }
        ], benefits: [] }
});

const enServiceDetails: typeof uzServiceDetails = JSON.parse(JSON.stringify(uzServiceDetails));
Object.assign(enServiceDetails, {
    audit: { ...enServiceDetails.audit, label: "Logo Audit", description: "Analysis of the existing logo and recommendations for improvement.", features: [
            { feature: "Strengths and weaknesses of the logo", benefit: "You will know exactly where to strengthen your branding." },
            { feature: "Analysis compared to competitors", benefit: "You will get an idea of how to stand out in the market." },
            { feature: "Specific recommendations for improvement", benefit: "Your next steps will be clear and understandable, you will not spend money on guesswork." }
        ], benefits: [] },
    namingCheck: { ...enServiceDetails.namingCheck, label: "Naming Check", description: "Checking the availability of the brand name in Uzbekistan and international databases.", features: [
            { feature: "Check against Uzbekistan's database", benefit: "You will avoid legal problems in the local market." },
            { feature: "Check against the international WIPO database", benefit: "You will retain the opportunity for international expansion." },
            { feature: "Check for availability in domains and social networks", benefit: "The name you choose will not be taken on the internet, and you will be able to work in marketing without obstacles." },
            { feature: "Legal advice", benefit: "You will know what to pay attention to in the patenting process." }
        ], benefits: [] },
    consultation: { ...enServiceDetails.consultation, label: "30-minute consultation", description: "Quick guidance and professional advice on any branding question.", features: [
            { feature: "Identifying business problems", benefit: "You will identify your main problem and be able to focus on solving it." },
            { feature: "Answers to branding questions", benefit: "Instead of two or three weeks of research, you will get clear answers in 30 minutes." },
            { feature: "Recommendations for next steps", benefit: "You will know where to start your actions and save your time." }
        ], benefits: [] },
    strategy: { ...enServiceDetails.strategy, label: "Brand Strategy and Platform", description: "Market analysis, brand audit, positioning and value proposition development.",
        features: [
            { feature: "In-depth market and competitor analysis", benefit: "You will know your exact place in the market and have a clear strategy to stand out from competitors." },
            { feature: "Target audience segmentation", benefit: "You will direct your marketing budget to specific customers, dramatically increasing its effectiveness." },
            { feature: "Brand platform (mission, values, philosophy)", benefit: "Your brand will become not just a product, but an idea that customers trust and follow." },
            { feature: "Brand Voice (Tone of Voice)", benefit: "You will speak with customers in their language, establishing a strong emotional connection with them." },
            { feature: "Positioning and Unique Selling Proposition (USP)", benefit: "You will have a clear and convincing answer to the question 'Why you?' in the minds of customers." },
            { feature: "Brand architecture and storytelling", benefit: "The connection between your brand's story and your products will be attractive and memorable for customers." }
        ],
        benefits: []
    },
    commStrategy: { ...enServiceDetails.commStrategy, label: "Communication Strategy", description: "Customer communication strategy: tone, key messages, channels.", features: [
            { feature: "Clarifying the brand's Tone of Voice", benefit: "Your brand will have a single and recognizable 'voice' on all channels, which will increase trust." },
            { feature: "Developing Key Messages", benefit: "You will identify the most effective messages for each audience segment." },
            { feature: "Planning communication channels", benefit: "You will direct your marketing budget to the channels that bring the most results (social networks, PR, advertising)." },
            { feature: "Content strategy directions", benefit: "You will have a clear plan for creating content that attracts customers and turns them into loyal fans." }
        ], benefits: [] },
    namingStandard: { ...enServiceDetails.namingStandard, label: "Naming Standard", description: "Ideal for small businesses and startups.", features: [
            { feature: "3 short, catchy and memorable names", benefit: "You will get a quick and quality start for your brand." },
            { feature: "Check for availability in domains and social networks", benefit: "The name you choose will not be taken in the digital environment." },
            { feature: "Names that are easy to write and find by ear", benefit: "Customers will not be mistaken when looking for you." },
            { feature: "100% Satisfaction Guarantee", benefit: "We will work until we find a name that you are completely satisfied with." }
        ], benefits: [] },
    namingPremium: { ...enServiceDetails.namingPremium, label: "Naming Premium", description: "A strategic approach for medium and growing businesses.", features: [
            { feature: "5 strategic name options", benefit: "The names will not just be beautiful, they will serve your business goals." },
            { feature: "Patentability check for domains, social networks and 2 classes", benefit: "You will be sure of the legal and digital purity of the name." },
            { feature: "Phonetic and semantic analysis in several languages", benefit: "You will be sure that your name will not have a negative meaning in other languages when entering the international market." },
            { feature: "Free domain for 5 years (.uz/.com)", benefit: "You will get your most important digital asset at no extra cost." },
            { feature: "Names that are easy to write and find by ear", benefit: "Customers will not be mistaken when looking for you." },
            { feature: "100% Satisfaction Guarantee", benefit: "We will work until we find a name that you are completely satisfied with." }
        ], benefits: [] },
    namingVIP: { ...enServiceDetails.namingVIP, label: "Naming VIP", description: "For large and international projects.", features: [
            { feature: "10+ exclusive name options and personal art director supervision", benefit: "You will get the highest level of creative approach and experience." },
            { feature: "Presentation with a story (storytelling) for your brand", benefit: "The name will become not just a word, but a story that attracts customers." },
            { feature: "In-depth patent check for domains, social networks and up to 5 classes", benefit: "You will achieve maximum legal protection and peace of mind." },
            { feature: "Free domain for 10 years (.uz and .com)", benefit: "You will secure your long-term digital future." },
            { feature: "Assistance in filing a patent application (state fee is paid separately)", benefit: "We will facilitate all complex legal processes for you." },
            { feature: "Names that are easy to write and find by ear", benefit: "Customers will not be mistaken when looking for you." },
            { feature: "100% Satisfaction Guarantee", benefit: "We will work until we find a name that you are completely satisfied with." }
        ], benefits: [] },
    logoStandard: { ...enServiceDetails.logoStandard, label: "Logo Standard", description: "A quick solution for startups.", features: [
            { feature: "2 logo concepts", benefit: "You will get a professional visual basis for your business." },
            { feature: "Vector logo files (AI, EPS, PNG, JPG, PDF)", benefit: "You can use the logo in any size and anywhere without loss of quality." },
            { feature: "100% Satisfaction Guarantee", benefit: "We will work until we create a logo that you are completely satisfied with." }
        ], benefits: [] },
    logoPremium: { ...enServiceDetails.logoPremium, label: "Logo & Corporate Identity", description: "For those serious about developing their brand.", features: [
            { feature: "5 logo concepts", benefit: "You will have the opportunity to choose the most perfect visual solution for your brand." },
            { feature: "Corporate identity (primary colors, fonts, rules)", benefit: "Your brand will have a single and professional look at all points of contact." },
            { feature: "Demonstration on 15+ real mockups", benefit: "You will have a clear idea of how your logo and style will look in real life." },
            { feature: "Vector logo files (AI, EPS, PNG, JPG, PDF)", benefit: "You can use the logo in any size and anywhere without loss of quality." },
            { feature: "100% Satisfaction Guarantee", benefit: "We will work until we create a logo that you are completely satisfied with." }
        ], benefits: [] },
    logoVIP: { ...enServiceDetails.logoVIP, label: "Logo + Corporate Identity + Brandbook", description: "Expanded identity and full support.", features: [
            { feature: "7+ premium logo concepts and personal art director participation", benefit: "You will get the highest level of creativity and individual approach." },
            { feature: "Corporate identity (primary colors, fonts, rules)", benefit: "Your brand will have a single and professional look at all points of contact." },
            { feature: "Full Brandbook (30-50 pages)", benefit: "You will get a 'constitution' for managing your brand, which contains all the rules and standards." },
            { feature: "Vector logo files (AI, EPS, PNG, JPG, PDF)", benefit: "You can use the logo in any size and anywhere without loss of quality." },
            { feature: "100% Satisfaction Guarantee", benefit: "We will work until we create a logo that you are completely satisfied with." }
        ], benefits: [] },
    packaging: { ...enServiceDetails.packaging, label: "Packaging Design", description: "Packaging development for 3 SKUs, preparation for printing.", features: [
            { feature: "Market and competitor analysis", benefit: "You will find a solution that will make your product stand out on the shelf." },
            { feature: "2 design concepts", benefit: "You will have the opportunity to choose the most suitable style for your brand." },
            { feature: "Design adaptation for up to 3 SKUs (product types)", benefit: "You will have a single and consistent design system for your entire product line." },
            { feature: "Ready-to-print files", benefit: "You will achieve a quality result without any problems in production." }
        ], benefits: [] },
    smm: { ...enServiceDetails.smm, label: "Style for Social Networks", description: "Design of posts and stories in corporate style.", features: [
            { feature: "6 post templates", benefit: "You will get ready-made design solutions for different types of content (product, promotion, useful tip)." },
            { feature: "6 story templates", benefit: "You will maintain a single style for your brand in the story format as well." },
            { feature: "Avatar and highlight covers for the profile", benefit: "Your profile will acquire a professional and attractive look." },
            { feature: "Guide for Instagram", benefit: "You will get clear instructions on how to use the templates effectively." }
        ], benefits: [] },
    merch: { ...enServiceDetails.merch, label: "Branded Merch and Carriers", description: "Design of clothing, accessories, POSM materials.", features: [
            { feature: "Design of T-shirts, caps, hoodies for employees", benefit: "You will strengthen the corporate spirit and a sense of belonging to the brand in your team." },
            { feature: "Gifts for clients (notebooks, pens, cups)", benefit: "Your brand will enter the daily life of your clients and serve as a constant reminder." },
            { feature: "POSM materials (flyers, banners, stands)", benefit: "You will effectively promote your brand at points of sale and events." }
        ], benefits: [] },
    illustrations: { ...enServiceDetails.illustrations, label: "Illustrations and Animation", description: "Creation of corporate graphics, infographics and animations.", features: [
            { feature: "A set of unique illustrations for the brand", benefit: "Your brand will acquire its own visual language, which competitors do not have." },
            { feature: "Infographic design", benefit: "You will convey complex information to your audience in an easy and interesting way." },
            { feature: "Animation of logo and elements", benefit: "You will make your brand more lively and attention-grabbing on digital platforms (website, social networks)." }
        ], benefits: [] },
    urgency: { ...enServiceDetails.urgency, label: "Urgent Project (+50%)", description: "The project is carried out out of turn, in a short time (2-3 days).", features: [
            { feature: "Start of work out of turn", benefit: "The project becomes a top priority." },
            { feature: "Reduced deadlines", benefit: "You will get results much earlier than standard deadlines." }
        ], benefits: [] },
    nda: { ...enServiceDetails.nda, label: "Non-Disclosure Agreement (NDA) (+50%)", description: "Agreement on non-disclosure of project information.", features: [
            { feature: "Signing a legally binding document", benefit: "You will receive a legal guarantee that information about your project will not be disclosed to third parties." },
            { feature: "Complete confidentiality", benefit: "Our team will not publish project details anywhere (portfolio, social networks)." }
        ], benefits: [] }
});

const zhServiceDetails: typeof uzServiceDetails = JSON.parse(JSON.stringify(uzServiceDetails));
Object.assign(zhServiceDetails, {
    audit: { ...zhServiceDetails.audit, label: "标志审核", description: "对现有标志进行分析并提供改进建议。", features: [
            { feature: "标志的优缺点", benefit: "您将确切地知道在哪里加强您的品牌。" },
            { feature: "与竞争对手的比较分析", benefit: "您将了解如何在市场上脱颖而出。" },
            { feature: "具体的改进建议", benefit: "您的下一步将清晰明了，您不会在猜测上花钱。" }
        ], benefits: [] },
    namingCheck: { ...zhServiceDetails.namingCheck, label: "名称检查", description: "检查品牌名称在乌兹别克斯坦和国际数据库中的可用性。", features: [
            { feature: "根据乌兹别克斯坦数据库进行检查", benefit: "您将避免在当地市场出现法律问题。" },
            { feature: "根据国际WIPO数据库进行检查", benefit: "您将保留国际扩张的机会。" },
            { feature: "检查域名和社交网络中的可用性", benefit: "您选择的名称不会在互联网上被占用，您将能够在营销中无障碍地工作。" },
            { feature: "法律咨询", benefit: "您将知道在专利申请过程中应注意什么。" }
        ], benefits: [] },
    consultation: { ...zhServiceDetails.consultation, label: "30分钟咨询", description: "为任何品牌问题提供快速指导和专业建议。", features: [
            { feature: "识别业务问题", benefit: "您将识别出您的主要问题，并能够专注于解决它。" },
            { feature: "回答品牌问题", benefit: "您将在30分钟内获得明确的答案，而不是花两三周的时间进行研究。" },
            { feature: "下一步建议", benefit: "您将知道从哪里开始行动，并节省您的时间。" }
        ], benefits: [] },
    strategy: { ...zhServiceDetails.strategy, label: "品牌策略与平台", description: "市场分析、品牌审核、定位和价值主张开发。",
        features: [
            { feature: "深入的市场和竞争对手分析", benefit: "您将确切地知道您在市场中的位置，并拥有明确的策略以从竞争对手中脱颖而出。" },
            { feature: "目标受众细分", benefit: "您将把您的营销预算投向特定的客户，从而显著提高其效率。" },
            { feature: "品牌平台（使命、价值观、理念）", benefit: "您的品牌将不仅仅是一个产品，而是一个客户信任和追随的理念。" },
            { feature: "品牌声音（语调）", benefit: "您将用客户的语言与他们交谈，与他们建立牢固的情感联系。" },
            { feature: "定位和独特销售主张（USP）", benefit: "您将在客户心目中对“为什么是您？”这个问题有一个清晰而有说服力的答案。" },
            { feature: "品牌架构和叙事（Storytelling）", benefit: "您的品牌故事和您的产品之间的联系将对客户具有吸引力和记忆力。" }
        ],
        benefits: []
    },
    commStrategy: { ...zhServiceDetails.commStrategy, label: "传播策略", description: "客户传播策略：语调、关键信息、渠道。", features: [
            { feature: "明确品牌的语调", benefit: "您的品牌在所有渠道上都将有统一且可识别的“声音”，这将增加信任。" },
            { feature: "制定关键信息", benefit: "您将为每个受众群体确定最有效的信息。" },
            { feature: "规划传播渠道", benefit: "您将把您的营销预算投向带来最大成果的渠道（社交网络、公关、广告）。" },
            { feature: "内容策略方向", benefit: "您将有一个清晰的计划来创建吸引客户并将其转变为忠实粉丝的内容。" }
        ], benefits: [] },
    namingStandard: { ...zhServiceDetails.namingStandard, label: "标准命名", description: "适合小型企业和初创公司。", features: [
            { feature: "3个简短、上口且易记的名称", benefit: "您将为您的品牌获得一个快速而优质的开端。" },
            { feature: "检查域名和社交网络中的可用性", benefit: "您选择的名称不会在数字环境中被占用。" },
            { feature: "听得懂、写得出、找得到的名称", benefit: "客户在寻找您时不会出错。" },
            { feature: "100% 满意保证", benefit: "我们将一直工作，直到找到您完全满意的名称。" }
        ], benefits: [] },
    namingPremium: { ...zhServiceDetails.namingPremium, label: "高级命名", description: "适合中型和成长型企业的战略方法。", features: [
            { feature: "5个战略性名称选项", benefit: "这些名称不仅美观，还将服务于您的业务目标。" },
            { feature: "域名、社交网络和2个类别的专利性检查", benefit: "您将确信名称的法律和数字纯洁性。" },
            { feature: "多种语言的语音和语义分析", benefit: "您将确信在进入国际市场时，您的名称在其他语言中不会有负面含义。" },
            { feature: "5年免费域名（.uz/.com）", benefit: "您将无需额外费用即可获得您最重要的数字资产。" },
            { feature: "听得懂、写得出、找得到的名称", benefit: "客户在寻找您时不会出错。" },
            { feature: "100% 满意保证", benefit: "我们将一直工作，直到找到您完全满意的名称。" }
        ], benefits: [] },
    namingVIP: { ...zhServiceDetails.namingVIP, label: "VIP命名", description: "适合大型和国际项目。", features: [
            { feature: "10多个独家名称选项和个人艺术总监监督", benefit: "您将获得最高水平的创意方法和经验。" },
            { feature: "为您的品牌提供故事（storytelling）的演示", benefit: "名称将不仅仅是一个词，而是一个吸引客户的故事。" },
            { feature: "对域名、社交网络和最多5个类别进行深入的专利检查", benefit: "您将获得最大的法律保护和安心。" },
            { feature: "10年免费域名（.uz和.com）", benefit: "您将确保您的长期数字未来。" },
            { feature: "协助提交专利申请（国家规费另付）", benefit: "我们将为您简化所有复杂的法律程序。" },
            { feature: "听得懂、写得出、找得到的名称", benefit: "客户在寻找您时不会出错。" },
            { feature: "100% 满意保证", benefit: "我们将一直工作，直到找到您完全满意的名称。" }
        ], benefits: [] },
    logoStandard: { ...zhServiceDetails.logoStandard, label: "标准标志", description: "为初创公司提供的快速解决方案。", features: [
            { feature: "2个标志概念", benefit: "您将为您的业务获得专业的视觉基础。" },
            { feature: "矢量标志文件（AI, EPS, PNG, JPG, PDF）", benefit: "您可以在任何尺寸和任何地方使用标志而不会损失质量。" },
            { feature: "100% 满意保证", benefit: "我们将一直工作，直到创建一个您完全满意的标志。" }
        ], benefits: [] },
    logoPremium: { ...zhServiceDetails.logoPremium, label: "标志与企业形象", description: "为那些认真发展品牌的企业。", features: [
            { feature: "5个标志概念", benefit: "您将有机会为您的品牌选择最完美的视觉解决方案。" },
            { feature: "企业形象（主色、字体、规则）", benefit: "您的品牌在所有接触点上都将有一致和专业的外观。" },
            { feature: "在15个以上的真实模型上展示", benefit: "您将清楚地了解您的标志和风格在现实生活中的样子。" },
            { feature: "矢量标志文件（AI, EPS, PNG, JPG, PDF）", benefit: "您可以在任何尺寸和任何地方使用标志而不会损失质量。" },
            { feature: "100% 满意保证", benefit: "我们将一直工作，直到创建一个您完全满意的标志。" }
        ], benefits: [] },
    logoVIP: { ...zhServiceDetails.logoVIP, label: "标志 + 企业形象 + 品牌手册", description: "扩展的形象和全面支持。", features: [
            { feature: "7个以上的高级标志概念和个人艺术总监参与", benefit: "您将获得最高水平的创造力和个性化方法。" },
            { feature: "企业形象（主色、字体、规则）", benefit: "您的品牌在所有接触点上都将有一致和专业的外观。" },
            { feature: "完整的品牌手册（30-50页）", benefit: "您将获得一个管理您品牌的“宪法”，其中包含所有规则和标准。" },
            { feature: "矢量标志文件（AI, EPS, PNG, JPG, PDF）", benefit: "您可以在任何尺寸和任何地方使用标志而不会损失质量。" },
            { feature: "100% 满意保证", benefit: "我们将一直工作，直到创建一个您完全满意的标志。" }
        ], benefits: [] },
    packaging: { ...zhServiceDetails.packaging, label: "包装设计", description: "为3个SKU开发包装，为印刷做准备。", features: [
            { feature: "市场和竞争对手分析", benefit: "您将找到一个能让您的产品在货架上脱颖而出的解决方案。" },
            { feature: "2个设计概念", benefit: "您将有机会为您的品牌选择最合适的风格。" },
            { feature: "最多3个SKU（产品类型）的设计适配", benefit: "您将为您的整个产品线拥有一个统一且一致的设计系统。" },
            { feature: "准备好印刷的文件", benefit: "您将在生产中获得高质量的结果，没有任何问题。" }
        ], benefits: [] },
    smm: { ...zhServiceDetails.smm, label: "社交网络风格", description: "以企业风格设计帖子和故事。", features: [
            { feature: "6个帖子模板", benefit: "您将获得针对不同类型内容（产品、促销、有用提示）的现成设计解决方案。" },
            { feature: "6个故事模板", benefit: "您也将在故事格式中保持品牌的统一风格。" },
            { feature: "个人资料的头像和亮点封面", benefit: "您的个人资料将获得专业且吸引人的外观。" },
            { feature: "Instagram指南", benefit: "您将获得关于如何有效使用模板的明确说明。" }
        ], benefits: [] },
    merch: { ...zhServiceDetails.merch, label: "品牌商品和载体", description: "服装、配饰、POSM材料的设计。", features: [
            { feature: "为员工设计T恤、帽子、连帽衫", benefit: "您将加强团队中的企业精神和品牌归属感。" },
            { feature: "为客户准备的礼物（笔记本、笔、杯子）", benefit: "您的品牌将进入客户的日常生活，并成为一个持续的提醒。" },
            { feature: "POSM材料（传单、横幅、展台）", benefit: "您将在销售点和活动中有效地推广您的品牌。" }
        ], benefits: [] },
    illustrations: { ...zhServiceDetails.illustrations, label: "插图与动画", description: "创建企业图形、信息图和动画。", features: [
            { feature: "一套独特的品牌插图", benefit: "您的品牌将获得自己独特的、竞争对手没有的视觉语言。" },
            { feature: "信息图设计", benefit: "您将以一种简单有趣的方式向您的受众传达复杂的信息。" },
            { feature: "标志和元素的动画", benefit: "您将使您的品牌在数字平台（网站、社交网络）上更加生动和引人注目。" }
        ], benefits: [] },
    urgency: { ...zhServiceDetails.urgency, label: "紧急项目（+50%）", description: "该项目将不按顺序在短时间内（2-3天）执行。", features: [
            { feature: "不按顺序开始工作", benefit: "项目成为首要任务。" },
            { feature: "缩短的截止日期", benefit: "您将比标准截止日期早得多地获得结果。" }
        ], benefits: [] },
    nda: { ...zhServiceDetails.nda, label: "保密协议（NDA）（+50%）", description: "关于不披露项目信息的协议。", features: [
            { feature: "签署具有法律约束力的文件", benefit: "您将获得关于您的项目信息不会透露给第三方的法律保证。" },
            { feature: "完全保密", benefit: "我们的团队不会在任何地方（作品集、社交网络）发布项目细节。" }
        ], benefits: [] }
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
