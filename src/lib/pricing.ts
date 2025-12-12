

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
        description: "Kichik biznes uchun ideal.", 
        price: basePricesUSD.namingStandard, 
        note: null, 
        features: [
            { feature: "Qisqa, jarangdor va esda qolarli 3 ta nom varianti", benefit: "Sizda bir nechta kuchli variantlardan tanlash imkoniyati bo'ladi." },
            { feature: "Domen va ijtimoiy tarmoqlarda bo'shlik tekshiruvi", benefit: "Tanlagan nomingiz internetda band bo'lmaydi, marketingda to'siqsiz ishlaysiz." },
            { feature: "Patentga yaroqlilik bo'yicha dastlabki tekshiruv (1 klass)", benefit: "Kelajakdagi katta huquqiy muammolarning oldini olasiz." },
            { feature: "Eshitgan odam yoza oladigan va topa oladigan nomlar", benefit: "Nomingiz oson talaffuz qilinadi va esda qoladi, bu esa og'zaki reklamani (word-of-mouth) kuchaytiradi." }
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
            { feature: "5+ strategiyaga mos, puxta o'ylangan nom variantlari", benefit: "Strategiyangizga mos bir nechta kuchli yo'nalishdan eng yaxshisini tanlab olasiz." },
            { feature: "6 tilda semantik va fonetik tekshiruv", benefit: "Xalqaro bozorga chiqqanda nomingiz salbiy ma'no bermaydi va oson talaffuz qilinadi." },
            { feature: "Patentga yaroqlilik bo'yicha chuqur tekshiruv va huquqiy xulosa", benefit: "Brend nomingizni huquqiy jihatdan himoya qilish uchun to'liq asosga ega bo'lasiz." },
            { feature: "5 yilga bepul domen band qilib beriladi", benefit: "Eng muhim onlayn aktivingiz 5 yil davomida himoyada bo'ladi." }
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
            { feature: "10+ keng konsepsiyali, hikoyaga ega nom variantlari", benefit: "Sizda tanlov keng bo‘ladi — bir nechta kuchli yo‘nalishdan sizga eng ko‘p foyda keltiradiganini tanlaysiz." },
            { feature: "10 yilga bepul domen band qilib beriladi", benefit: "Onlayn makoningiz 10 yil davomida xavfsiz. Raqobatchilar domeningizni olib qo‘yolmaydi." },
            { feature: "Har bir nom uchun storytelling asosida professional taqdimot", benefit: "Siz brend nomini chiroyli va ishonchli tarzda asoslay olasiz. Investor, hamkor yoki mijoz eshitishi bilanoq nimaga bu nom tanlanganini tushunadi." },
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
    strategy: { ...uzServiceDetails.strategy, label: "Бренд-стратегия и платформа", description: "Анализ рынка, аудит бренда, разработка позиционирования и ценностного предложения.", 
        features: [
            { feature: "Углубленный анализ рынка", benefit: "Вы не просто изучаете конкурентов, а выявляете 'скрытые' возможности и угрозы рынка. Это становится прочным фундаментом для ваших будущих решений." },
            { feature: "Сегментация целевой аудитории", benefit: "Отказавшись от подхода 'для всех', вы определяете конкретную группу клиентов, которые искренне полюбят и будут покупать ваш продукт, и учитесь говорить на их языке." },
            { feature: "Разработка бренд-платформы (Миссия, Ценности, Голос бренда)", benefit: "Ваш бренд становится не просто инструментом для зарабатывания денег, а 'живым' организмом со своей миссией. Это вдохновляет вашу команду и усиливает эмоциональную связь с клиентами." },
            { feature: "Уникальное торговое предложение (УТП) и позиционирование", benefit: "Вы занимаете определенное место в сознании клиентов. На вопрос 'Почему именно вы?' они смогут ответить без колебаний." },
            { feature: "Архитектура бренда", benefit: "Если у вас несколько продуктов или суббрендов, вы упорядочиваете их взаимоотношения. Это предотвращает будущие путаницы." },
            { feature: "История бренда (Storytelling)", benefit: "Клиенты покупают не только продукт, но и стоящую за ним историю. Мы создаем для вашего бренда увлекательную историю, которая привлекает людей." }
        ],
        benefits: ["Получите четкую карту развития для вашего бизнеса", "Оптимизируйте ваши маркетинговые расходы", "Займите прочное место на рынке"]
    },
    commStrategy: { ...uzServiceDetails.commStrategy, label: "Коммуникационная стратегия", description: "Стратегия общения с клиентами: тон, ключевые сообщения, каналы.", features: uzServiceDetails.commStrategy.features.map(f => ({...f})), benefits: uzServiceDetails.commStrategy.benefits.map(b => b) },
    namingStandard: { ...uzServiceDetails.namingStandard, label: "Нейминг Standard", description: "Идеально для малого бизнеса.", 
        features: [
            { feature: "3 варианта короткого, звучного и запоминающегося названия", benefit: "У вас будет возможность выбрать из нескольких сильных вариантов." },
            { feature: "Проверка доступности домена и в социальных сетях", benefit: "Выбранное вами имя не будет занято в интернете, вы сможете без препятствий работать в маркетинге." },
            { feature: "Первичная проверка на патентоспособность (1 класс)", benefit: "Вы предотвратите крупные юридические проблемы в будущем." },
            { feature: "Названия, которые легко написать и найти на слух", benefit: "Ваше имя будет легко произноситься и запоминаться, что усилит сарафанное радио." }
        ], 
        benefits: ["Получите быстрое и доступное имя", "Дайте профессиональный старт вашему бизнесу"], 
        timeline: "Первые концепции предоставляются в течение 7–10 рабочих дней" 
    },
    namingPremium: { ...uzServiceDetails.namingPremium, label: "Нейминг Premium", description: "Для среднего и развивающегося бизнеса.", 
        features: [
            { feature: "5+ продуманных вариантов названия, соответствующих стратегии", benefit: "Вы сможете выбрать лучшее из нескольких сильных направлений, соответствующих вашей стратегии." },
            { feature: "Семантическая и фонетическая проверка на 6 языках", benefit: "При выходе на международный рынок ваше имя не будет иметь негативного значения и будет легко произноситься." },
            { feature: "Глубокая проверка на патентоспособность и юридическое заключение", benefit: "Вы получите полное основание для юридической защиты вашего бренда." },
            { feature: "Бесплатная регистрация домена на 5 лет", benefit: "Ваш самый важный онлайн-актив будет защищен на 5 лет." }
        ], 
        benefits: ["Получите стратегически сильное имя для вашего бренда", "Создайте возможность выхода на международный рынок", "Получите юридически защищенное имя"], 
        recommended: true, 
        timeline: "Первые концепции предоставляются в течение 14–20 рабочих дней" 
    },
    namingVIP: { ...uzServiceDetails.namingVIP, label: "Нейминг VIP", description: "Для крупных и международных проектов.", 
        features: [
            { feature: "Личное участие и контроль Бахтиёржона Газиева", benefit: "Вам будет уделено непосредственное внимание специалиста высшего уровня — ваше имя будет основано на опыте, а не на случайности." },
            { feature: "10+ вариантов названия с широкой концепцией и историей", benefit: "У вас будет широкий выбор — из нескольких сильных направлений вы выберете то, которое принесет вам наибольшую пользу." },
            { feature: "Бесплатная регистрация домена на 10 лет", benefit: "Ваше онлайн-пространство будет в безопасности на 10 лет. Конкуренты не смогут забрать ваш домен." },
            { feature: "Профессиональная презентация для каждого названия на основе сторителлинга", benefit: "Вы сможете красиво и убедительно обосновать название бренда. Инвестор, партнер или клиент с первого раза поймет, почему было выбрано именно это имя." },
            { feature: "До 3 месяцев юридической консультации и поддержки после сдачи", benefit: "После запуска имени вы не останетесь одни. Поддержка по вопросам патента, домена, юридическим вопросам продолжится." }
        ], 
        benefits: ["Получите имя, претендующее на абсолютное лидерство на рынке", "Максимально защищенное и продуманное имя бренда", "Личный контроль и поддержка эксперта"], 
        timeline: "Первые концепции предоставляются в течение 20–25 рабочих дней" 
    },
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
    strategy: { ...uzServiceDetails.strategy, label: "Brand Strategy and Platform", description: "Market analysis, brand audit, positioning and value proposition development.", 
        features: [
            { feature: "In-depth market analysis", benefit: "You don't just study competitors, you identify 'hidden' market opportunities and threats. This becomes a solid foundation for your future decisions." },
            { feature: "Target audience segmentation", benefit: "By abandoning the 'for everyone' approach, you identify a specific group of customers who will genuinely love and buy your product, and you learn to speak their language." },
            { feature: "Brand platform development (Mission, Values, Brand Voice)", benefit: "Your brand becomes not just a tool for making money, but a 'living' organism with its own mission. This inspires your team and strengthens the emotional connection with customers." },
            { feature: "Unique Selling Proposition (USP) and positioning", benefit: "You occupy a specific place in the minds of customers. They will be able to answer the question 'Why you?' without hesitation." },
            { feature: "Brand architecture", benefit: "If you have several products or sub-brands, you regulate their relationship. This prevents future confusion." },
            { feature: "Brand storytelling", benefit: "Customers buy not just the product, but the story behind it. We create a compelling story for your brand that attracts people." }
        ],
        benefits: ["Get a clear development map for your business", "Optimize your marketing expenses", "Establish a strong position in the market"]
    },
    commStrategy: { ...uzServiceDetails.commStrategy, label: "Communication Strategy", description: "Customer communication strategy: tone, key messages, channels.", features: uzServiceDetails.commStrategy.features.map(f => ({...f})), benefits: uzServiceDetails.commStrategy.benefits.map(b => b) },
    namingStandard: { ...uzServiceDetails.namingStandard, label: "Naming Standard", description: "Ideal for small businesses.",
        features: [
            { feature: "3 short, sonorous, and memorable name options", benefit: "You'll have the opportunity to choose from several strong options." },
            { feature: "Domain and social media availability check", benefit: "Your chosen name won't be taken on the internet, allowing you to market without obstacles." },
            { feature: "Preliminary patentability check (1 class)", benefit: "You'll prevent major legal issues in the future." },
            { feature: "Names that are easy to write and find by ear", benefit: "Your name will be easy to pronounce and remember, which enhances word-of-mouth marketing." }
        ],
        benefits: ["Get a quick and affordable name", "Give your business a professional start"], 
        timeline: "First concepts are presented within 7–10 working days" 
    },
    namingPremium: { ...uzServiceDetails.namingPremium, label: "Naming Premium", description: "For medium and growing businesses.", 
        features: [
            { feature: "5+ well-thought-out name options aligned with the strategy", benefit: "You'll be able to choose the best from several strong directions that match your strategy." },
            { feature: "Semantic and phonetic check in 6 languages", benefit: "When entering the international market, your name will not have negative connotations and will be easy to pronounce." },
            { feature: "In-depth patentability check and legal opinion", benefit: "You'll have a full basis for legally protecting your brand name." },
            { feature: "Free domain registration for 5 years", benefit: "Your most important online asset will be protected for 5 years." }
        ],
        benefits: ["Get a strategically strong name for your brand", "Create an opportunity for international market entry", "Get a legally protected name"], 
        recommended: true, 
        timeline: "First concepts are presented within 14–20 working days" 
    },
    namingVIP: { ...uzServiceDetails.namingVIP, label: "Naming VIP", description: "For large and international projects.", 
        features: [
            { feature: "Personal involvement and supervision by Bakhtiyorjon Gaziyev", benefit: "You'll receive direct attention from a top-level expert—your name will be based on experience, not chance." },
            { feature: "10+ name options with broad concepts and stories", benefit: "You'll have a wide choice—from several strong directions, you'll choose the one that benefits you the most." },
            { feature: "Free domain registration for 10 years", benefit: "Your online space will be secure for 10 years. Competitors won't be able to take your domain." },
            { feature: "Professional presentation for each name based on storytelling", benefit: "You'll be able to justify the brand name beautifully and convincingly. An investor, partner, or client will understand why this name was chosen right away." },
            { feature: "Up to 3 months of post-delivery legal advice and monitoring", benefit: "You won't be alone after the name launch. Support on patent, domain, and legal issues will continue." }
        ],
        benefits: ["Get a name that contends for absolute market leadership", "A maximally protected and well-thought-out brand name", "Personal expert supervision and support"], 
        timeline: "First concepts are presented within 20–25 working days" 
    },
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
    strategy: { ...uzServiceDetails.strategy, label: "品牌策略与平台", description: "市场分析、品牌审核、定位和价值主张开发。",
        features: [
            { feature: "深入的市场分析", benefit: "您不仅研究竞争对手，还发现市场的“隐藏”机会和威胁。这为您未来的决策奠定了坚实的基础。" },
            { feature: "目标受众细分", benefit: "通过放弃“为所有人”的方法，您确定了一个特定的客户群体，他们会真正喜爱并购买您的产品，您学会了用他们的语言说话。" },
            { feature: "品牌平台开发（使命、价值观、品牌声音）", benefit: "您的品牌不仅仅是赚钱的工具，而是一个有自己使命的“活”的有机体。这会激励您的团队并加强与客户的情感联系。" },
            { feature: "独特的销售主张（USP）和定位", benefit: "您在客户心目中占据了特定的位置。他们将能够毫不犹豫地回答“为什么是您？”这个问题。" },
            { feature: "品牌架构", benefit: "如果您有多个产品或子品牌，您将规范它们之间的关系。这可以防止未来的混乱。" },
            { feature: "品牌故事", benefit: "客户购买的不仅仅是产品，还有它背后的故事。我们为您的品牌创造一个吸引人的引人入胜的故事。" }
        ],
        benefits: ["为您的业务获得清晰的发展蓝图", "优化您的营销开支", "在市场上建立稳固的地位"]
    },
    commStrategy: { ...uzServiceDetails.commStrategy, label: "传播策略", description: "客户传播策略：语调、关键信息、渠道。", features: uzServiceDetails.commStrategy.features.map(f => ({...f})), benefits: uzServiceDetails.commStrategy.benefits.map(b => b) },
    namingStandard: { ...uzServiceDetails.namingStandard, label: "标准命名", description: "适合小型企业。", 
        features: [
            { feature: "3个简短、响亮、易记的名称选项", benefit: "您将有机会从几个强有力的选项中进行选择。" },
            { feature: "域名和社交媒体可用性检查", benefit: "您选择的名称在互联网上不会被占用，您可以在营销中无障碍地工作。" },
            { feature: "初步可专利性检查（1类）", benefit: "您将避免未来重大的法律问题。" },
            { feature: "听得懂、写得出、找得到的名称", benefit: "您的名字将易于发音和记忆，这会增强口碑营销。" }
        ],
        benefits: ["获得一个快速且实惠的名称", "为您的业务提供专业的开端"], 
        timeline: "初步概念在7-10个工作日内提交" 
    },
    namingPremium: { ...uzServiceDetails.namingPremium, label: "高级命名", description: "适合中型和成长型企业。", 
        features: [
            { feature: "5个以上符合战略的深思熟虑的名称选项", benefit: "您将能够从几个符合您战略的强有力方向中选择最好的一个。" },
            { feature: "6种语言的语义和语音检查", benefit: "进入国际市场时，您的名字不会有负面含义，并且易于发音。" },
            { feature: "深入的可专利性检查和法律意见", benefit: "您将有充分的依据来合法保护您的品牌名称。" },
            { feature: "免费注册域名5年", benefit: "您最重要的在线资产将受到5年的保护。" }
        ],
        benefits: ["为您的品牌获得一个战略上强大的名称", "创造进入国际市场的机会", "获得一个受法律保护的名称"], 
        recommended: true, 
        timeline: "初步概念在14-20个工作日内提交" 
    },
    namingVIP: { ...uzServiceDetails.namingVIP, label: "VIP命名", description: "适合大型和国际项目。", 
        features: [
            { feature: "由Bakhtiyorjon Gaziyev亲自参与和监督", benefit: "您将获得顶级专家的直接关注——您的名字将基于经验，而非偶然。" },
            { feature: "10个以上具有广泛概念和故事的名称选项", benefit: "您将有广泛的选择——从几个强有力的方向中，您将选择对您最有利的一个。" },
            { feature: "免费注册域名10年", benefit: "您的在线空间将安全10年。竞争对手无法抢走您的域名。" },
            { feature: "基于讲故事的每个名称的专业演示", benefit: "您将能够精美且有说服力地为品牌名称辩护。投资者、合作伙伴或客户会立刻明白为什么选择这个名字。" },
            { feature: "交付后长达3个月的法律咨询和监控", benefit: "名称启动后您不会孤单。关于专利、域名和法律问题的支持将继续。" }
        ],
        benefits: ["获得一个争夺绝对市场领导地位的名称", "一个受到最大保护且深思熟虑的品牌名称", "个人专家监督和支持"], 
        timeline: "初步概念在20-25个工作日内提交" 
    },
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
