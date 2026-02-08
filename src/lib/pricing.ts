'use client';

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
            { feature: "Logotipning kuchli va zaif tomonlari tahlili", benefit: "Brendingizni qayerda kuchaytirish kerakligini aniq bilib olasiz, taxminlarga asoslanib pul sarflamaysiz." },
            { feature: "Raqobatchilarga nisbatan tahlil", benefit: "Bozorda qanday ajralib turish mumkinligi haqida tushunchaga ega bo'lasiz." },
            { feature: "Yaxshilash bo'yicha aniq tavsiyalar va yo'l xaritasi", benefit: "Keyingi qadamlaringiz aniq va tushunarli bo'ladi, bu esa vaqt va resurslaringizni tejaydi." }
        ]
    },
    namingCheck: {
        label: "Neyming Tekshiruvi",
        description: "Brend nomining O'zbekiston va xalqaro bazalarda bo'shligini tekshirish.",
        price: basePricesUSD.namingCheck,
        oldPrice: 158,
        discount: 0.5,
        note: null,
        features: [
            { feature: "O'zbekiston bazasi bo'yicha chuqur tekshiruv", benefit: "Mahalliy bozorda nomingizning huquqiy tozaligiga va kelajakda muammolar bo'lmasligiga ishonch hosil qilasiz." },
            { feature: "Xalqaro WIPO bazasi bo'yicha tekshiruv", benefit: "Xalqaro miqyosda kengayish imkoniyatini saqlab qolasiz va potentsial huquqiy to'qnashuvlarning oldini olasiz." },
            { feature: "Domen va ijtimoiy tarmoqlarda bo'shlik tekshiruvi", benefit: "Tanlagan nomingiz internetda band bo'lmaydi, marketingda to'siqsiz ishlaysiz." },
            { feature: "Huquqiy maslahat va risklarni baholash", benefit: "Patentlash jarayonida nimalarga e'tibor berish kerakligini bilib olasiz va nomingiz bilan bog'liq risklarni minimallashtirasiz." }
        ]
    },
    consultation: {
        label: "30 daqiqalik konsultatsiya",
        description: "Brending bo'yicha har qanday savolingizga tezkor yo'l-yo'riq va professional maslahat.",
        price: basePricesUSD.consultation,
        note: null,
        features: [
            { feature: "Biznesingizdagi muammoni aniqlashtirish", benefit: "Asosiy muammoingizni aniqlab, uni hal qilishga e'tiboringizni qaratasiz va resurslarni to'g'ri taqsimlaysiz." },
            { feature: "Brending bo'yicha savollarga tezkor javoblar", benefit: "Ikki-uch haftalik izlanish o'rniga, 30 daqiqada aniq javoblar olasiz, bu sizga tezroq harakat qilish imkonini beradi." },
            { feature: "Keyingi qadamlar bo'yicha aniq tavsiyalar", benefit: "Harakatingizni qayerdan boshlashni bilib olasiz, vaqtingiz tejaladi va noto'g'ri qarorlardan saqlanasiz." }
        ]
    },
    strategy: {
        label: "Brend-strategiya va platforma",
        description: "Biznesingiz uchun natija keltiradigan poydevor — bozor tahlili, pozitsiyalash va kommunikatsiya.",
        price: basePricesUSD.strategy,
        note: null,
        features: [
            { feature: "Chuqurlashtirilgan bozor va raqobatchilar tahlili", benefit: "Bozordagi o'rningizni aniq bilasiz va raqobatchilardan ajralib turish uchun aniq strategiyaga ega bo'lasiz." },
            { feature: "Maqsadli auditoriyani segmentlash va psixologik portretini yaratish", benefit: "Marketing byudjetingizni aniq mijozlarga yo'naltirib, uning samaradorligini keskin oshirasiz." },
            { feature: "Brend platformasi (missiya, qadriyatlar, falsafa)", benefit: "Brendingiz shunchaki mahsulot emas, balki mijozlar ishonadigan va ergashadigan g'oyaga aylanadi." },
            { feature: "Brend ovozi (Tone of Voice) va kommunikatsiya uslubi", benefit: "Mijozlar bilan ularning tilida gaplashib, ular bilan mustahkam hissiy aloqa o'rnatasiz." },
            { feature: "Pozitsiyalash va Unikal Savdo Taklifi (UST)", benefit: "Mijozlar ongida 'Nega aynan siz?' degan savolga aniq va ishonchli javobga ega bo'lasiz." },
            { feature: "Brend arxitekturasi va hikoyasi (Storytelling)", benefit: "Brendingiz tarixi va mahsulotlaringiz o'rtasidagi bog'liqlik mijozlar uchun jozibali va esda qolarli bo'ladi." }
        ]
    },
    commStrategy: {
        label: "Kommunikatsion strategiya",
        description: "Mijozlar bilan muloqot strategiyasi: ohang, asosiy xabarlar, kanallar.",
        price: basePricesUSD.commStrategy,
        note: null,
        features: [
            { feature: "Brend ovozini (Tone of Voice) aniqlashtirish va qo'llanma yaratish", benefit: "Brendingiz barcha kanallarda yagona va taniladigan 'ovoz'ga ega bo'ladi, bu ishonchni oshiradi." },
            { feature: "Asosiy xabarlarni (Key Messages) ishlab chiqish", benefit: "Har bir auditoriya segmenti uchun eng samarali ta'sir qiluvchi xabarlarni aniqlaysiz va shu orqali konversiyani oshirasiz." },
            { feature: "Kommunikatsiya kanallarini rejalashtirish va byudjetlashtirish", benefit: "Marketing byudjetingizni eng ko'p natija keltiradigan kanallarga (ijtimoiy tarmoqlar, PR, reklama) yo'naltirasiz." },
            { feature: "Kontent strategiyasi yo'nalishlari va rubrikalar", benefit: "Mijozlarni jalb qiladigan va ularni sodiq muxlislarga aylantiradigan kontent yaratish uchun aniq rejaga ega bo'lasiz." }
        ]
    },
    namingStandard: {
        label: "Naming STANDART",
        description: "Kichik biznes va startaplar uchun ideal.",
        price: basePricesUSD.namingStandard,
        note: null,
        features: [
            { feature: "3 ta jarangli va esda qolarli nom", benefit: "Brendingiz uchun tez va sifatli start olasiz." },
            { feature: "Oson eslab qolish va talaffuz qilish", benefit: "Mijozlar sizni qidirganda adashib qolishmaydi." },
            { feature: "Internetda sayt uchun .uz domen bo'shligi tekshiriladi", benefit: "Tanlagan nomingiz raqamli muhitda band bo'lmaydi." },
            { feature: "Ijtimoiy tarmoqlarda (Telegram, Instagram) bo'shligi tekshiriladi", benefit: "Brendingiz uchun muhim ijtimoiy tarmoq nomlarini oldindan band qilasiz." }
        ],
        timeline: "Birinchi konsepsiyalar 7–10 ish kuni ichida taqdim etiladi"
    },
    namingPremium: {
        label: "Naming PREMIUM",
        description: "O'rta va rivojlanayotgan biznes uchun strategik yondashuv.",
        price: basePricesUSD.namingPremium,
        note: null,
        features: [
            { feature: "5 ta strategik nom variantlari", benefit: "Nomlar shunchaki chiroyli emas, biznes maqsadingizga xizmat qiladi." },
            { feature: "Bir nechta tilda fonetik va semantik tahlil", benefit: "Xalqaro bozorga chiqsangiz, nomingiz boshqa tillarda salbiy ma'no anglatmasligiga ishonch hosil qilasiz." },
            { feature: "Internetda sayt uchun .uz domen bo'shligi tekshiriladi", benefit: "Tanlagan nomingiz raqamli muhitda band bo'lmaydi." },
            { feature: "Ijtimoiy tarmoqlarda (Telegram, Instagram) bo'shligi tekshiriladi", benefit: "Brendingiz uchun muhim ijtimoiy tarmoq nomlarini oldindan band qilasiz." },
            { feature: "2 ta klass bo'yicha patentga yaroqlilik tekshiruvi", benefit: "Nomning huquqiy jihatdan tozaligiga ishonch hosil qilasiz." },
            { feature: "5 yilga bepul .uz domen", benefit: "Eng muhim raqamli aktivingizni qo'lga kiritasiz, qo'shimcha xarajatsiz." }
        ],
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
            { feature: "Internetda sayt uchun .uz domen bo'shligi tekshiriladi", benefit: "Tanlagan nomingiz raqamli muhitda band bo'lmaydi." },
            { feature: "Ijtimoiy tarmoqlarda (Telegram, Instagram) bo'shligi tekshiriladi", benefit: "Brendingiz uchun muhim ijtimoiy tarmoq nomlarini oldindan band qilasiz." },
            { feature: "3 tagacha klass bo'yicha chuqur patent tekshiruvi", benefit: "Maksimal darajada huquqiy himoya va xotirjamlikka erishasiz." },
            { feature: "10 yilga bepul .uz domen", benefit: "Uzoq muddatli raqamli kelajagingizni ta'minlaysiz." },
            { feature: "Patentga topshirishda yordam (davlat boji alohida)", benefit: "Biz siz uchun barcha murakkab yuridik jarayonlarni osonlashtiramiz." }
        ],
        timeline: "Birinchi konsepsiyalar 20–25 ish kuni ichida taqdim etiladi"
    },
    logoStandard: {
        label: "Logo STANDART",
        description: "Startaplar va tezkor yechimga muhtojlar uchun.",
        price: basePricesUSD.logoStandard,
        note: null,
        features: [
            { feature: "Brendingiz strategiyasiga asoslangan 3 ta professional logotip konsepsiyasi", benefit: "Biznesingiz uchun tez va sifatli vizual asosga ega bo'lasiz." },
            { feature: "5+ real maketlarda namoyish", benefit: "Logotip real hayotda qanday ko'rinishini tasavvur qilasiz." },
            { feature: "Logotipdan foydalanish bo'yicha mini-qo'llanma", benefit: "Logotipni qayerda va qanday ishlatish bo'yicha aniq ko'rsatmalar olasiz." },
            { feature: "Ijtimoiy tarmoqlar uchun tayyor avatar", benefit: "Brendingiz raqamli platformalarda darhol professional ko'rinadi." },
            { feature: "Logotipning barcha kerakli formatlari (AI, EPS, PNG, PDF)", benefit: "Logotipni har qanday joyda sifatini yo'qotmasdan ishlata olasiz." }
        ],
        timeline: "Birinchi konsepsiyalar 7–10 ish kuni ichida taqdim etiladi"
    },
    logoPremium: {
        label: "Logo+Firma uslubi PREMIUM",
        description: "Brendini jiddiy rivojlantirishni istagan bizneslar uchun.",
        price: basePricesUSD.logoPremium,
        note: null,
        features: [
            { feature: "5 ta strategik logotip konsepsiyasi", benefit: "Brendingiz uchun eng mukammal vizual yechimni tanlash imkoniyatiga ega bo'lasiz." },
            { feature: "Brendning vizual metaforasi", benefit: "Logotipingiz shunchaki rasm emas, balki chuqur ma'no va tarixga ega bo'lgan belgiga aylanadi." },
            { feature: "Firma uslubi (ranglar, shriftlar)", benefit: "Brendingiz barcha aloqa nuqtalarida yagona va professional ko'rinishga ega bo'ladi." },
            { feature: "Firma uslubi bo'yicha qisqa qo'llanma (guideline)", benefit: "Dizayn elementlarini qanday ishlatish bo'yicha aniq qoidalarga ega bo'lasiz." },
            { feature: "15+ real maketlarda namoyish", benefit: "Logotip va uslubingiz real hayotda qanday ko'rinishini aniq tasavvur qilasiz." },
            { feature: "Barcha kerakli formatdagi fayllar", benefit: "Logotipni har qanday o'lchamda va istalgan joyda sifatini yo'qotmasdan ishlata olasiz." }
        ],
        recommended: true,
        timeline: "Birinchi konsepsiyalar 14–20 ish kuni ichida taqdim etiladi"
    },
    logoVIP: {
        label: "Logo+Firma uslubi+Brandbook VIP",
        description: "Bozorga to'liq tayyorlik va maksimal ta'sir uchun.",
        price: basePricesUSD.logoVIP,
        note: null,
        features: [
            { feature: "7+ ta eksklyuziv logotip konsepsiyasi va shaxsiy art-direktor ishtiroki", benefit: "Eng yuqori darajadagi ijodkorlik va individual yondashuvga ega bo'lasiz." },
            { feature: "To'liq firma uslubi tizimi", benefit: "Brendingiz barcha aloqa nuqtalarida yagona va professional ko'rinishga ega bo'ladi." },
            { feature: "To'liq Brendbuk (30-50 sahifa)", benefit: "Brendingizni boshqarish uchun barcha qoidalar va standartlar jamlangan 'konstitutsiya'ga ega bo'lasiz." },
            { feature: "Brend uchun shaxsiy illustratsiyalar yoki ikonikalar to'plami", benefit: "Brendingiz raqobatchilarda yo'q, o'ziga xos vizual tilga ega bo'ladi." },
            { feature: "25+ real maketlarda namoyish", benefit: "Brendingiz qanday ko'rinishini har tomonlama tasavvur qilasiz." },
            { feature: "Ijtimoiy tarmoqlar uchun shablonlar to'plami", benefit: "Marketing jamoangiz brend uslubida mustaqil kontent yarata oladi." },
            { feature: "Barcha kerakli formatdagi fayllar", benefit: "Logotipni har qanday o'lchamda va istalgan joyda sifatini yo'qotmasdan ishlata olasiz." }
        ],
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
        ]
    },
    smm: {
        label: "Ijtimoiy tarmoqlar uchun stil",
        description: "Postlar va storislarni firma uslubi va brendingda bezash.",
        price: basePricesUSD.smm,
        note: null,
        features: [
            { feature: "6 ta post uchun shablon", benefit: "Turli xil kontent turlari (mahsulot, aksiya, foydali maslahat) uchun tayyor dizayn yechimlariga ega bo'lasiz." },
            { feature: "6 ta stories uchun shablon", benefit: "Stories formatida ham brendingizning yagona uslubini saqlab qolasiz." },
            { feature: "Profil uchun avatar va highlight cover'lar", benefit: "Profilingiz professional va jozibador ko'rinishga ega bo'ladi." },
            { feature: "Instagram uchun qo'llanma", benefit: "Shablonlardan qanday samarali foydalanish haqida aniq ko'rsatmalarga ega bo'lasiz." }
        ]
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
        ]
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
        ]
    },
    urgency: {
        label: "Shoshilinch loyiha (+50%)",
        description: "Loyiha navbatsiz, qisqa muddatda (2-3 kun) tayyorlanadi.",
        price: 0,
        note: "+50%",
        features: [
            { feature: "Navbatdan tashqari ish boshlash", benefit: "Loyiha birinchi prioritetga aylanadi." },
            { feature: "Qisqartirilgan muddatlar", benefit: "Natijalarni standart muddatlardan ancha oldin olasiz." }
        ]
    },
    nda: {
        label: "Maxfiylik shartnomasi (NDA) (+50%)",
        description: "Loyiha ma'lumotlarini oshkor etmaslik shartnomasi.",
        price: 0,
        note: "+50%",
        features: [
            { feature: "Yuridik kuchga ega hujjat imzolanishi", benefit: "Sizning loyihangiz ma'lumotlari uchinchi tomonga oshkor etilmasligiga qonuniy kafolat olasiz." },
            { feature: "To'liq maxfiylik", benefit: "Bizning jamoamiz loyiha tafsilotlarini hech qayerda (portfolio, ijtimoiy tarmoqlar) e'lon qilmaydi." }
        ]
    }
};

