

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
            { feature: "Domen bo'shligini tekshirish", benefit: "Brendingiz uchun mos veb-sayt nomini topishni kafolatlaysiz." },
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
        description: "Bozor tahlili, brend auditi, pozitsiyalash va qadriyatlar taklifini ishlab chiqish.", 
        price: basePricesUSD.strategy, 
        note: null, 
        features: [
            { feature: "Bozor va raqobatchilar tahlili", benefit: "Raqobatchilardan qanday ajralib turishni va bozorning 'bo'sh joylari'ni bilib olasiz." },
            { feature: "Brend platformasi (missiya, qadriyatlar)", benefit: "Kompaniyangiz shunchaki pul ishlash uchun emas, balki kattaroq maqsadga ega ekanligini his qilasiz va buni mijozlarga yetkaza olasiz." },
            { feature: "Pozitsiyalash strategiyasi", benefit: "Mijozlar ongida aniq bir o'rin egallaysiz (masalan, 'eng tez', 'eng sifatli', 'eng innovatsion')." },
            { feature: "Brend arxitekturasi", benefit: "Kelajakda yangi mahsulotlar qo'shilganda brendingiz yaxlitligini saqlab qolish tizimiga ega bo'lasiz." }
        ],
        benefits: ["Biznesingiz uchun aniq rivojlanish xaritasini oling", "Marketing xarajatlaringizni optimallashtiring", "Bozorda mustahkam o'rin egallang"] 
    },
    commStrategy: { 
        label: "Kommunikatsion strategiya", 
        description: "Mijozlar bilan muloqot strategiyasi: ohang, asosiy xabarlar, kanallar.", 
        price: basePricesUSD.commStrategy, 
        note: null, 
        features: [
            { feature: "Maqsadli auditoriya segmentatsiyasi", benefit: "Har bir mijoz guruhiga uning tilida gapirib, sotuv samaradorligini oshirasiz." },
            { feature: "Brend ovozi (Tone of Voice)", benefit: "Brendingiz odamdek gapira boshlaydi, bu esa mijozlar bilan hissiy aloqani kuchaytiradi." },
            { feature: "Asosiy xabarlar (Key Messages)", benefit: "Barcha reklama va kontentingizda yagona, kuchli g'oyani ilgari surasiz." },
            { feature: "Kommunikatsiya kanallari rejasi", benefit: "Marketing byudjetingizni eng samarali kanallarga yo'naltirib, ortiqcha xarajatlardan qutulasiz." }
        ],
        benefits: ["Mijozlaringiz bilan to'g'ri til topishing", "Sotuvlaringizni oshiruvchi muloqot tizimini yarating", "Brendingizga sodiqlikni oshiring"] 
    },
    namingStandard: { 
        label: "Naming Standard", 
        description: "Kichik biznes uchun ideal.", 
        price: basePricesUSD.namingStandard, 
        note: null, 
        features: [
            { feature: "3 ta nom varianti ishlab chiqiladi", benefit: "Sizda bir nechta kuchli variantlardan tanlash imkoniyati bo'ladi." },
            { feature: "Domen va ijtimoiy tarmoqlarda bo'shlik tekshiriladi", benefit: "Tanlagan nomingiz raqamli muhitda band bo'lmaydi, marketingda to'siqsiz ishlaysiz." },
            { feature: "Patent bo‘yicha 1 klass auditi qilinadi", benefit: "Kelajakdagi katta huquqiy muammolarning oldini olasiz." },
            { feature: "Har bir variant fonetik jihatdan tekshiriladi", benefit: "Nomingiz oson talaffuz qilinadi va esda qoladi." }
        ], 
        benefits: ["Tez va hamyonbop nomga ega bo'ling", "Biznesingizga professional start bering"], 
        timeline: "Birinchi konsepsiyalar 7–10 ish kuni ichida taqdim etiladi" 
    },
    namingPremium: { 
        label: "Naming Premium", 
        description: "O'rta va rivojlanayotgan biznes uchun.", 
        price: basePricesUSD.namingPremium, 
        note: null, 
        features: [
            { feature: "5+ nom varianti ishlab chiqiladi", benefit: "Strategiyangizga mos bir nechta kuchli yo'nalishdan eng yaxshisini tanlab olasiz." },
            { feature: "6 tilda semantik va fonetik tekshiruv", benefit: "Xalqaro bozorga chiqqanda nomingiz salbiy ma'no bermaydi va oson talaffuz qilinadi." },
            { feature: "Patent bo‘yicha 2 klass auditi va huquqiy xulosa", benefit: "Brend nomingizni huquqiy jihatdan himoya qilish uchun to'liq asosga ega bo'lasiz." },
            { feature: "5 yilga domen band qilib beriladi", benefit: "Eng muhim onlayn aktivingiz 5 yil davomida himoyada bo'ladi." }
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
            { feature: "Shaxsan Baxtiyorjon Gaziyev ishtiroki va nazorati", benefit: "Sizga top darajadagi mutaxassisning bevosita e’tibori tushadi — nomingiz tasodifga emas, tajribaga tayangan bo‘ladi." },
            { feature: "10+ keng konsepsiyali nom variantlari", benefit: "Sizda tanlov keng bo‘ladi — bir nechta kuchli yo‘nalishdan sizga eng ko‘p foyda keltiradiganini tanlaysiz." },
            { feature: "10 yilga domen band qilib beriladi", benefit: "Onlayn makoningiz 10 yil davomida xavfsiz. Raqobatchilar domeningizni olib qo‘yolmaydi." },
            { feature: "Har bir nom uchun storytelling asosida tushuntirish", benefit: "Siz brend nomini chiroyli va ishonchli tarzda asoslay olasiz. Investor, hamkor yoki mijoz eshitishi bilanoq nimaga bu nom tanlanganini tushunadi." },
            { feature: "3 oygacha post-delivery huquqiy maslahat va kuzatuv", benefit: "Nom ishga tushgandan keyin ham yolg'iz qolmaysiz. Patent, domen, huquqiy masalalar bo'yicha qo'llab-quvvatlov davom etadi." }
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
            { feature: "Kompaniya brifi asosida 3 ta logotip konsepsiyasi", benefit: "Biznesingizga mos bir nechta variantdan birini tanlab olish imkoniyatiga ega bo'lasiz." },
            { feature: "5 ta touchpoint vizualizatsiya", benefit: "Logotipingiz real hayotda (vizitka, post, web) qanday ko'rinishini oldindan ko'rasiz." },
            { feature: "Logotip vektor fayllari (AI, EPS, PNG, JPG, PDF)", benefit: "Logotipni istalgan o'lchamda, istalgan joyda sifatini yo'qotmasdan ishlata olasiz." }
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
            { feature: "5 ta strategiyaga mos logotip konsepsiyasi", benefit: "Logotipingiz shunchaki chiroyli emas, balki biznes maqsadingizga xizmat qiladigan bo'ladi." },
            { feature: "Firma uslubi (asosiy ranglar, shriftlar, qoidalar)", benefit: "Barcha marketing materiallaringiz bir xil, professional ko'rinishda bo'ladi, bu esa brendingizni mustahkamlaydi." },
            { feature: "15+ touchpoint vizualizatsiya", benefit: "Brendingiz turli vaziyatlarda (reklama, qadoq, ijtimoiy tarmoq) qanday ishlashini aniq ko'rasiz." },
            { feature: "10 ta Telegram stiker", benefit: "Mijozlar bilan muloqotda brendingizni norasmiy va qiziqarli tarzda namoyon qilasiz." }
        ], 
        benefits: ["Brendingiz uchun to'liq va tizimli vizual yechimga ega bo'ling", "Mijozlar ongida mustahkam va yagona obraz yarating", "Marketing materiallaringizda professional ko'rinishga erishing"], 
        recommended: true, 
        timeline: "Birinchi konsepsiyalar 14–20 ish kuni ichida taqdim etiladi" 
    },
    logoVIP: { 
        label: "Logo + Firma uslubi + Brandbook", 
        description: "Kengaytirilgan identifikatsiya va to'liq qo'llab-quvvatlash.", 
        price: basePricesUSD.logoVIP, 
        note: null, 
        features: [
            { feature: "Shaxsan Baxtiyorjon Gaziyev ishtiroki", benefit: "Loyihangiz sohaning eng tajribali mutaxassislaridan biri tomonidan shaxsan nazorat qilinadi." },
            { feature: "8+ strategiyaga asoslangan logotip konsepsiyasi", benefit: "Brendingiz uchun eng mukammal yechimni topish uchun maksimal darajada keng tanlovga ega bo'lasiz." },
            { feature: "Vizual Brandbook va Logobook", benefit: "Brendingizni boshqarish uchun 'konstitutsiya'ga ega bo'lasiz, bu kelajakda dizayn xarajatlaringizni tejaydi." },
            { feature: "Logotip animatsiyasi (premium sifatli)", benefit: "Raqamli platformalarda brendingiz jonlanadi va raqobatchilardan keskin ajralib turadi." },
            { feature: "3 oygacha post-delivery qo‘llab-quvvatlash", benefit: "Loyiha tugaganidan keyin ham dizaynni amaliyotga tatbiq etishda yolg'iz qolmaysiz." }
        ], 
        benefits: ["Brendingiz uchun 'kalit taslim' yechim oling", "Bozorda premium segmentga da'vo qiling", "Brendingizni boshqarish uchun to'liq qo'llanma va vositalarga ega bo'ling"], 
        timeline: "Birinchi konsepsiyalar 20–30 ish kuni ichida taqdim etiladi" 
    },
    packaging: { 
        label: "Qadoq dizayni", 
        description: "3 SKU uchun qadoq ishlab chiqish, chop etishga tayyorlash.", 
        price: basePricesUSD.packaging, 
        note: null, 
        features: [
            { feature: "Bozor tahlili va konsepsiya", benefit: "Qadog'ingiz shunchaki chiroyli emas, balki bozor talablariga javob beradigan va sotadigan bo'ladi." },
            { feature: "3 SKU uchun dizayn", benefit: "Bir nechta mahsulotingiz uchun yagona, tizimli dizayn liniyasiga ega bo'lasiz." },
            { feature: "Chop etishga tayyorlash (pre-press)", benefit: "Dizaynni bosmaxonaga topshirishda texnik muammolar va ortiqcha xarajatlardan qutulasiz." },
            { feature: "3D vizualizatsiya", benefit: "Qadoqni ishlab chiqarishdan oldin uning real hayotda qanday ko'rinishini bilib olasiz." }
        ], 
        benefits: ["Mahsulotingizni javonda ajralib turadigan qiling", "Xaridorlarda birinchi qarashdayoq ishonch uyg'oting"] 
    },
    smm: { 
        label: "Ijtimoiy tarmoqlar uchun stil", 
        description: "Postlar va storislarni firma uslubida bezash.", 
        price: basePricesUSD.smm, 
        note: null, 
        features: [
            { feature: "6 ta post va 6 ta storis uchun shablon", benefit: "Har kuni noldan dizayn yaratishga vaqt sarflamasdan, professional ko'rinishdagi kontent yarata olasiz." },
            { feature: "Profil avatar va cover rasmi", benefit: "Profilingizga kirgan har bir kishida birinchi soniyadanoq ijobiy va professional taassurot qoldirasiz." },
            { feature: "Aktual storislar uchun ikonikalar", benefit: "Profilingiz tartibli va estetik ko'rinadi, bu esa foydalanuvchilar uchun qulaylik yaratadi." }
        ], 
        benefits: ["Ijtimoiy tarmoqlarda professional va yagona obraz yarating", "Obunachilarning e'tiborini torting va saqlab qoling"] 
    },
    merch: { 
        label: "Brendli merch va nositellar", 
        description: "Kiyim, aksessuarlar, POSM materiallari dizayni.", 
        price: 0, 
        note: "Individual", 
        features: [
            { feature: "Futbolka, kepka dizayni", benefit: "Xodimlaringiz va mijozlaringiz brendingizning 'yuruvchi reklamasi'ga aylanadi." },
            { feature: "Bloknot, ruchka, sumka dizayni", benefit: "Brendingiz kundalik hayotning bir qismiga aylanib, doimiy eslatma bo'lib turadi." },
            { feature: "Mijoz talabiga ko'ra boshqalar", benefit: "Har qanday nostandart g'oyalaringizni professional dizayn bilan hayotga tatbiq etasiz." }
        ], 
        benefits: ["Brendingizni oflayn hayotga olib chiqing", "Mijozlar va xodimlar uchun esda qolarli sovg'alar yarating"] 
    },
    illustrations: { 
        label: "Illustratsiyalar va animatsiya", 
        description: "Firma grafikasi, infografika va animatsiyalar yaratish.", 
        price: 0, 
        note: "Individual", 
        features: [
            { feature: "Brend personajini yaratish", benefit: "Brendingiz yanada jonli va hissiy bo'ladi, bu esa auditoriya bilan aloqani kuchaytiradi." },
            { feature: "Sayt yoki reklama uchun illustratsiyalar", benefit: "Zerikarli matnlar o'rniga, murakkab ma'lumotlarni qiziqarli va tushunarli tarzda yetkaza olasiz." },
            { feature: "Logo animatsiyasi", benefit: "Raqamli platformalarda brendingiz raqobatchilardan keskin ajralib turadi." }
        ], 
        benefits: ["Brendingizga o'ziga xos va jonli ko'rinish bering", "Murakkab ma'lumotlarni oson va qiziqarli tarzda yetkazing"] 
    },
    urgency: { 
        label: "Shoshilinch loyiha (+50%)", 
        description: "Loyiha navbatsiz, qisqa muddatda (2-3 kun) tayyorlanadi.", 
        price: 0, 
        note: "+50%", 
        features: [
            { feature: "Navbatdan tashqari ishlash", benefit: "Loyiha natijalarini bir necha hafta emas, bir necha kun ichida olasiz." },
            { feature: "Tezlashtirilgan tahlil va dizayn", benefit: "Bozorga tezda kirib borish va raqobatchilardan oldin harakat qilish imkoniyatiga ega bo'lasiz." },
            { feature: "Birinchi natija 48 soatda", benefit: "G'oyalaringizni tezda vizual ko'rinishda ko'rib, qaror qabul qilishingiz osonlashadi." }
        ], 
        benefits: ["Loyiha natijalarini tezroq oling", "Bozorga tezda kirib borish imkoniyati"] 
    },
    nda: { 
        label: "Maxfiylik shartnomasi (NDA) (+50%)", 
        description: "Loyiha ma'lumotlarini oshkor etmaslik shartnomasi.", 
        price: 0, 
        note: "+50%", 
        features: [
            { feature: "Yuridik hujjat tayyorlash", benefit: "G'oyalaringiz va biznes sirlaringiz qonuniy himoya ostida bo'ladi." },
            { feature: "To'liq maxfiylik kafolati", benefit: "Loyiha ma'lumotlari uchinchi shaxslarga oshkor etilmasligiga to'liq ishonch hosil qilasiz." },
            { feature: "Loyiha ma'lumotlarini himoya qilish", benefit: "Raqobatchilar sizning rejalaringizdan bexabar qoladi, bu esa sizga bozor ustunligini beradi." }
        ], 
        benefits: ["Loyiha g'oyalaringiz va ma'lumotlaringiz xavfsizligini ta'minlang", "Tijoriy sirlaringizni himoya qiling"] 
    }
};

