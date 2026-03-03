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
    
    return {
        audit: {
            label: isUz ? "Logo Auditi" : (isRu ? "Аудит логотипа" : "Logo Audit"),
            description: isUz ? "Mavjud logotipni strategik tahlil qilish va tavsiyalar." : "Strategic analysis and recommendations for your existing logo.",
            price: basePricesUSD.audit,
            timeline: isUz ? "⏱ 2-3 ish kuni" : "⏱ 2-3 business days",
            features: isUz ? ["Logoning texnik tahlili", "Bozorga moslik tekshiruvi", "Kamchiliklar ro'yxati", "Yaxshilash bo'yicha tavsiyalar"] : ["Technical analysis", "Market fit check", "List of weaknesses", "Improvement tips"],
            benefits: isUz ? [
                { icon: "🔍", title: "Kamchiliklarni bilasiz", description: "Logotipingizdagi barcha xato va kamchiliklar aniqlanadi." },
                { icon: "💡", title: "Yaxshilash yo'li", description: "Logotipni qanday qilib zamonaviy qilish bo'yicha aniq yo'l xaritasi olasiz." }
            ] : [
                { icon: "🔍", title: "Identify flaws", description: "Discover all technical and strategic errors in your logo." },
                { icon: "💡", title: "Improvement path", description: "Get a clear roadmap on how to modernize your visual identity." }
            ]
        },
        namingCheck: {
            label: isUz ? "Neyming Tekshiruvi" : (isRu ? "Проверка нейминга" : "Naming Check"),
            description: isUz ? "Brend nomini huquqiy va raqamli bazalarda tekshirish." : "Checking brand name availability in legal and digital databases.",
            price: basePricesUSD.namingCheck,
            timeline: isUz ? "⏱ 1-2 ish kuni" : "⏱ 1-2 business days",
            features: isUz ? [
                "O'zbekistondan tekshiruv",
                "Xalqaro bazadan tekshiruv",
                "Internetda ma'lum mashhur nomlar tekshiruvi"
            ] : [
                "Local database check",
                "International database check",
                "Global popular names check"
            ],
            benefits: isUz ? [
                { icon: "⚖️", title: "Huquqiy xavfsizlik", description: "Nomingiz boshqa patent bilan to'qnash kelmasligini bilasiz." },
                { icon: "✅", title: "Ishonch bilan boshlash", description: "Nomning band emasligiga amin bo'lib, xaridni boshlaysiz." }
            ] : [
                { icon: "⚖️", title: "Legal Safety", description: "Ensure your name doesn't conflict with existing trademarks." },
                { icon: "✅", title: "Confident Launch", description: "Start your business knowing your name is available." }
            ]
        },
        consultation: {
            label: isUz ? "Konsultatsiya" : (isRu ? "Консультация" : "Consultation"),
            description: isUz ? "Brending va biznesni upakovka qilish bo'yicha professional maslahat." : "Professional advice on branding and business packaging.",
            price: basePricesUSD.consultation,
            timeline: isUz ? "⏱ 60 daqiqa" : "⏱ 60 minutes",
            features: isUz ? ["Muammolarni tahlil qilish", "Brending strategiyasi", "Savollarga javoblar", "Yo'l xaritasi tuzish"] : ["Problem analysis", "Branding strategy", "Q&A session", "Roadmap creation"],
            benefits: isUz ? [
                { icon: "💬", title: "Ekspert fikri", description: "9 yillik tajribaga ega mutaxassisdan shaxsiy maslahat." },
                { icon: "🎯", title: "Aniq maqsad", description: "Biznesingiz uchun qaysi brending bosqichi kerakligini aniqlaysiz." }
            ] : [
                { icon: "💬", title: "Expert opinion", description: "Personal advice from a specialist with 9 years of experience." },
                { icon: "🎯", title: "Clear goals", description: "Identify exactly which branding steps your business needs." }
            ]
        },
        strategy: {
            label: isUz ? "Brend-strategiya" : (isRu ? "Бренд-стратегия" : "Brand Strategy"),
            description: isUz ? "Biznesingiz uchun natija keltiradigan poydevor." : "A foundation that brings results for your business.",
            price: basePricesUSD.strategy,
            timeline: isUz ? "⏱ 20-30 ish kuni" : "⏱ 20-30 business days",
            features: isUz ? [
                "Bozor va raqobat tahlili",
                "Maqsadli auditoriya xaritasi",
                "Brend platformasi",
                "Pozitsiyalash strategiyasi",
                "Noyob Sotuv Taklifi (USP)"
            ] : ["Market & Competitor analysis", "Target audience map", "Brand platform", "Positioning strategy", "USP development"],
            benefits: isUz ? [
                { icon: "📊", title: "Bozorda aniq o'rin", description: "Raqobatchilaringizdan qanday ajralib turishni aniq bilasiz." },
                { icon: "🚀", title: "Sotuvlar o'sishi", description: "To'g'ri pozitsiyalash mijozlar sonini oshiradi." }
            ] : [
                { icon: "📊", title: "Market Position", description: "Know exactly how to stand out from your competitors." },
                { icon: "🚀", title: "Sales Growth", description: "Correct positioning increases your conversion rate." }
            ]
        },
        commStrategy: {
            label: isUz ? "Kommunikatsion strategiya" : (isRu ? "Коммуникационная стратегия" : "Communication Strategy"),
            description: isUz ? "Mijozlar bilan muloqot va reklama tili." : "Communication and advertising language for customers.",
            price: basePricesUSD.commStrategy,
            timeline: isUz ? "⏱ 15-20 ish kuni" : "⏱ 15-20 business days",
            features: isUz ? ["Brend ovozi (Tone of Voice)", "Asosiy xabarlar tizimi", "Media kanallar tanlovi", "Kontent rejasi tamoyillari"] : ["Tone of Voice", "Key messaging system", "Media channel selection", "Content plan principles"],
            benefits: isUz ? [
                { icon: "📢", title: "Mijoz bilan til topishish", description: "Auditoriya bilan qaysi tilda gaplashishni belgilaysiz." },
                { icon: "🔗", title: "Yaxlit muloqot", description: "Barcha kanallarda brendingiz bir xil va kuchli yangraydi." }
            ] : [
                { icon: "📢", title: "Audience Connection", description: "Define the exact language to use with your customers." },
                { icon: "🔗", title: "Unified Voice", description: "Your brand sounds consistent and strong across all channels." }
            ]
        },
        namingVIP: {
            label: "Naming VIP",
            description: isUz ? "Nom emas — aktiv" : "Not just a name — an asset",
            subDescription: isUz ? "Jiddiy investitsiya qiladiganlar uchun" : "For serious investors",
            price: basePricesUSD.namingVIP,
            timeline: isUz ? "⏱ 20–25 ish kuni" : "⏱ 20–25 business days",
            features: isUz ? [
                "10 ta nom varianti tayyorlanadi",
                "Har bir nom uchun strategik izoh",
                "Nomning talaffuzi, esda qolishi va jaranglashi tekshiruvi",
                "Domen bo'shligini tekshirish (.com, .uz)",
                "Instagram va Telegram username bo'shligini tekshirish",
                "O'zbekistonda va xalqaro bazalarda patent tekshiruvi",
                "Raqobatchilar nomlari tahlili — eng farqli pozitsiya",
                "Nom boshqa tillarda noqulay ma'no bermasligini tekshirish",
                "Nomning hissiy ma'nosi va mijozga ta'siri",
                "3 ta qisqa shior varianti (Nike — Just Do It kabi)",
                "Patentga topshirish xizmati (davlat bojlari alohida)",
                "Nom sizning mulkingiz ekanini tasdiqlovchi sertifikat",
                "30 daqiqalik shaxsiy strategik konsultatsiya",
                "Cheksiz tuzatish (30 kun ichida)"
            ] : [
                "10 name concepts with strategy",
                "Phonetic & Recall testing",
                "Domain & Social handle check",
                "Local & International patent check",
                "Competitor analysis & positioning",
                "Linguistic check for global markets",
                "Meaning and emotional impact report",
                "3 slogans (e.g. Nike — Just Do It)",
                "Official patent filing service",
                "Full ownership certificate",
                "30-min strategy session",
                "Unlimited revisions (30 days)"
            ],
            benefits: isUz ? [
                { icon: "🌍", title: "Xalqaro bozorga tayyor", description: "Nomingiz boshqa tillarda ham tekshiriladi — dunyo bo'ylab ishlaydi." },
                { icon: "🔒", title: "To'liq sizning mulkingiz", description: "Patent va sertifikat bilan nomingiz rasman himoyalanadi." },
                { icon: "💎", title: "Biznes qiymati oshadi", description: "Himoyalangan kuchli nom — kompaniya qiymatining bir qismi." },
                { icon: "🎯", title: "To'g'ri qaror qabul qilasiz", description: "30 daqiqa shaxsiy suhbatda to'g'ri yo'lni birgalikda belgilaymiz." }
            ] : [
                { icon: "🌍", title: "Global Market Ready", description: "Linguistic check ensures your name works worldwide." },
                { icon: "🔒", title: "Full Ownership", description: "Protected by patent and certificate. No one can steal it." },
                { icon: "💎", title: "Business Value Up", description: "A protected strong name is a tangible asset." },
                { icon: "🎯", title: "Expert Guidance", description: "Strategy session to ensure you make the right choice." }
            ]
        },
        namingPremium: {
            label: "Naming Premium",
            description: isUz ? "To'g'ri nom, to'g'ri asos" : "Right name, right foundation",
            subDescription: isUz ? "O'sishni rejalashtiraganlar uchun" : "For those planning growth",
            price: basePricesUSD.namingPremium,
            recommended: true,
            timeline: isUz ? "⏱ 14–20 ish kuni" : "⏱ 14–20 business days",
            features: isUz ? [
                "6 ta nom varianti tayyorlanadi",
                "Har bir nom uchun strategik izoh",
                "Nomning talaffuzi, esda qolishi va jaranglashi tekshiruvi",
                "Domen bo'shligini tekshirish (.com, .uz)",
                "Instagram va Telegram username bo'shligini tekshirish",
                "O'zbekiston bazasida patent tekshiruvi",
                "Raqobatchilar nomlari tahlil qilinadi",
                "Nomning hissiy ma'nosi va mijozga ta'siri",
                "3 ta tuzatish imkoniyati"
            ] : [
                "6 name concepts with strategy",
                "Phonetic & Recall testing",
                "Domain & Social handle check",
                "Local patent database check",
                "Competitor names analysis",
                "Meaning and emotional impact",
                "3 revision rounds"
            ],
            benefits: isUz ? [
                { icon: "⚖️", title: "Huquqiy xavfsizlik", description: "Kimdir nomingizni oldin patent qilmaganligini tekshiramiz." },
                { icon: "🏆", title: "Raqobatdan ajralib turasiz", description: "Bozordagi o'xshash nomlarni tahlil qilib, unikal nom topamiz." },
                { icon: "❤️", title: "Mijozlar yaxshi ko'radi", description: "Nomga his-tuyg'u yuklanadi — mijozlar eslab qoladi." },
                { icon: "📈", title: "Brend kuchli boshlanadi", description: "Kuchli nom marketing xarajatlarini sezilarli kamaytiradi." }
            ] : [
                { icon: "⚖️", title: "Legal Safety", description: "Avoid future trademark conflicts and expensive legal issues." },
                { icon: "🏆", title: "Stand Out", description: "We find a unique identity that customers will remember." },
                { icon: "❤️", title: "Memorable Impact", description: "Emotional connection that builds long-term loyalty." },
                { icon: "📈", title: "Strong Launch", description: "A great name reduces future marketing costs." }
            ]
        },
        namingStandard: {
            label: "Naming Standart",
            description: isUz ? "Tez va ishonchli start" : "Fast and reliable start",
            subDescription: isUz ? "Endigina boshlamoqchi bo'lganlar uchun" : "For those just starting out",
            price: basePricesUSD.namingStandard,
            timeline: isUz ? "⏱ 7–10 ish kuni" : "⏱ 7–10 business days",
            features: isUz ? [
                "3 ta nom varianti tayyorlanadi",
                "Har bir nom uchun qisqa izoh",
                "Nomning talaffuzi qulay va esda qolishi tekshiriladi",
                "Domen bo'shligini tekshirish (.com, .uz)",
                "Instagram va Telegram username bo'shligini tekshirish",
                "1 ta tuzatish imkoniyati"
            ] : [
                "3 name concepts with brief info",
                "Pronunciation & Recall test",
                "Domain & Username check",
                "1 revision round"
            ],
            benefits: isUz ? [
                { icon: "🛡️", title: "Xavfli nomdan qutulasiz", description: "Esda qolmaydigan yoki noto'g'ri talaffuz nom mijoz yo'qotadi." },
                { icon: "⚡", title: "Vaqt tejaysiz", description: "Yuzlab nom o'ylab o'tirmasdan, professional nom olasiz." },
                { icon: "✅", title: "Ishonch bilan boshlaysiz", description: "Tahlil qilingan, tekshirilgan nom qo'lingizda bo'ladi." },
                { icon: "📱", title: "Digital tayyor bo'lasiz", description: "Domen va social media username band emasligini bilasiz." }
            ] : [
                { icon: "🛡️", title: "Avoid Risks", description: "Prevent losing customers due to hard-to-pronounce names." },
                { icon: "⚡", title: "Save Time", description: "Get professional results in a few days instead of weeks." },
                { icon: "✅", title: "Start Confidently", description: "Launch with a verified and strategically sound name." },
                { icon: "📱", title: "Digital Ready", description: "Verify social handles and domains are available." }
            ]
        },
        logoStandard: {
            label: isUz ? "Logo Standart" : "Unique Logo",
            description: isUz ? "Logom tayyor bo'lsin" : "Logo ready to go",
            subDescription: isUz ? "Endigina boshlamoqchi bo'lganlar uchun" : "For those just starting out",
            price: basePricesUSD.logoStandard,
            timeline: isUz ? "⏱ 5 ish kuni" : "⏱ 5 business days",
            features: isUz ? [
                "3 ta logo varianti — bittasini tanlaysiz",
                "Har bir variant uchun strategik izoh",
                "Logo 4 xil ko'rinishda: Gorizontal, Vertikal, Qora-oq, Belgi alohida",
                "Instagram va Telegram uchun profil rasmi",
                "3 xil fayl formatida topshiriladi: PNG, SVG, AI",
                "8 ta aloqa nuqtasida vizual namoyish",
                "2 ta tuzatish imkoniyati"
            ] : [
                "3 concepts - pick one",
                "Strategic reasoning",
                "4 lockups (Horizontal, Vertical, B&W, Icon)",
                "Social profile pics",
                "Source files (AI, SVG, PNG)",
                "Visuals on 8 touchpoints",
                "2 revisions"
            ],
            benefits: isUz ? [
                { icon: "🎯", title: "Hamma joyga tayyor", description: "Sayt, Instagram, chop etish — logongiz barcha formatda tayyor." },
                { icon: "✅", title: "Ishonch uyg'otadi", description: "Professional ko'rinish — mijozlar birinchi qarashda ishonch his qiladi." },
                { icon: "👁️", title: "Real ko'rinish", description: "8 ta joyda logongiz qanday ko'rinishini oldindan vizual ko'rasiz." },
                { icon: "🛡️", title: "Fayllar to'liq sizniki", description: "Barcha fayllar sizga topshiriladi. Hech kimga qarab o'tirmaysiz." }
            ] : [
                { icon: "🎯", title: "Works everywhere", description: "Ready for web, social and print." },
                { icon: "✅", title: "Professional look", description: "Confidence from day one." },
                { icon: "👁️", title: "Real world visuals", description: "See it on 8 key touchpoints." },
                { icon: "🛡️", title: "Full ownership", description: "Source files are yours forever." }
            ]
        },
        logoPremium: {
            label: isUz ? "Logo + Firma Uslubi" : "Logo + Visual Identity",
            description: isUz ? "Bir logomas — to'liq vizual tizim" : "Complete visual system",
            subDescription: isUz ? "O'sishni rejalashtiraganlar uchun" : "For those planning growth",
            price: basePricesUSD.logoPremium,
            recommended: true,
            timeline: isUz ? "⏱ 10 ish kuni" : "⏱ 10 business days",
            features: isUz ? [
                "4 ta logo varianti — to'rttasidan birini tanlaysiz",
                "Har bir variant uchun strategik izoh",
                "Logo 4 xil ko'rinishda: Gorizontal, Vertikal, Qora-oq, Belgi alohida",
                "Instagram va Telegram uchun profil rasmi",
                "3 xil fayl formatida topshiriladi: PNG, SVG, AI",
                "Rasmiy ranglar to'plami (rang kodlari bilan)",
                "Rasmiy shrift — brendingizning yagona uslubi",
                "15 ta aloqa nuqtasida vizual namoyish",
                "3 ta tuzatish imkoniyati"
            ] : [
                "4 concepts - pick one",
                "Strategic reasoning",
                "4 lockups",
                "Source files (AI, SVG, PNG)",
                "Official color palette & codes",
                "Official brand fonts",
                "Visuals on 15 touchpoints",
                "3 revisions"
            ],
            benefits: isUz ? [
                { icon: "🏆", title: "Professional qiyofa", description: "Sayt, Instagram, vizitka — hammasi bir xil professional uslubda." },
                { icon: "💼", title: "Tushunarli qoidalar", description: "Aniq ranglar va shrift bo'lgach, xodimlaringiz ham to'g'ri ishlatadi." },
                { icon: "📸", title: "Vizual kafolat", description: "15 ta muhim joyda brendingiz qanday ko'rinishi oldindan aniq bo'ladi." },
                { icon: "📈", title: "Brend qiymati", description: "Izchil ko'rinish — professional biznesning belgisi. Mijozlar ko'proq ishonadi." }
            ] : [
                { icon: "🏆", title: "Consistent look", description: "Website, social and print match." },
                { icon: "💼", title: "Easy for team", description: "Clear rules for everyone." },
                { icon: "📸", title: "Ready for clients", description: "Visuals on 15 touchpoints." },
                { icon: "📈", title: "Brand value up", description: "Consistency is key to professionalism." }
            ]
        },
        logoVIP: {
            label: isUz ? "Logo + Stil + Brandbook" : "Logo + Style + Brandbook",
            description: isUz ? "Hamma narsani bir marta to'g'ri qiling" : "Do it once, do it right",
            subDescription: isUz ? "Jiddiy investitsiya qiladiganlar uchun" : "For those doing it right once",
            price: basePricesUSD.logoVIP,
            timeline: isUz ? "⏱ 15–20 ish kuni" : "⏱ 15–20 business days",
            features: isUz ? [
                "5 ta logo varianti — beshtasidan birini tanlaysiz",
                "Har bir variant uchun chuqur strategik izoh",
                "Logo 4 xil ko'rinishda + Ijtimoiy tarmoqlar uchun profil rasmi",
                "3 xil fayl formatida topshiriladi: PNG, SVG, AI",
                "Rasmiy ranglar va shriftlar tizimi",
                "Brandbook — to'liq qo'llanma (qoidalar, fonga qo'yish, o'lchamlar)",
                "25 ta aloqa nuqtasida professional vizual namoyish",
                "Logoning to'liq mulkchilik huquqi sertifikati",
                "Cheksiz tuzatish (30 kun ichida)"
            ] : [
                "5 concepts - pick one",
                "Deep strategic reasoning",
                "4 lockups + social pics",
                "Source files (AI, SVG, PNG)",
                "Official color & font systems",
                "Full Brandbook (guidelines)",
                "Visuals on 25 touchpoints",
                "Full ownership certificate",
                "Unlimited revisions (30 days)"
            ],
            benefits: isUz ? [
                { icon: "📖", title: "Mukammal natija", description: "Istalgan dizayner qo'llanmani o'qib brendingizni to'g'ri ishlatadi." },
                { icon: "🔒", title: "Abadiy sifat", description: "Hamma qoidalar yozilgan — brendingiz 10 yildan keyin ham bir xil kuchli ko'rinadi." },
                { icon: "🌍", title: "Xalqaro standart", description: "Investor yoki xorijiy mijoz ko'rsa — jiddiy kompaniya ekanini his qiladi." },
                { icon: "💎", title: "Oqilona sarmoya", description: "Har yili rebrending qilish o'rniga — bir marta to'g'ri qilingan investitsiya." }
            ] : [
                { icon: "📖", title: "Perfect result", description: "Anyone can use it to maintain consistency." },
                { icon: "🔒", title: "Built to last", description: "Your brand stays strong for 10+ years." },
                { icon: "🌍", title: "Global standard", description: "Investors see a professional company." },
                { icon: "💎", title: "One-time investment", description: "Done correctly for the long term." }
            ]
        },
        packaging: { 
            label: isUz ? "Qadoq dizayni" : "Packaging Design", 
            description: isUz ? "Mahsulotingizning javondagi asosiy quroli." : "Your product's main weapon on the shelf.",
            price: basePricesUSD.packaging, 
            timeline: isUz ? "⏱ 10-15 ish kuni" : "⏱ 10-15 business days",
            features: isUz ? ["Vizual konsepsiya", "Qadoqni 3D namoyish qilish", "Chop etishga tayyor fayllar", "Materiallar bo'yicha tavsiyalar"] : ["Visual concept", "3D packaging visualization", "Print-ready files", "Material recommendations"],
            benefits: isUz ? [
                { icon: "🎁", title: "Jozibador qadoq", description: "Mijoz mahsulotingizni ushlab ko'rgisi va sotib olgisi keladi." },
                { icon: "🏢", title: "Bozorda farqlanish", description: "Raqobatchilardan vizual jihatdan keskin ajralib turasiz." }
            ] : [
                { icon: "🎁", title: "Attractive pack", description: "Make customers want to buy your product." },
                { icon: "🏢", title: "Market presence", description: "Stand out visually from competitors." }
            ]
        },
        smm: { 
            label: isUz ? "Instagram uchun stil" : "Social Media Style", 
            description: isUz ? "Sahifangizni tartibli va brendga mos qilish." : "Make your page organized and brand-consistent.",
            price: basePricesUSD.smm, 
            timeline: isUz ? "⏱ 5-7 ish kuni" : "⏱ 5-7 business days",
            features: isUz ? ["Profil rasmi va bio dizayni", "9 ta post uchun shablon", "Storislar uchun dizayn tizimi", "Highlight ikonkalari"] : ["Profile and bio design", "9 post templates", "Story design system", "Highlight icons"],
            benefits: isUz ? [
                { icon: "📱", title: "Tartibli sahifa", description: "Instagram profilingiz professional va ishonchli ko'rinadi." },
                { icon: "✨", title: "Oson kontent", description: "Tayyor shablonlar bilan post tayyorlash 2 barobar tezlashadi." }
            ] : [
                { icon: "📱", title: "Organized profile", description: "Your Instagram looks professional." },
                { icon: "✨", title: "Easy content", description: "Create posts twice as fast." }
            ]
        },
        urgency: { 
            label: isUz ? "Shoshilinch loyiha (+50%)" : "Urgent Project (+50%)", 
            description: isUz ? "Loyihangizni navbatsiz va tezkor tayyorlab berish." : "Expedited project delivery ahead of queue.",
            price: 0,
            timeline: isUz ? "⏱ 2-3 barobar tezroq" : "⏱ 2-3x faster",
            features: isUz ? ["Ishchi guruhni safarbar qilish", "Dam olish kunlarisiz ishlash", "Muddati 2-3 barobarga qisqaradi", "Loyiha birinchi darajali ustuvorlikda bo'ladi"] : ["Mobilizing workforce", "Working through weekends", "2-3x faster delivery", "Top project priority"],
            benefits: isUz ? [
                { icon: "🚀", title: "Vaqtdan yutasiz", description: "Bozorga raqobatchilardan tezroq kirib borasiz." },
                { icon: "🔥", title: "Prioritet", description: "Sizning loyihangiz biz uchun birinchi darajali." }
            ] : [
                { icon: "🚀", title: "Save Time", description: "Faster market entry." },
                { icon: "🔥", title: "Priority", description: "Your project becomes our top priority." }
            ]
        },
        nda: { 
            label: isUz ? "NDA — Maxfiylik (+50%)" : "NDA — Confidentiality (+50%)", 
            description: isUz ? "Loyihangiz ma'lumotlari sir saqlanishini kafolatlash." : "Guaranteed confidentiality of your project data.",
            price: 0,
            timeline: isUz ? "⏱ Darhol kuchga kiradi" : "⏱ Immediate effect",
            features: isUz ? ["Yuridik shartnoma (NDA)", "Ma'lumotlar uchinchi shaxsga berilmaydi", "Portfolioga qo'yilmaydi", "Barcha qidiruv bazalaridan maxfiylik"] : ["Legal agreement (NDA)", "No third-party data sharing", "Excluded from public portfolio", "Full privacy in search databases"],
            benefits: isUz ? [
                { icon: "🔒", title: "Maxfiylik", description: "Biznes sirlaringiz biz bilan xavfsiz." },
                { icon: "🛡️", title: "Xavfsizlik", description: "Ma'lumotlar to'liq himoyalangan." }
            ] : [
                { icon: "🔒", title: "Privacy", description: "Your business secrets are safe with us." },
                { icon: "🛡️", title: "Security", description: "Full data protection guaranteed." }
            ]
        }
    };
};