const ruServiceDetails: typeof uzServiceDetails = JSON.parse(JSON.stringify(uzServiceDetails));
Object.assign(ruServiceDetails, {
    audit: { ...ruServiceDetails.audit, label: "Аудит логотипа", description: "Анализ существующего логотипа и рекомендации по улучшению." },
    namingCheck: { ...ruServiceDetails.namingCheck, label: "Проверка нейминга", description: "Проверка доступности имени бренда в базах данных Узбекистана и международных базах." },
    consultation: { ...ruServiceDetails.consultation, label: "30-минутная консультация", description: "Быстрые рекомендации и профессиональные советы по любому вопросу брендинга." },
    strategy: { ...ruServiceDetails.strategy, label: "Бренд-стратегия и платформа", description: "Анализ рынка, аудит бренда, разработка позиционирования и ценностного предложения." },
    commStrategy: { ...ruServiceDetails.commStrategy, label: "Коммуникационная стратегия", description: "Стратегия общения с клиентами: тон, ключевые сообщения, каналы." },
    namingStandard: { ...ruServiceDetails.namingStandard, label: "Naming СТАНДАРТ", description: "Идеально для малого бизнеса и стартапов." },
    namingPremium: { ...ruServiceDetails.namingPremium, label: "Naming ПРЕМИУМ", description: "Для среднего и развивающегося бизнеса." },
    namingVIP: { ...ruServiceDetails.namingVIP, label: "Naming VIP", description: "Для крупных и международных проектов." },
    logoStandard: { ...ruServiceDetails.logoStandard, label: "Logo СТАНДАРТ", description: "Для стартапов и тех, кому нужно быстрое решение." },
    logoPremium: { ...ruServiceDetails.logoPremium, label: "Logo+Фирменный стиль ПРЕМИУМ", description: "Для бизнесов, серьезно настроенных на развитие своего бренда." },
    logoVIP: { ...ruServiceDetails.logoVIP, label: "Logo+Фирменный стиль+Brandbook VIP", description: "Для полного выхода на рынок и максимального эффекта." },
    packaging: { ...ruServiceDetails.packaging, label: "Дизайн упаковки", description: "Разработка упаковки для 3 SKU, подготовка к печати." },
    smm: { ...ruServiceDetails.smm, label: "Стиль для социальных сетей", description: "Оформление постов и сторис в фирменном стиле." },
    merch: { ...ruServiceDetails.merch, label: "Брендированный мерч и носители", description: "Дизайн одежды, аксессуаров, POSM-материалов." },
    illustrations: { ...ruServiceDetails.illustrations, label: "Иллюстрации и анимация", description: "Создание фирменной графики, инфографики и анимаций." },
    urgency: { ...ruServiceDetails.urgency, label: "Срочный проект (+50%)", description: "Проект выполняется вне очереди, в короткие сроки (2-3 дня)." },
    nda: { ...ruServiceDetails.nda, label: "Договор о неразглашении (NDA) (+50%)", description: "Договор о неразглашении информации о проекте." }
});