const ruServiceDetails = {
    audit: { ...uzServiceDetails.audit, label: "Аудит логотипа", description: "Анализ существующего логотипа и рекомендации по улучшению.", features: uzServiceDetails.audit.features.map(f => ({...f})), benefits: uzServiceDetails.audit.benefits.map(b => b), oldPrice: 118, discount: 0.5 },
    namingCheck: { ...uzServiceDetails.namingCheck, label: "Проверка нейминга", description: "Проверка доступности имени бренда в базах данных Узбекистана и международных базах.", features: uzServiceDetails.namingCheck.features.map(f => ({...f})), benefits: uzServiceDetails.namingCheck.benefits.map(b => b), oldPrice: 158, discount: 0.5 },
    consultation: { ...uzServiceDetails.consultation, label: "30-минутная консультация", description: "Быстрые рекомендации и профессиональные советы по любому вопросу брендинга.", features: uzServiceDetails.consultation.features.map(f => ({...f})), benefits: uzServiceDetails.consultation.benefits.map(b => b) },
    strategy: { ...uzServiceDetails.strategy, label: "Бренд-стратегия и платформа", description: "Анализ рынка, аудит бренда, разработка позиционирования и ценностного предложения.", features: uzServiceDetails.strategy.features.map(f => ({...f})), benefits: uzServiceDetails.strategy.benefits.map(b => b) },
    commStrategy: { ...uzServiceDetails.commStrategy, label: "Коммуникационная стратегия", description: "Стратегия общения с клиентами: тон, ключевые сообщения, каналы.", features: uzServiceDetails.commStrategy.features.map(f => ({...f})), benefits: uzServiceDetails.commStrategy.benefits.map(b => b) },
    namingStandard: { ...uzServiceDetails.namingStandard, label: "Нейминг Standard", description: "Идеально для малого бизнеса.", features: uzServiceDetails.namingStandard.features.map(f => ({...f})), benefits: uzServiceDetails.namingStandard.benefits.map(b => b), timeline: "Первые концепции предоставляются в течение 7–10 рабочих дней" },
    namingPremium: { ...uzServiceDetails.namingPremium, label: "Нейминг Premium", description: "Для среднего и развивающегося бизнеса.", features: uzServiceDetails.namingPremium.features.map(f => ({...f})), benefits: uzServiceDetails.namingPremium.benefits.map(b => b), timeline: "Первые концепции предоставляются в течение 14–20 рабочих дней" },
    namingVIP: { ...uzServiceDetails.namingVIP, label: "Нейминг VIP", description: "Для крупных и международных проектов.", features: uzServiceDetails.namingVIP.features.map(f => ({...f})), benefits: uzServiceDetails.namingVIP.benefits.map(b => b), timeline: "Первые концепции предоставляются в течение 20–25 рабочих дней" },
    logoStandard: { ...uzServiceDetails.logoStandard, label: "Логотип Standard", description: "Быстрое решение для стартапов.", features: uzServiceDetails.logoStandard.features.map(f => ({...f})), benefits: uzServiceDetails.logoStandard.benefits.map(b => b), timeline: "Первые концепции предоставляются в течение 7–10 рабочих дней" },
    logoPremium: { ...uzServiceDetails.logoPremium, label: "Логотип и фирменный стиль", description: "Для тех, кто серьезно настроен развивать свой бренд.", features: uzServiceDetails.logoPremium.features.map(f => ({...f})), benefits: uzServiceDetails.logoPremium.benefits.map(b => b), timeline: "Первые концепции предоставляются в течение 14–20 рабочих дней" },
    logoVIP: { ...uzServiceDetails.logoVIP, label: "Логотип + Фирменный стиль + Брендбук", description: "Расширенная айдентика и полная поддержка.", features: uzServiceDetails.logoVIP.features.map(f => ({...f})), benefits: uzServiceDetails.logoVIP.benefits.map(b => b), timeline: "Первые концепции предоставляются в течение 20–30 рабочих дней" },
    packaging: { ...uzServiceDetails.packaging, label: "Дизайн упаковки", description: "Разработка упаковки для 3 SKU, подготовка к печати.", features: uzServiceDetails.packaging.features.map(f => ({...f})), benefits: uzServiceDetails.packaging.benefits.map(b => b) },
    smm: { ...uzServiceDetails.smm, label: "Стиль для социальных сетей", description: "Оформление постов и сторис в фирменном стиле.", features: uzServiceDetails.smm.features.map(f => ({...f})), benefits: uzServiceDetails.smm.benefits.map(b => b) },
    merch: { ...uzServiceDetails.merch, label: "Брендированный мерч и носители", description: "Дизайн одежды, аксессуаров, POSM-материалов.", features: uzServiceDetails.merch.features.map(f => ({...f})), benefits: uzServiceDetails.merch.benefits.map(b => b) },
    illustrations: { ...uzServiceDetails.illustrations, label: "Иллюстрации и анимация", description: "Создание фирменной графики, инфографики и анимаций.", features: uzServiceDetails.illustrations.features.map(f => ({...f})), benefits: uzServiceDetails.illustrations.benefits.map(b => b) },
    urgency: { ...uzServiceDetails.urgency, label: "Срочный проект (+50%)", description: "Проект выполняется вне очереди, в короткие сроки (2-3 дня).", features: uzServiceDetails.urgency.features.map(f => ({...f})), benefits: uzServiceDetails.urgency.benefits.map(b => b) },
    nda: { ...uzServiceDetails.nda, label: "Договор о неразглашении (NDA) (+50%)", description: "Договор о неразглашении информации о проекте.", features: uzServiceDetails.nda.features.map(f => ({...f})), benefits: uzServiceDetails.nda.benefits.map(b => b) }
};

