

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
        description: "Biznesingiz uchun natija keltiradigan poydevor — bozor tahlili, pozitsiyalash va kommunikatsiya.",
        price: basePricesUSD.strategy,
        note: null,
        features: [
            { feature: "Chuqurlashtirilgan bozor tahlili", benefit: "Siz shunchaki raqobatchilarni o'rganmaysiz, balki bozorning 'yashirin' imkoniyatlarini va xavflarini aniqlaysiz. Bu kelajakdagi qarorlaringiz uchun mustahkam poydevor bo'ladi." },
            { feature: "Maqsadli auditoriyani segmentlash", benefit: "“Hamma uchun” degan yondashuvdan voz kechib, sizning mahsulotingizni chin dildan sevib xarid qiladigan aniq mijozlar guruhini aniqlaysiz va ularning tilida gapirishni o'rganasiz." },
            { feature: "Brend platformasini ishlab chiqish (Missiya, Qadriyatlar, Brend ovozi)", benefit: "Brendingiz shunchaki pul ishlash vositasi emas, balki o'z missiyasiga ega bo'lgan 'jonli' organizmga aylanadi. Bu jamoangizni ilhomlantiradi va mijozlarda hissiy bog'liqlikni kuchaytiradi." },
            { feature: "Unikal savdo taklifi (UST) va pozitsiyalash", benefit: "Mijozlar ongida aniq bir o'rin egallaysiz. 'Nega aynan siz?' degan savolga ular hech ikkilanmay javob bera oladigan bo'lishadi." },
            { feature: "Brend arxitekturasi", benefit: "Agar bir nechta mahsulotingiz yoki sub-brendingiz bo'lsa, ularning o'zaro munosabatini tartibga solasiz. Bu kelajakdagi chalkashliklarning oldini oladi." },
            { feature: "Brend hikoyasi (Storytelling)", benefit: "Mijozlar faqat mahsulotni emas, balki uning ortidagi hikoyani sotib olishadi. Biz sizning brendingizga odamlarni o'ziga tortadigan jozibali hikoya yaratamiz." }
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
        description: "Kichik biznes va startaplar uchun ideal.", 
        price: basePricesUSD.namingStandard, 
        note: null, 
        features: [
            { feature: "Qisqa, jarangli va esda qolarli 3 ta nom", benefit: "Biznesingizga professional start beradigan bir nechta kuchli variantdan tanlaysiz. Eshitgan odam oson topa oladi." },
            { feature: "Domen va ijtimoiy tarmoqlarda bo'shlik tekshiruvi", benefit: "Tanlagan nomingiz internetda band bo'lmaydi, marketingda to'siqsiz ishlaysiz." },
            { feature: "Patentga yaroqlilik bo'yicha dastlabki tekshiruv (1 klass)", benefit: "Kelajakdagi katta huquqiy muammolarning oldini olasiz." },
            { feature: "100% Mamnuniyat Kafolati", benefit: "Agar taklif qilingan nom variantlaridan birortasi sizga ma'qul kelmasa, to'lovingizni to'liq qaytarib beramiz." }
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
            { feature: "5+ strategiyaga mos, puxta o'ylangan nom variantlari", benefit: "Strategiyangizga mos bir nechta kuchli yo'nalishdan eng yaxshisini tanlab olasiz. Eshitgan odam oson topa oladi." },
            { feature: "6 tilda semantik va fonetik tekshiruv", benefit: "Xalqaro bozorga chiqqanda nomingiz salbiy ma'no bermaydi va oson talaffuz qilinadi." },
            { feature: "Domen va ijtimoiy tarmoqlarda bo'shlik tekshiruvi", benefit: "Tanlagan nomingiz internetda band bo'lmaydi, marketingda to'siqsiz ishlaysiz." },
            { feature: "Patentga yaroqlilik bo'yicha chuqur tekshiruv (2 klassgacha) va huquqiy xulosa", benefit: "Brend nomingizni huquqiy jihatdan himoya qilish uchun to'liq asosga ega bo'lasiz." },
            { feature: "5 yilga bepul domen band qilib beriladi", benefit: "Eng muhim onlayn aktivingiz 5 yil davomida himoyada bo'ladi." },
            { feature: "100% Mamnuniyat Kafolati", benefit: "Agar taklif qilingan nom variantlaridan birortasi sizga ma'qul kelmasa, to'lovingizni to'liq qaytarib beramiz." }
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
            { feature: "10+ keng konsepsiyali, hikoyaga ega nom variantlari", benefit: "Sizda tanlov keng bo‘ladi — bir nechta kuchli yo‘nalishdan sizga eng ko‘p foyda keltiradiganini tanlaysiz. Eshitgan odam oson topa oladi." },
            { feature: "Domen va ijtimoiy tarmoqlarda bo'shlik tekshiruvi", benefit: "Tanlagan nomingiz internetda band bo'lmaydi, marketingda to'siqsiz ishlaysiz." },
            { feature: "10 yilga bepul domen band qilib beriladi", benefit: "Onlayn makoningiz 10 yil davomida xavfsiz. Raqobatchilar domeningizni olib qo‘yolmaydi." },
            { feature: "Har bir nom uchun storytelling asosida professional taqdimot", benefit: "Siz brend nomini chiroyli va ishonchli tarzda asoslay olasiz. Investor, hamkor yoki mijoz eshitishi bilanoq nimaga bu nom tanlanganini tushunadi." },
            { feature: "Patentga topshirishda yordam xizmati (bojlar alohida)", benefit: "Brend nomingizni darhol qonuniy himoyaga olish jarayonini boshlaymiz, vaqt yo'qotmaysiz." },
            { feature: "100% Mamnuniyat Kafolati", benefit: "Agar taklif qilingan nom variantlaridan birortasi sizga ma'qul kelmasa, to'lovingizni to'liq qaytarib beramiz." }
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
            { feature: "5 ta aloqa nuqtalarida vizualizatsiya", benefit: "Logotipingiz real hayotda (vizitka, post, web) qanday ko'rinishini oldindan ko'rasiz." },
            { feature: "Logotip vektor fayllari (AI, EPS, PNG, JPG, PDF)", benefit: "Logotipni istalgan o'lchamda, istalgan joyda sifatini yo'qotmasdan ishlata olasiz." },
            { feature: "100% Mamnuniyat Kafolati", benefit: "Agar dastlabki konsepsiyalar sizga ma'qul kelmasa, to'lovingizni to'liq qaytarib beramiz." }
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
            { feature: "15+ aloqa nuqtalarida vizualizatsiya", benefit: "Brendingiz turli vaziyatlarda (reklama, qadoq, ijtimoiy tarmoq) qanday ishlashini aniq ko'rasiz." },
            { feature: "Logotip vektor fayllari (AI, EPS, PNG, JPG, PDF)", benefit: "Logotipni istalgan o'lchamda, istalgan joyda sifatini yo'qotmasdan ishlata olasiz." },
            { feature: "10 ta Telegram stiker", benefit: "Mijozlar bilan muloqotda brendingizni norasmiy va qiziqarli tarzda namoyon qilasiz." },
            { feature: "100% Mamnuniyat Kafolati", benefit: "Agar dastlabki konsepsiyalar sizga ma'qul kelmasa, to'lovingizni to'liq qaytarib beramiz." }
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
            { feature: "Logotip vektor fayllari (AI, EPS, PNG, JPG, PDF)", benefit: "Logotipni istalgan o'lchamda, istalgan joyda sifatini yo'qotmasdan ishlata olasiz." },
            { feature: "Logotip animatsiyasi (premium sifatli)", benefit: "Raqamli platformalarda brendingiz jonlanadi va raqobatchilardan keskin ajralib turadi." },
            { feature: "3 oygacha post-delivery qo‘llab-quvvatlash", benefit: "Loyiha tugaganidan keyin ham dizaynni amaliyotga tatbiq etishda yolg'iz qolmaysiz." },
            { feature: "100% Mamnuniyat Kafolati", benefit: "Agar dastlabki konsepsiyalar sizga ma'qul kelmasa, to'lovingizni to'liq qaytarib beramiz." }
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
    ...uzServiceDetails,
    audit: { ...uzServiceDetails.audit, label: "Аудит логотипа", description: "Анализ существующего логотипа и рекомендации по улучшению.", features: uzServiceDetails.audit.features.map(f => ({...f})), benefits: uzServiceDetails.audit.benefits.map(b => b), oldPrice: 118, discount: 0.5 },
    namingCheck: { ...uzServiceDetails.namingCheck, label: "Проверка нейминга", description: "Проверка доступности имени бренда в базах данных Узбекистана и международных базах.", features: uzServiceDetails.namingCheck.features.map(f => ({...f})), benefits: uzServiceDetails.namingCheck.benefits.map(b => b), oldPrice: 158, discount: 0.5 },
    consultation: { ...uzServiceDetails.consultation, label: "30-минутная консультация", description: "Быстрые рекомендации и профессиональные советы по любому вопросу брендинга.", features: uzServiceDetails.consultation.features.map(f => ({...f})), benefits: uzServiceDetails.consultation.benefits.map(b => b) },
    strategy: { ...uzServiceDetails.strategy, label: "Бренд-стратегия и платформа", description: "Анализ рынка, аудит бренда, разработка позиционирования и ценностного предложения.", 
        features: uzServiceDetails.strategy.features.map(f => ({...f})),
        benefits: uzServiceDetails.strategy.benefits.map(b => b)
    },
    commStrategy: { ...uzServiceDetails.commStrategy, label: "Коммуникационная стратегия", description: "Стратегия общения с клиентами: тон, ключевые сообщения, каналы.", features: uzServiceDetails.commStrategy.features.map(f => ({...f})), benefits: uzServiceDetails.commStrategy.benefits.map(b => b) },
    namingStandard: { ...uzServiceDetails.namingStandard, label: "Нейминг Standard", description: "Идеально для малого бизнеса и стартапов.", 
        features: [
            { feature: "3 варианта короткого, звучного и запоминающегося названия", benefit: "У вас будет возможность выбрать из нескольких сильных вариантов, дающих профессиональный старт вашему бизнесу. Услышав его, человек сможет легко его найти." },
            { feature: "Проверка доступности домена и в социальных сетях", benefit: "Выбранное вами имя не будет занято в интернете, вы сможете без препятствий работать в маркетинге." },
            { feature: "Первичная проверка на патентоспособность (1 класс)", benefit: "Вы предотвратите крупные юридические проблемы в будущем." },
            { feature: "100% Гарантия Удовлетворенности", benefit: "Если вам не понравится ни один из предложенных вариантов названия, мы полностью вернем вам деньги." }
        ], 
        benefits: ["Получите быстрое и доступное имя", "Дайте профессиональный старт вашему бизнесу"], 
    },
    namingPremium: { ...uzServiceDetails.namingPremium, label: "Нейминг Premium", description: "Для среднего и развивающегося бизнеса.", 
        features: [
            { feature: "5+ продуманных вариантов названия, соответствующих стратегии", benefit: "Вы сможете выбрать лучшее из нескольких сильных направлений, соответствующих вашей стратегии. Услышав его, человек сможет легко его найти." },
            { feature: "Семантическая и фонетическая проверка на 6 языках", benefit: "При выходе на международный рынок ваше имя не будет иметь негативного значения и будет легко произноситься." },
            { feature: "Проверка доступности домена и в социальных сетях", benefit: "Выбранное вами имя не будет занято в интернете, вы сможете без препятствий работать в маркетинге." },
            { feature: "Глубокая проверка на патентоспособность (до 2 классов) и юридическое заключение", benefit: "Вы получите полное основание для юридической защиты вашего бренда." },
            { feature: "Бесплатная регистрация домена на 5 лет", benefit: "Ваш самый важный онлайн-актив будет защищен на 5 лет." },
            { feature: "100% Гарантия Удовлетворенности", benefit: "Если вам не понравится ни один из предложенных вариантов названия, мы полностью вернем вам деньги." }
        ], 
        benefits: ["Получите стратегически сильное имя для вашего бренда", "Создайте возможность выхода на международный рынок", "Получите юридически защищенное имя"], 
    },
    namingVIP: { ...uzServiceDetails.namingVIP, label: "Нейминг VIP", description: "Для крупных и международных проектов.", 
        features: [
            { feature: "Личное участие и контроль Бахтиёржона Газиева", benefit: "Вам будет уделено непосредственное внимание специалиста высшего уровня — ваше имя будет основано на опыте, а не на случайности." },
            { feature: "10+ вариантов названия с широкой концепцией и историей", benefit: "У вас будет широкий выбор — из нескольких сильных направлений вы выберете то, которое принесет вам наибольшую пользу. Услышав его, человек сможет легко его найти." },
            { feature: "Проверка доступности домена и в социальных сетях", benefit: "Выбранное вами имя не будет занято в интернете, вы сможете без препятствий работать в маркетинге." },
            { feature: "Бесплатная регистрация домена на 10 лет", benefit: "Ваше онлайн-пространство будет в безопасности на 10 лет. Конкуренты не смогут забрать ваш домен." },
            { feature: "Профессиональная презентация для каждого названия на основе сторителлинга", benefit: "Вы сможете красиво и убедительно обосновать название бренда. Инвестор, партнер или клиент с первого раза поймет, почему было выбрано именно это имя." },
            { feature: "Помощь в подаче на патент (госпошлины отдельно)", benefit: "Мы немедленно начинаем процесс юридической защиты вашего бренда, вы не теряете времени." },
            { feature: "100% Гарантия Удовлетворенности", benefit: "Если вам не понравится ни один из предложенных вариантов названия, мы полностью вернем вам деньги." }
        ], 
        benefits: ["Получите имя, претендующее на абсолютное лидерство на рынке", "Максимально защищенное и продуманное имя бренда", "Личный контроль и поддержка эксперта"], 
    },
    logoStandard: { ...uzServiceDetails.logoStandard, label: "Логотип Standard", description: "Быстрое решение для стартапов.", features: [
            { feature: "3 концепции логотипа на основе брифа компании", benefit: "Вы сможете выбрать один из нескольких вариантов, подходящих вашему бизнесу." },
            { feature: "Визуализация на 5 точках контакта", benefit: "Вы заранее увидите, как ваш логотип будет выглядеть в реальной жизни (на визитке, в посте, на сайте)." },
            { feature: "Векторные файлы логотипа (AI, EPS, PNG, JPG, PDF)", benefit: "Вы сможете использовать логотип в любом размере и в любом месте без потери качества." },
            { feature: "100% Гарантия Удовлетворенности", benefit: "Если вам не понравятся первоначальные концепции, мы полностью вернем вам деньги." }
        ], benefits: ["Создайте профессиональную визуальную основу для вашего бизнеса", "Получите быстрый и качественный логотип"] },
    logoPremium: { ...uzServiceDetails.logoPremium, label: "Логотип и фирменный стиль", description: "Для тех, кто серьезно настроен развивать свой бренд.", features: [
            { feature: "5 концепций логотипа, соответствующих стратегии", benefit: "Ваш логотип будет не просто красивым, а служить бизнес-целям." },
            { feature: "Фирменный стиль (основные цвета, шрифты, правила)", benefit: "Все ваши маркетинговые материалы будут выглядеть единообразно и профессионально, что укрепит ваш бренд." },
            { feature: "Визуализация на 15+ точках контакта", benefit: "Вы точно увидите, как ваш бренд будет работать в различных ситуациях (реклама, упаковка, соцсети)." },
            { feature: "Векторные файлы логотипа (AI, EPS, PNG, JPG, PDF)", benefit: "Вы сможете использовать логотип в любом размере и в любом месте без потери качества." },
            { feature: "10 стикеров для Telegram", benefit: "Вы сможете неформально и интересно представлять ваш бренд в общении с клиентами." },
            { feature: "100% Гарантия Удовлетворенности", benefit: "Если вам не понравятся первоначальные концепции, мы полностью вернем вам деньги." }
        ], benefits: ["Получите полное и системное визуальное решение для вашего бренда", "Создайте прочный и единый образ в сознании клиентов", "Достигните профессионального вида в ваших маркетинговых материалах"] },
    logoVIP: { ...uzServiceDetails.logoVIP, label: "Логотип + Фирменный стиль + Брендбук", description: "Расширенная айдентика и полная поддержка.", features: [
            { feature: "Личное участие Бахтиёржона Газиева", benefit: "Ваш проект будет лично контролироваться одним из самых опытных специалистов в отрасли." },
            { feature: "8+ концепций логотипа на основе стратегии", benefit: "Вы получите максимальный выбор для поиска идеального решения для вашего бренда." },
            { feature: "Визуальный брендбук и логобук", benefit: "Вы получите 'конституцию' для управления вашим брендом, что сэкономит ваши будущие расходы на дизайн." },
            { feature: "Векторные файлы логотипа (AI, EPS, PNG, JPG, PDF)", benefit: "Вы сможете использовать логотип в любом размере и в любом месте без потери качества." },
            { feature: "Анимация логотипа (премиум-качество)", benefit: "На цифровых платформах ваш бренд оживет и резко выделится среди конкурентов." },
            { feature: "Поддержка до 3 месяцев после сдачи", benefit: "Вы не останетесь одни при внедрении дизайна в практику после завершения проекта." },
            { feature: "100% Гарантия Удовлетворенности", benefit: "Если вам не понравятся первоначальные концепции, мы полностью вернем вам деньги." }
        ], benefits: ["Получите решение 'под ключ' для вашего бренда", "Претендуйте на премиум-сегмент на рынке", "Получите полное руководство и инструменты для управления вашим брендом"] },
    packaging: { ...uzServiceDetails.packaging, label: "Дизайн упаковки", description: "Разработка упаковки для 3 SKU, подготовка к печати.", features: uzServiceDetails.packaging.features.map(f => ({...f})), benefits: uzServiceDetails.packaging.benefits.map(b => b) },
    smm: { ...uzServiceDetails.smm, label: "Стиль для социальных сетей", description: "Оформление постов и сторис в фирменном стиле.", features: uzServiceDetails.smm.features.map(f => ({...f})), benefits: uzServiceDetails.smm.benefits.map(b => b) },
    merch: { ...uzServiceDetails.merch, label: "Брендированный мерч и носители", description: "Дизайн одежды, аксессуаров, POSM-материалов.", features: uzServiceDetails.merch.features.map(f => ({...f})), benefits: uzServiceDetails.merch.benefits.map(b => b) },
    illustrations: { ...uzServiceDetails.illustrations, label: "Иллюстрации и анимация", description: "Создание фирменной графики, инфографики и анимаций.", features: uzServiceDetails.illustrations.features.map(f => ({...f})), benefits: uzServiceDetails.illustrations.benefits.map(b => b) },
    urgency: { ...uzServiceDetails.urgency, label: "Срочный проект (+50%)", description: "Проект выполняется вне очереди, в короткие сроки (2-3 дня).", features: uzServiceDetails.urgency.features.map(f => ({...f})), benefits: uzServiceDetails.urgency.benefits.map(b => b) },
    nda: { ...uzServiceDetails.nda, label: "Договор о неразглашении (NDA) (+50%)", description: "Договор о неразглашении информации о проекте.", features: uzServiceDetails.nda.features.map(f => ({...f})), benefits: uzServiceDetails.nda.benefits.map(b => b) }
};

const enServiceDetails = {
    ...uzServiceDetails,
    audit: { ...uzServiceDetails.audit, label: "Logo Audit", description: "Analysis of the existing logo and recommendations for improvement.", features: uzServiceDetails.audit.features.map(f => ({...f})), benefits: uzServiceDetails.audit.benefits.map(b => b), oldPrice: 118, discount: 0.5 },
    namingCheck: { ...uzServiceDetails.namingCheck, label: "Naming Check", description: "Checking the availability of the brand name in Uzbekistan and international databases.", features: uzServiceDetails.namingCheck.features.map(f => ({...f})), benefits: uzServiceDetails.namingCheck.benefits.map(b => b), oldPrice: 158, discount: 0.5 },
    consultation: { ...uzServiceDetails.consultation, label: "30-minute consultation", description: "Quick guidance and professional advice on any branding question.", features: uzServiceDetails.consultation.features.map(f => ({...f})), benefits: uzServiceDetails.consultation.benefits.map(b => b) },
    strategy: { ...uzServiceDetails.strategy, label: "Brand Strategy and Platform", description: "Market analysis, brand audit, positioning and value proposition development.", 
        features: uzServiceDetails.strategy.features.map(f => ({...f})),
        benefits: uzServiceDetails.strategy.benefits.map(b => b)
    },
    commStrategy: { ...uzServiceDetails.commStrategy, label: "Communication Strategy", description: "Customer communication strategy: tone, key messages, channels.", features: uzServiceDetails.commStrategy.features.map(f => ({...f})), benefits: uzServiceDetails.commStrategy.benefits.map(b => b) },
    namingStandard: { ...uzServiceDetails.namingStandard, label: "Naming Standard", description: "Ideal for small businesses and startups.",
        features: [
            { feature: "3 short, sonorous, and memorable name options", benefit: "You'll have the opportunity to choose from several strong options that give your business a professional start. Anyone who hears it can easily find it." },
            { feature: "Domain and social media availability check", benefit: "Your chosen name won't be taken on the internet, allowing you to market without obstacles." },
            { feature: "Preliminary patentability check (1 class)", benefit: "You'll prevent major legal issues in the future." },
            { feature: "100% Satisfaction Guarantee", benefit: "If you don't like any of the proposed name options, we will give you a full refund." }
        ],
        benefits: ["Get a quick and affordable name", "Give your business a professional start"], 
    },
    namingPremium: { ...uzServiceDetails.namingPremium, label: "Naming Premium", description: "A strategic approach for medium and growing businesses.", 
        features: [
            { feature: "5+ well-thought-out name options aligned with the strategy", benefit: "You'll be able to choose the best from several strong directions that match your strategy. Anyone who hears it can easily find it." },
            { feature: "Semantic and phonetic check in 6 languages", benefit: "When entering the international market, your name will not have negative connotations and will be easy to pronounce." },
            { feature: "Domain and social media availability check", benefit: "Your chosen name won't be taken on the internet, allowing you to market without obstacles." },
            { feature: "In-depth patentability check (up to 2 classes) and legal opinion", benefit: "You'll have a full basis for legally protecting your brand name." },
            { feature: "Free domain registration for 5 years", benefit: "Your most important online asset will be protected for 5 years." },
            { feature: "100% Satisfaction Guarantee", benefit: "If you don't like any of the proposed name options, we will give you a full refund." }
        ],
        benefits: ["Get a strategically strong name for your brand", "Create an opportunity for international market entry", "Get a legally protected name"], 
    },
    namingVIP: { ...uzServiceDetails.namingVIP, label: "Naming VIP", description: "For large and international projects.", 
        features: [
            { feature: "Personal involvement and supervision by Bakhtiyorjon Gaziyev", benefit: "You'll receive direct attention from a top-level expert—your name will be based on experience, not chance." },
            { feature: "10+ name options with broad concepts and stories", benefit: "You'll have a wide choice—from several strong directions, you'll choose the one that benefits you the most. Anyone who hears it can easily find it." },
            { feature: "Domain and social media availability check", benefit: "Your chosen name won't be taken on the internet, allowing you to market without obstacles." },
            { feature: "Free domain registration for 10 years", benefit: "Your online space will be secure for 10 years. Competitors won't be able to take your domain." },
            { feature: "Professional presentation for each name based on storytelling", benefit: "You'll be able to justify the brand name beautifully and convincingly. An investor, partner, or client will understand why this name was chosen right away." },
            { feature: "Assistance with patent filing (government fees are separate)", benefit: "We immediately start the process of legally protecting your brand name, you don't lose time." },
            { feature: "100% Satisfaction Guarantee", benefit: "If you don't like any of the proposed name options, we will give you a full refund." }
        ],
        benefits: ["Get a name that contends for absolute market leadership", "A maximally protected and well-thought-out brand name", "Personal expert supervision and support"], 
    },
    logoStandard: { ...uzServiceDetails.logoStandard, label: "Logo Standard", description: "A quick solution for startups.", features: [
            { feature: "3 logo concepts based on the company brief", benefit: "You will have the opportunity to choose one of several options suitable for your business." },
            { feature: "Visualization on 5 touchpoints", benefit: "You will see in advance how your logo will look in real life (on a business card, in a post, on a website)." },
            { feature: "Vector logo files (AI, EPS, PNG, JPG, PDF)", benefit: "You can use the logo in any size and in any place without loss of quality." },
            { feature: "100% Satisfaction Guarantee", benefit: "If you don't like the initial concepts, we will give you a full refund." }
        ], benefits: ["Create a professional visual foundation for your business", "Get a quick and high-quality logo"] },
    logoPremium: { ...uzServiceDetails.logoPremium, label: "Logo & Corporate Identity", description: "For those serious about developing their brand.", features: [
            { feature: "5 logo concepts that match the strategy", benefit: "Your logo will not just be beautiful, but will serve business goals." },
            { feature: "Corporate identity (main colors, fonts, rules)", benefit: "All your marketing materials will look uniform and professional, which will strengthen your brand." },
            { feature: "Visualization on 15+ touchpoints", benefit: "You will see exactly how your brand will work in various situations (advertising, packaging, social networks)." },
            { feature: "Vector logo files (AI, EPS, PNG, JPG, PDF)", benefit: "You can use the logo in any size and in any place without loss of quality." },
            { feature: "10 Telegram stickers", benefit: "You can informally and interestingly present your brand in communication with customers." },
            { feature: "100% Satisfaction Guarantee", benefit: "If you don't like the initial concepts, we will give you a full refund." }
        ], benefits: ["Get a complete and systematic visual solution for your brand", "Create a strong and unified image in the minds of customers", "Achieve a professional look in your marketing materials"] },
    logoVIP: { ...uzServiceDetails.logoVIP, label: "Logo + Corporate Identity + Brandbook", description: "Expanded identity and full support.", features: [
            { feature: "Personal involvement of Bakhtiyorjon Gaziyev", benefit: "Your project will be personally supervised by one of the most experienced specialists in the industry." },
            { feature: "8+ logo concepts based on strategy", benefit: "You will have the maximum choice to find the perfect solution for your brand." },
            { feature: "Visual Brandbook and Logobook", benefit: "You will get a 'constitution' for managing your brand, which will save you future design costs." },
            { feature: "Vector logo files (AI, EPS, PNG, JPG, PDF)", benefit: "You can use the logo in any size and in any place without loss of quality." },
            { feature: "Logo animation (premium quality)", benefit: "On digital platforms, your brand will come to life and stand out sharply from competitors." },
            { feature: "Up to 3 months of post-delivery support", benefit: "You will not be left alone in implementing the design in practice after the project is completed." },
            { feature: "100% Satisfaction Guarantee", benefit: "If you don't like the initial concepts, we will give you a full refund." }
        ], benefits: ["Get a 'turnkey' solution for your brand", "Claim the premium segment in the market", "Get a complete guide and tools for managing your brand"] },
    packaging: { ...uzServiceDetails.packaging, label: "Packaging Design", description: "Packaging development for 3 SKUs, preparation for printing.", features: uzServiceDetails.packaging.features.map(f => ({...f})), benefits: uzServiceDetails.packaging.benefits.map(b => b) },
    smm: { ...uzServiceDetails.smm, label: "Style for Social Networks", description: "Design of posts and stories in corporate style.", features: uzServiceDetails.smm.features.map(f => ({...f})), benefits: uzServiceDetails.smm.benefits.map(b => b) },
    merch: { ...uzServiceDetails.merch, label: "Branded Merch and Carriers", description: "Design of clothing, accessories, POSM materials.", features: uzServiceDetails.merch.features.map(f => ({...f})), benefits: uzServiceDetails.merch.benefits.map(b => b) },
    illustrations: { ...uzServiceDetails.illustrations, label: "Illustrations and Animation", description: "Creation of corporate graphics, infographics and animations.", features: uzServiceDetails.illustrations.features.map(f => ({...f})), benefits: uzServiceDetails.illustrations.benefits.map(b => b) },
    urgency: { ...uzServiceDetails.urgency, label: "Urgent Project (+50%)", description: "The project is carried out out of turn, in a short time (2-3 days).", features: uzServiceDetails.urgency.features.map(f => ({...f})), benefits: uzServiceDetails.urgency.benefits.map(b => b) },
    nda: { ...uzServiceDetails.nda, label: "Non-Disclosure Agreement (NDA) (+50%)", description: "Agreement on non-disclosure of project information.", features: uzServiceDetails.nda.features.map(f => ({...f})), benefits: uzServiceDetails.nda.benefits.map(b => b) }
};

const zhServiceDetails = {
    ...uzServiceDetails,
    audit: { ...uzServiceDetails.audit, label: "标志审核", description: "对现有标志进行分析并提供改进建议。", features: uzServiceDetails.audit.features.map(f => ({...f})), benefits: uzServiceDetails.audit.benefits.map(b => b), oldPrice: 118, discount: 0.5 },
    namingCheck: { ...uzServiceDetails.namingCheck, label: "名称检查", description: "检查品牌名称在乌兹别克斯坦和国际数据库中的可用性。", features: uzServiceDetails.namingCheck.features.map(f => ({...f})), benefits: uzServiceDetails.namingCheck.benefits.map(b => b), oldPrice: 158, discount: 0.5 },
    consultation: { ...uzServiceDetails.consultation, label: "30分钟咨询", description: "为任何品牌问题提供快速指导和专业建议。", features: uzServiceDetails.consultation.features.map(f => ({...f})), benefits: uzServiceDetails.consultation.benefits.map(b => b) },
    strategy: { ...uzServiceDetails.strategy, label: "品牌策略与平台", description: "市场分析、品牌审核、定位和价值主张开发。",
        features: uzServiceDetails.strategy.features.map(f => ({...f})),
        benefits: uzServiceDetails.strategy.benefits.map(b => b)
    },
    commStrategy: { ...uzServiceDetails.commStrategy, label: "传播策略", description: "客户传播策略：语调、关键信息、渠道。", features: uzServiceDetails.commStrategy.features.map(f => ({...f})), benefits: uzServiceDetails.commStrategy.benefits.map(b => b) },
    namingStandard: { ...uzServiceDetails.namingStandard, label: "标准命名", description: "适合小型企业和初创公司。", 
        features: [
            { feature: "3个简短、响亮、易记的名称选项", benefit: "您将有机会从几个强有力的选项中进行选择，为您的业务提供专业的开端。任何听到它的人都可以轻松找到它。" },
            { feature: "域名和社交媒体可用性检查", benefit: "您选择的名称在互联网上不会被占用，您可以在营销中无障碍地工作。" },
            { feature: "初步可专利性检查（1类）", benefit: "您将避免未来重大的法律问题。" },
            { feature: "100% 满意保证", benefit: "如果您不喜欢任何一个提议的名称选项，我们将全额退款。" }
        ],
        benefits: ["获得一个快速且实惠的名称", "为您的业务提供专业的开端"], 
    },
    namingPremium: { ...uzServiceDetails.namingPremium, label: "高级命名", description: "适合中型和成长型企业的战略方法。", 
        features: [
            { feature: "5个以上符合战略的深思熟虑的名称选项", benefit: "您将能够从几个符合您战略的强有力方向中选择最好的一个。任何听到它的人都可以轻松找到它。" },
            { feature: "6种语言的语义和语音检查", benefit: "进入国际市场时，您的名字不会有负面含义，并且易于发音。" },
            { feature: "域名和社交媒体可用性检查", benefit: "您选择的名称在互联网上不会被占用，您可以在营销中无障碍地工作。" },
            { feature: "深入的可专利性检查（最多2类）和法律意见", benefit: "您将有充分的依据来合法保护您的品牌名称。" },
            { feature: "免费注册域名5年", benefit: "您最重要的在线资产将受到5年的保护。" },
            { feature: "100% 满意保证", benefit: "如果您不喜欢任何一个提议的名称选项，我们将全额退款。" }
        ],
        benefits: ["为您的品牌获得一个战略上强大的名称", "创造进入国际市场的机会", "获得一个受法律保护的名称"], 
    },
    namingVIP: { ...uzServiceDetails.namingVIP, label: "VIP命名", description: "适合大型和国际项目。", 
        features: [
            { feature: "由Bakhtiyorjon Gaziyev亲自参与和监督", benefit: "您将获得顶级专家的直接关注——您的名字将基于经验，而非偶然。" },
            { feature: "10个以上具有广泛概念和故事的名称选项", benefit: "您将有广泛的选择——从几个强有力的方向中，您将选择对您最有利的一个。任何听到它的人都可以轻松找到它。" },
            { feature: "域名和社交媒体可用性检查", benefit: "您选择的名称在互联网上不会被占用，您可以在营销中无障碍地工作。" },
            { feature: "免费注册域名10年", benefit: "您的在线空间将安全10年。竞争对手无法抢走您的域名。" },
            { feature: "基于讲故事的每个名称的专业演示", benefit: "您将能够精美且有说服力地为品牌名称辩护。投资者、合作伙伴或客户会立刻明白为什么选择这个名字。" },
            { feature: "协助专利申请（政府费用另计）", benefit: "我们立即开始合法保护您的品牌名称的过程，您不会浪费时间。" },
            { feature: "100% 满意保证", benefit: "如果您不喜欢任何一个提议的名称选项，我们将全额退款。" }
        ],
        benefits: ["获得一个争夺绝对市场领导地位的名称", "一个受到最大保护且深思熟虑的品牌名称", "个人专家监督和支持"], 
    },
    logoStandard: { ...uzServiceDetails.logoStandard, label: "标准标志", description: "为初创公司提供的快速解决方案。", features: [
            { feature: "基于公司简报的3个标志概念", benefit: "您将有机会从几个适合您业务的选项中选择一个。" },
            { feature: "在5个接触点上的可视化", benefit: "您将提前看到您的标志在现实生活中的样子（在名片上、在帖子中、在网站上）。" },
            { feature: "矢量标志文件（AI, EPS, PNG, JPG, PDF）", benefit: "您可以在任何尺寸和任何地方使用标志而不会损失质量。" },
            { feature: "100% 满意保证", benefit: "如果您不喜欢最初的概念，我们将全额退款。" }
        ], benefits: ["为您的业务创建一个专业的视觉基础", "获得一个快速且高质量的标志"] },
    logoPremium: { ...uzServiceDetails.logoPremium, label: "标志与企业形象", description: "为那些认真发展品牌的企业。", features: [
            { feature: "5个符合战略的标志概念", benefit: "您的标志将不仅仅是漂亮的，还将服务于商业目标。" },
            { feature: "企业形象（主色、字体、规则）", benefit: "您所有的营销材料都将看起来统一和专业，这将加强您的品牌。" },
            { feature: "在15个以上接触点上的可视化", benefit: "您将确切地看到您的品牌在各种情况下的工作方式（广告、包装、社交网络）。" },
            { feature: "矢量标志文件（AI, EPS, PNG, JPG, PDF）", benefit: "您可以在任何尺寸和任何地方使用标志而不会损失质量。" },
            { feature: "10个Telegram贴纸", benefit: "您可以在与客户的沟通中非正式且有趣地展示您的品牌。" },
            { feature: "100% 满意保证", benefit: "如果您不喜欢最初的概念，我们将全额退款。" }
        ], benefits: ["为您的品牌获得一个完整和系统的视觉解决方案", "在客户心目中创建一个强大和统一的形象", "在您的营销材料中实现专业外观"] },
    logoVIP: { ...uzServiceDetails.logoVIP, label: "标志 + 企业形象 + 品牌手册", description: "扩展的形象和全面支持。", features: [
            { feature: "Bakhtiyorjon Gaziyev的亲自参与", benefit: "您的项目将由业内最有经验的专家之一亲自监督。" },
            { feature: "8个以上基于战略的标志概念", benefit: "您将有最大的选择来为您的品牌找到完美的解决方案。" },
            { feature: "视觉品牌手册和标志手册", benefit: "您将获得管理品牌的“宪法”，这将为您节省未来的设计成本。" },
            { feature: "矢量标志文件（AI, EPS, PNG, JPG, PDF）", benefit: "您可以在任何尺寸和任何地方使用标志而不会损失质量。" },
            { feature: "标志动画（高品质）", benefit: "在数字平台上，您的品牌将栩栩如生，并从竞争对手中脱颖而出。" },
            { feature: "项目完成后长达3个月的支持", benefit: "在项目完成后，您在实践中实施设计时不会孤单。" },
            { feature: "100% 满意保证", benefit: "如果您不喜欢最初的概念，我们将全额退款。" }
        ], benefits: ["为您的品牌获得一个“交钥匙”解决方案", "在市场上争取高端细分市场", "获得管理品牌的完整指南和工具"] },
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




    