const enServiceDetails: typeof uzServiceDetails = JSON.parse(JSON.stringify(uzServiceDetails));
Object.assign(enServiceDetails, {
    audit: { ...enServiceDetails.audit, label: "Logo Audit", description: "Analysis of the existing logo and recommendations for improvement." },
    namingCheck: { ...enServiceDetails.namingCheck, label: "Naming Check", description: "Checking the availability of the brand name in Uzbekistan and international databases." },
    consultation: { ...enServiceDetails.consultation, label: "30-minute consultation", description: "Quick guidance and professional advice on any branding question." },
    strategy: { ...enServiceDetails.strategy, label: "Brand Strategy and Platform", description: "Market analysis, brand audit, positioning and value proposition development." },
    commStrategy: { ...enServiceDetails.commStrategy, label: "Communication Strategy", description: "Customer communication strategy: tone, key messages, channels." },
    namingStandard: { ...enServiceDetails.namingStandard, label: "Naming STANDARD", description: "Ideal for small businesses and startups." },
    namingPremium: { ...enServiceDetails.namingPremium, label: "Naming PREMIUM", description: "A strategic approach for medium and growing businesses." },
    namingVIP: { ...enServiceDetails.namingVIP, label: "Naming VIP", description: "For large and international projects." },
    logoStandard: { ...enServiceDetails.logoStandard, label: "Logo STANDARD", description: "For startups and those who need a quick solution." },
    logoPremium: { ...enServiceDetails.logoPremium, label: "Logo+Corporate Identity PREMIUM", description: "For businesses serious about developing their brand." },
    logoVIP: { ...enServiceDetails.logoVIP, label: "Logo+Corporate Identity+Brandbook VIP", description: "For a full market launch and maximum impact." },
    packaging: { ...enServiceDetails.packaging, label: "Packaging Design", description: "Packaging development for 3 SKUs, preparation for printing." },
    smm: { ...enServiceDetails.smm, label: "Style for Social Networks", description: "Design of posts and stories in corporate style." },
    merch: { ...enServiceDetails.merch, label: "Branded Merch and Carriers", description: "Design of clothing, accessories, POSM materials." },
    illustrations: { ...enServiceDetails.illustrations, label: "Illustrations and Animation", description: "Creation of corporate graphics, infographics and animations." },
    urgency: { ...enServiceDetails.urgency, label: "Urgent Project (+50%)", description: "The project is carried out out of turn, in a short time (2-3 days)." },
    nda: { ...enServiceDetails.nda, label: "Non-Disclosure Agreement (NDA) (+50%)", description: "Agreement on non-disclosure of project information." }
});