const enServiceDetails = {
    audit: { ...uzServiceDetails.audit, label: "Logo Audit", description: "Analysis of the existing logo and recommendations for improvement.", features: uzServiceDetails.audit.features.map(f => ({...f})), benefits: uzServiceDetails.audit.benefits.map(b => b), oldPrice: 118, discount: 0.5 },
    namingCheck: { ...uzServiceDetails.namingCheck, label: "Naming Check", description: "Checking the availability of the brand name in Uzbekistan and international databases.", features: uzServiceDetails.namingCheck.features.map(f => ({...f})), benefits: uzServiceDetails.namingCheck.benefits.map(b => b), oldPrice: 158, discount: 0.5 },
    consultation: { ...uzServiceDetails.consultation, label: "30-minute consultation", description: "Quick guidance and professional advice on any branding question.", features: uzServiceDetails.consultation.features.map(f => ({...f})), benefits: uzServiceDetails.consultation.benefits.map(b => b) },
    strategy: { ...uzServiceDetails.strategy, label: "Brand Strategy and Platform", description: "Market analysis, brand audit, positioning and value proposition development.", features: uzServiceDetails.strategy.features.map(f => ({...f})), benefits: uzServiceDetails.strategy.benefits.map(b => b) },
    commStrategy: { ...uzServiceDetails.commStrategy, label: "Communication Strategy", description: "Customer communication strategy: tone, key messages, channels.", features: uzServiceDetails.commStrategy.features.map(f => ({...f})), benefits: uzServiceDetails.commStrategy.benefits.map(b => b) },
    namingStandard: { ...uzServiceDetails.namingStandard, label: "Naming Standard", description: "Ideal for small businesses.", features: uzServiceDetails.namingStandard.features.map(f => ({...f})), benefits: uzServiceDetails.namingStandard.benefits.map(b => b), timeline: "First concepts are presented within 7–10 working days" },
    namingPremium: { ...uzServiceDetails.namingPremium, label: "Naming Premium", description: "For medium and growing businesses.", features: uzServiceDetails.namingPremium.features.map(f => ({...f})), benefits: uzServiceDetails.namingPremium.benefits.map(b => b), timeline: "First concepts are presented within 14–20 working days" },
    namingVIP: { ...uzServiceDetails.namingVIP, label: "Naming VIP", description: "For large and international projects.", features: uzServiceDetails.namingVIP.features.map(f => ({...f})), benefits: uzServiceDetails.namingVIP.benefits.map(b => b), timeline: "First concepts are presented within 20–25 working days" },
    logoStandard: { ...uzServiceDetails.logoStandard, label: "Logo Standard", description: "A quick solution for startups.", features: uzServiceDetails.logoStandard.features.map(f => ({...f})), benefits: uzServiceDetails.logoStandard.benefits.map(b => b), timeline: "First concepts are presented within 7–10 working days" },
    logoPremium: { ...uzServiceDetails.logoPremium, label: "Logo & Corporate Identity", description: "For those serious about developing their brand.", features: uzServiceDetails.logoPremium.features.map(f => ({...f})), benefits: uzServiceDetails.logoPremium.benefits.map(b => b), timeline: "First concepts are presented within 14–20 working days" },
    logoVIP: { ...uzServiceDetails.logoVIP, label: "Logo + Corporate Identity + Brandbook", description: "Expanded identity and full support.", features: uzServiceDetails.logoVIP.features.map(f => ({...f})), benefits: uzServiceDetails.logoVIP.benefits.map(b => b), timeline: "First concepts are presented within 20–30 working days" },
    packaging: { ...uzServiceDetails.packaging, label: "Packaging Design", description: "Packaging development for 3 SKUs, preparation for printing.", features: uzServiceDetails.packaging.features.map(f => ({...f})), benefits: uzServiceDetails.packaging.benefits.map(b => b) },
    smm: { ...uzServiceDetails.smm, label: "Style for Social Networks", description: "Design of posts and stories in corporate style.", features: uzServiceDetails.smm.features.map(f => ({...f})), benefits: uzServiceDetails.smm.benefits.map(b => b) },
    merch: { ...uzServiceDetails.merch, label: "Branded Merch and Carriers", description: "Design of clothing, accessories, POSM materials.", features: uzServiceDetails.merch.features.map(f => ({...f})), benefits: uzServiceDetails.merch.benefits.map(b => b) },
    illustrations: { ...uzServiceDetails.illustrations, label: "Illustrations and Animation", description: "Creation of corporate graphics, infographics and animations.", features: uzServiceDetails.illustrations.features.map(f => ({...f})), benefits: uzServiceDetails.illustrations.benefits.map(b => b) },
    urgency: { ...uzServiceDetails.urgency, label: "Urgent Project (+50%)", description: "The project is carried out out of turn, in a short time (2-3 days).", features: uzServiceDetails.urgency.features.map(f => ({...f})), benefits: uzServiceDetails.urgency.benefits.map(b => b) },
    nda: { ...uzServiceDetails.nda, label: "Non-Disclosure Agreement (NDA) (+50%)", description: "Agreement on non-disclosure of project information.", features: uzServiceDetails.nda.features.map(f => ({...f})), benefits: uzServiceDetails.nda.benefits.map(b => b) }
};