export function formatPrice(priceInUSD: number, lang: string = 'uz', currency: 'uzs' | 'usd' = 'usd') {
    if (priceInUSD === 0) return lang === 'uz' ? "Kelishiladi" : "Agreed";
    let price = currency === 'uzs' ? Math.round(priceInUSD * USD_TO_UZS_RATE / 100000) * 100000 : priceInUSD;
    let currencyString = currency === 'uzs' ? "so'm" : "$";
    return `${price.toLocaleString('fr-FR')} ${currencyString}`;
}

export const calculatePackagePrice = (selections: any, lang: string = 'uz'): any => {
    const isUz = lang === 'uz';
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
        surchargesApplied.push({ name: isUz ? 'Shoshilinch loyiha (+50%)' : 'Urgent Project (+50%)', value: val });
    }
    if (selectedServices.nda) {
        const val = basePrice * 0.5;
        surchargesTotal += val;
        surchargesApplied.push({ name: isUz ? 'NDA (Maxfiylik) (+50%)' : 'NDA (Confidentiality) (+50%)', value: val });
    }

    const totalBeforeDiscounts = basePrice + surchargesTotal;
    let finalPrice = totalBeforeDiscounts;
    const discountsApplied = [];

    const isPromoApplied = ['RAMAZON', 'PCG', 'KURSDOSH', 'TEZ NATIJA'].includes(promoCode?.toUpperCase());

    if (isPromoApplied) {
        const val = totalBeforeDiscounts * 0.50;
        discountsApplied.push({ name: lang === 'uz' ? 'Maxsus chegirma (-50%)' : 'Special Discount (-50%)', value: val });
        finalPrice -= val;
    } else {
        if (discountType === 'package' && mainServicesCount >= 2) {
            const val = totalBeforeDiscounts * 0.20;
            discountsApplied.push({ name: lang === 'uz' ? 'Paketli chegirma (-20%)' : 'Package Discount (-20%)', value: val });
            finalPrice -= val;
        } else if (discountType === 'full') {
            if (mainServicesCount >= 2) {
                const packageVal = totalBeforeDiscounts * 0.20;
                discountsApplied.push({ name: lang === 'uz' ? 'Paketli chegirma (-20%)' : 'Package Discount (-20%)', value: packageVal });
                finalPrice -= packageVal;
                const upfrontVal = finalPrice * 0.10;
                discountsApplied.push({ name: lang === 'uz' ? "Oldindan to'lov (-10%)" : "Upfront Payment (-10%)", value: upfrontVal });
                finalPrice -= upfrontVal;
            } else {
                const upfrontVal = totalBeforeDiscounts * 0.10;
                discountsApplied.push({ name: lang === 'uz' ? "Oldindan to'lov (-10%)" : "Upfront Payment (-10%)", value: upfrontVal });
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

export const comparisonData = (lang: 'uz' | 'ru' | 'en' = 'uz') => {
    return [
        { feature: "Strategik yondashuv", competitors: { jon: true, mano: true, abba: true, mountain: true } },
        { feature: "Bozor tahlili", competitors: { jon: true, mano: true, abba: true, mountain: true } },
        { feature: "Patent tekshiruvi", competitors: { jon: true, mano: "Kelishiladi", abba: false, mountain: false } },
        { feature: "Premium dizayn sifati", competitors: { jon: true, mano: true, abba: true, mountain: true } },
        { feature: "Narx (o'rtacha)", competitors: { jon: "$1,500+", mano: "$5,000+", abba: "$3,000+", mountain: "$2,500+" } },
        { feature: "Tezkor aloqa (24/7)", competitors: { jon: true, mano: false, abba: false, mountain: false } },
        { feature: "Bajarish muddati", competitors: { jon: "2-4 hafta", mano: "2-3 oy", abba: "1-2 oy", mountain: "1-2 oy" } }
    ];
};

export const generateSummary = (selections: any, lang: string = 'uz'): string => {
    const sd = getServiceDetails(lang) as any;
    const items = Object.entries(selections.selectedServices)
        .filter(([_, v]) => v)
        .map(([k]) => sd[k]?.label)
        .filter(Boolean);
    
    let summary = items.join(', ');
    if (selections.promoCode) summary += ` (Promokod: ${selections.promoCode})`;
    if (selections.discountType === 'full') summary += ` (100% Oldindan to'lov)`;
    
    return summary;
};