const zhServiceDetails: typeof uzServiceDetails = JSON.parse(JSON.stringify(uzServiceDetails));
Object.assign(zhServiceDetails, {
    audit: { ...zhServiceDetails.audit, label: "标志审核", description: "对现有标志进行分析并提供改进建议。" },
    namingCheck: { ...zhServiceDetails.namingCheck, label: "名称检查", description: "检查品牌名称在乌兹别克斯坦和国际数据库中的可用性。" },
    consultation: { ...zhServiceDetails.consultation, label: "30分钟咨询", description: "为任何品牌问题提供快速指导和专业建议。" },
    strategy: { ...zhServiceDetails.strategy, label: "品牌策略与平台", description: "市场分析、品牌审核、定位和价值主张开发。" },
    commStrategy: { ...zhServiceDetails.commStrategy, label: "传播策略", description: "客户传播策略：语调、关键信息、渠道。" },
    namingStandard: { ...zhServiceDetails.namingStandard, label: "命名 标准", description: "适合小型企业和初创公司。" },
    namingPremium: { ...zhServiceDetails.namingPremium, label: "命名 高级", description: "适合中型和成长型企业的战略方法。" },
    namingVIP: { ...zhServiceDetails.namingVIP, label: "命名 VIP", description: "适合大型和国际项目。" },
    logoStandard: { ...zhServiceDetails.logoStandard, label: "标志 标准", description: "适用于初创公司和需要快速解决方案的公司。" },
    logoPremium: { ...zhServiceDetails.logoPremium, label: "标志+企业形象 高级", description: "适用于认真发展其品牌的企业。" },
    logoVIP: { ...zhServiceDetails.logoVIP, label: "标志+企业形象+品牌手册 VIP", description: "为了全面推向市场并获得最大影响。" },
    packaging: { ...zhServiceDetails.packaging, label: "包装设计", description: "为3个SKU开发包装，为印刷做准备。" },
    smm: { ...zhServiceDetails.smm, label: "社交网络风格", description: "以企业风格设计帖子和故事。" },
    merch: { ...zhServiceDetails.merch, label: "品牌商品和载体", description: "服装、配饰、POSM材料的设计。" },
    illustrations: { ...zhServiceDetails.illustrations, label: "插图与动画", description: "创建企业图形、信息图和动画。" },
    urgency: { ...zhServiceDetails.urgency, label: "紧急项目（+50%）", description: "该项目将不按顺序在短时间内（2-3天）执行。" },
    nda: { ...zhServiceDetails.nda, label: "保密协议（NDA）（+50%）", description: "关于不披露项目信息的协议。" }
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

const PROMO_CODES: Record<string, number> = {
    'PCG': 0.50,
    'KURSDOSH': 0.50,
    'TEZ NATIJA': 0.50,
    'PCG3KUN': 0.30
};

interface PackageSelections {
    selectedServices: SelectedServices;
    wantsUpfrontPayment: boolean;
    isPackageDiscountEnabled?: boolean;
    promoCode?: string;
}

export interface PriceDetails {
    base: number;
    final: number;
    discountApplied: { name: string, value: number, isPackageDiscount?: boolean, isPromoDiscount?: boolean }[];
    savings: number;
    bonus: string | null;
    surcharges: { name: string, value: number }[];
    canApplyPackageDiscount: boolean;
    isPromoValid?: boolean;
}


export const calculatePackagePrice = (selections: PackageSelections, lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz'): PriceDetails => {
    const { selectedServices, wantsUpfrontPayment, isPackageDiscountEnabled = true, promoCode } = selections;
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
                if (premiumServices.includes(key) || standardServices.includes(key)) {
                    mainServicesCount++;
                }
            }
        }
    }

    const totalBasePrice = nonVipBasePrice + vipServicesPrice;
    
    // Surcharges (always on base)
    let surchargeAmount = 0;
    const surcharges: { name: string, value: number }[] = [];

    if (selectedServices.urgency) {
        const val = totalBasePrice * urgencySurcharge;
        surchargeAmount += val;
        surcharges.push({ 
            name: lang === 'ru' ? 'Надбавка за срочность (+50%)' : (lang === 'en' ? 'Urgency Surcharge (+50%)' : (lang === 'zh' ? '紧急项目附加费 (+50%)' : 'Shoshilinch uchun ustama (+50%)')), 
            value: val 
        });
    }

    if (selectedServices.nda) {
        const val = totalBasePrice * ndaSurcharge;
        surchargeAmount += val;
        surcharges.push({ 
            name: lang === 'ru' ? 'Надбавка за NDA (+50%)' : (lang === 'en' ? 'NDA Surcharge (+50%)' : (lang === 'zh' ? '保密协议附加费 (+50%)' : 'NDA uchun ustama (+50%)')), 
            value: val 
        });
    }

    const normalizedPromo = promoCode?.trim().toUpperCase();
    const promoDiscountValue = PROMO_CODES[normalizedPromo || ''];
    const isPromoValid = !!promoDiscountValue;

    const discountsApplied: { name: string, value: number, isPackageDiscount?: boolean, isPromoDiscount?: boolean }[] = [];
    let finalPrice = totalBasePrice + surchargeAmount;

    if (isPromoValid) {
        // PROMO CODE active: CANCEL ALL OTHER DISCOUNTS
        const discountValue = finalPrice * promoDiscountValue;
        const discountPercent = Math.round(promoDiscountValue * 100);
        const discountName = lang === 'ru' ? `Промокод (${promoCode}) (-${discountPercent}%)` : (lang === 'en' ? `Promo Code (${promoCode}) (-${discountPercent}%)` : (lang === 'zh' ? `优惠码 (${promoCode}) (-${discountPercent}%)` : `Promokod (${promoCode}) (-${discountPercent}%)`));
        discountsApplied.push({ name: discountName, value: discountValue, isPromoDiscount: true });
        finalPrice -= discountValue;
    } else {
        // Standard Discount Logic
        const standardPackageSelected = hasNamingStandard && hasLogoStandard;
        let packageDiscountAmount = 0;

        if (isPackageDiscountEnabled) {
            if (standardPackageSelected) {
                const standardPackagePrice = sd.namingStandard.price + sd.logoStandard.price;
                packageDiscountAmount = standardPackagePrice * packageDiscount;
                const discountName = lang === 'ru' ? 'Пакетная скидка (Стандарт) (-20%)' : (lang === 'en' ? 'Package Discount (Standard) (-20%)' : (lang === 'zh' ? '套餐折扣 (标准) (-20%)' : 'Paketli chegirma (Standard) (-20%)'));
                discountsApplied.push({ name: discountName, value: packageDiscountAmount, isPackageDiscount: true });
            } else if (mainServicesCount >= packageDiscountThreshold) {
                packageDiscountAmount = nonVipBasePrice * packageDiscount;
                const discountName = lang === 'ru' ? 'Пакетная скидка (-20%)' : (lang === 'en' ? 'Package Discount (-20%)' : (lang === 'zh' ? '套餐折扣 (-20%)' : 'Paketli chegirma (-20%)'));
                discountsApplied.push({ name: discountName, value: packageDiscountAmount, isPackageDiscount: true });
            }
        }

        finalPrice -= packageDiscountAmount;

        if (wantsUpfrontPayment) {
            const upfrontDiscountAmount = finalPrice * upfrontDiscount;
            const discountName = lang === 'ru' ? 'За предоплату (-10%)' : (lang === 'en' ? 'For upfront payment (-10%)' : (lang === 'zh' ? '预付款折扣 (-10%)' : 'Oldindan to\'lov uchun (-10%)'));
            discountsApplied.push({ name: discountName, value: upfrontDiscountAmount });
            finalPrice -= upfrontDiscountAmount;
        }
    }

    const canApplyPackageDiscount = (hasNamingStandard && hasLogoStandard) || mainServicesCount >= packageDiscountThreshold;
    const savings = (totalBasePrice + surchargeAmount) - finalPrice;

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
        canApplyPackageDiscount,
        isPromoValid
    };
}


export const generateSummary = (selections: PackageSelections, lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz') => {
    const { selectedServices } = selections;
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

    const { discountApplied, bonus, surcharges, isPromoValid } = calculatePackagePrice(selections, lang);

    const conditions = [];

    if (surcharges.some(s => s.name.includes('Shoshilinch') || s.name.includes('Срочность') || s.name.includes('Urgency') || s.name.includes('紧急'))) {
        conditions.push(lang === 'ru' ? "Срочный" : lang === 'en' ? 'Urgent' : lang === 'zh' ? '紧急' : "Shoshilinch");
    }
     if (surcharges.some(s => s.name.includes('NDA'))) {
        conditions.push("NDA");
    }
    
    // Promokod bo'lsa yoki oldindan to'lov tanlangan bo'lsa 100% upfront majburiyati
    if (isPromoValid || selections.wantsUpfrontPayment) {
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