const zhServiceDetails = {
    audit: { ...uzServiceDetails.audit, label: "标志审核", description: "对现有标志进行分析并提供改进建议。", features: uzServiceDetails.audit.features.map(f => ({...f})), benefits: uzServiceDetails.audit.benefits.map(b => b), oldPrice: 118, discount: 0.5 },
    namingCheck: { ...uzServiceDetails.namingCheck, label: "名称检查", description: "检查品牌名称在乌兹别克斯坦和国际数据库中的可用性。", features: uzServiceDetails.namingCheck.features.map(f => ({...f})), benefits: uzServiceDetails.namingCheck.benefits.map(b => b), oldPrice: 158, discount: 0.5 },
    consultation: { ...uzServiceDetails.consultation, label: "30分钟咨询", description: "为任何品牌问题提供快速指导和专业建议。", features: uzServiceDetails.consultation.features.map(f => ({...f})), benefits: uzServiceDetails.consultation.benefits.map(b => b) },
    strategy: { ...uzServiceDetails.strategy, label: "品牌策略与平台", description: "市场分析、品牌审核、定位和价值主张开发。", features: uzServiceDetails.strategy.features.map(f => ({...f})), benefits: uzServiceDetails.strategy.benefits.map(b => b) },
    commStrategy: { ...uzServiceDetails.commStrategy, label: "传播策略", description: "客户传播策略：语调、关键信息、渠道。", features: uzServiceDetails.commStrategy.features.map(f => ({...f})), benefits: uzServiceDetails.commStrategy.benefits.map(b => b) },
    namingStandard: { ...uzServiceDetails.namingStandard, label: "标准命名", description: "适合小型企业。", features: uzServiceDetails.namingStandard.features.map(f => ({...f})), benefits: uzServiceDetails.namingStandard.benefits.map(b => b), timeline: "初步概念在7-10个工作日内提交" },
    namingPremium: { ...uzServiceDetails.namingPremium, label: "高级命名", description: "适合中型和成长型企业。", features: uzServiceDetails.namingPremium.features.map(f => ({...f})), benefits: uzServiceDetails.namingPremium.benefits.map(b => b), timeline: "初步概念在14-20个工作日内提交" },
    namingVIP: { ...uzServiceDetails.namingVIP, label: "VIP命名", description: "适合大型和国际项目。", features: uzServiceDetails.namingVIP.features.map(f => ({...f})), benefits: uzServiceDetails.namingVIP.benefits.map(b => b), timeline: "初步概念在20-25个工作日内提交" },
    logoStandard: { ...uzServiceDetails.logoStandard, label: "标准标志", description: "为初创公司提供的快速解决方案。", features: uzServiceDetails.logoStandard.features.map(f => ({...f})), benefits: uzServiceDetails.logoStandard.benefits.map(b => b), timeline: "初步概念在7-10个工作日内提交" },
    logoPremium: { ...uzServiceDetails.logoPremium, label: "标志与企业形象", description: "为那些认真发展品牌的企业。", features: uzServiceDetails.logoPremium.features.map(f => ({...f})), benefits: uzServiceDetails.logoPremium.benefits.map(b => b), timeline: "初步概念在14-20个工作日内提交" },
    logoVIP: { ...uzServiceDetails.logoVIP, label: "标志 + 企业形象 + 品牌手册", description: "扩展的形象和全面支持。", features: uzServiceDetails.logoVIP.features.map(f => ({...f})), benefits: uzServiceDetails.logoVIP.benefits.map(b => b), timeline: "初步概念在20-30个工作日内提交" },
    packaging: { ...uzServiceDetails.packaging, label: "包装设计", description: "为3个SKU开发包装，为印刷做准备。", features: uzServiceDetails.packaging.features.map(f => ({...f})), benefits: uzServiceDetails.packaging.benefits.map(b => b) },
    smm: { ...uzServiceDetails.smm, label: "社交网络风格", description: "以企业风格设计帖子和故事。", features: uzServiceDetails.smm.features.map(f => ({...f})), benefits: uzServiceDetails.smm.benefits.map(b => b) },
    merch: { ...uzServiceDetails.merch, label: "品牌商品和载体", description: "服装、配饰、POSM材料的设计。", features: uzServiceDetails.merch.features.map(f => ({...f})), benefits: uzServiceDetails.merch.benefits.map(b => b) },
    illustrations: { ...uzServiceDetails.illustrations, label: "插图与动画", description: "创建企业图形、信息图和动画。", features: uzServiceDetails.illustrations.features.map(f => ({...f})), benefits: uzServiceDetails.illustrations.benefits.map(b => b) },
    urgency: { ...uzServiceDetails.urgency, label: "紧急项目（+50%）", description: "该项目将不按顺序在短时间内（2-3天）执行。", features: uzServiceDetails.urgency.features.map(f => ({...f})), benefits: uzServiceDetails.urgency.benefits.map(b => b) },
    nda: { ...uzServiceDetails.nda, label: "保密协议（NDA）（+50%）", description: "关于不披露项目信息的协议。", features: uzServiceDetails.nda.features.map(f => ({...f})), benefits: uzServiceDetails.nda.benefits.map(b => b) }
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
