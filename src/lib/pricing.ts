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
                "Har bir nom uchun to'liq izoh",
                "Talaffuz, esda qolishi va jarang tekshiruvi",
                "Domen bo'shligini tekshirish (.com, .uz)",
                "Instagram va Telegram username bo'shligini tekshirish",
                "O'zbekistonda va xalqaro bazalarda patent tekshiruvi",
                "Raqobatchilar nomlari tahlil qilinadi — siz uchun eng farqli pozitsiya aniqlanadi",
                "Nom boshqa tillarda noqulay ma'no bermasligini tekshirish",
                "Nomning hissiy ma'nosi yoziladi",
                "3 ta qisqa shior varianti (Nike — \"Just Do It\" kabi)",
                "Patentga topshirish xizmati (davlat bojlari alohida)",
                "Nom sizning mulkingiz ekanligini tasdiqlovchi sertifikat",
                "30 daqiqalik shaxsiy konsultatsiya",
                "Cheksiz tuzatish (30 kun ichida)"
            ] : [
                "10 name concepts with strategy",
                "Phonetic & Recall testing",
                "Domain & Social handle check",
                "Local & International patent check",
                "Competitor analysis & positioning",
                "Linguistic check for global markets",
                "3 slogans & Ownership certificate",
                "Patent filing service",
                "Strategy session & Unlimited revisions"
            ],
            benefits: isUz ? [
                { icon: "🌍", title: "Xalqaro bozorga tayyor bo'lasiz", description: "Nomingiz boshqa tillarda tekshiriladi — dunyo bo'ylab ishlaydi, hech qayerda noqulay ma'no bermaydi." },
                { icon: "🔒", title: "Nomingiz to'liq sizniki bo'ladi", description: "Patent va sertifikat bilan nomingiz rasman himoyalanadi. Hech kim o'g'irlay olmaydi, hech kim taqlid qila olmaydi." },
                { icon: "💎", title: "Biznesingizga qiymat qo'shiladi", description: "Himoyalangan kuchli nom — kompaniya qiymatining bir qismi. Investor va sheriklar uchun bu jiddiy signal." },
                { icon: "🎯", title: "To'g'ri qaror qabul qilasiz", description: "30 daqiqa shaxsiy suhbatda to'g'ri yo'lni birgalikda belgilaymiz. Yolg'iz emas, mutaxassis bilan." }
            ] : [
                { icon: "🌍", title: "Global Market Ready", description: "Linguistic check ensures your name works worldwide without negative meanings." },
                { icon: "🔒", title: "Full Ownership", description: "Protected by patent and certificate. No one can steal or copy your identity." },
                { icon: "💎", title: "Business Value Up", description: "A protected strong name is a tangible asset for investors and partners." },
                { icon: "🎯", title: "Expert Guidance", description: "30-minute strategy call to ensure you make the right choice with an expert." }
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
                "Har bir nom uchun izoh",
                "Talaffuz, esda qolishi va jarang tekshiruvi",
                "Domen bo'shligini tekshirish (.com, .uz)",
                "Instagram va Telegram username bo'shligini tekshirish",
                "O'zbekiston bazasida patent tekshiruvi",
                "Raqobatchilar nomlari tahlil qilinadi",
                "Nomning hissiy ma'nosi yoziladi",
                "3 ta tuzatish imkoniyati"
            ] : [
                "6 name concepts with strategy",
                "Phonetic & Recall testing",
                "Domain & Social handle check",
                "Local patent database check",
                "Competitor names analysis",
                "Emotional impact analysis",
                "3 revision rounds"
            ],
            benefits: isUz ? [
                { icon: "⚖️", title: "Huquqiy xavfsizlik", description: "Kimdir sizning nomingizni oldin patent qilmaganligini tekshiramiz. Kelajakda qimmat muammolardan qutulasiz." },
                { icon: "🏆", title: "Raqobatdan ajralib turasiz", description: "Bozordagi o'xshash nomlarni tahlil qilib, hech kimga o'xshamagan nom topamiz. Mijozlar sizni eslab qoladi." },
                { icon: "❤️", title: "Mijozlar nomingizni yaxshi ko'radi", description: "Nomga his-tuyg'u yuklanadi — mijozlar eslab qoladi va do'stlariga aytib beradi." },
                { icon: "📈", title: "Brendingiz kuchli boshlanadi", description: "Kuchli nom marketing xarajatlarini kamaytiradi. Nom o'zi ishlaydi — har safar aytilganda brendingiz mustahkamlanadi." }
            ] : [
                { icon: "⚖️", title: "Legal Safety", description: "We ensure no one else has patented the name, saving you from future legal costs." },
                { icon: "🏆", title: "Stand Out", description: "We find a unique identity that customers will remember above competitors." },
                { icon: "❤️", title: "Emotional Connection", description: "We inject feelings into the name that build long-term customer loyalty." },
                { icon: "📈", title: "Strong Start", description: "A great name reduces marketing costs by working for you consistently." }
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
                "Optimal solution for start",
                "1 revision round"
            ],
            benefits: isUz ? [
                { icon: "🛡️", title: "Xavfli nomdan qutulasiz", description: "Esda qolmaydigan yoki noto'g'ri talaffuz qilinadigan nom birinchi mijozlaringizni yo'qotadi. Biz buni oldini olamiz." },
                { icon: "⚡", title: "Vaqt tejaysiz", description: "Yuzlab nom o'ylab o'tirish o'rniga, 7–10 kunda professional tahlil qilingan nom olasiz." },
                { icon: "✅", title: "Ishonch bilan boshlaysiz", description: "\"To'g'ri nom topdimmi?\" degan shubha yo'qoladi. Tahlil qilingan, tekshirilgan nom qo'lingizda bo'ladi." },
                { icon: "📱", title: "Digital tayyor bo'lasiz", description: "Domen va social media username band emasligini bilib olasiz — keyinchalik boshqa nom qidirish muammosi bo'lmaydi." }
            ] : [
                { icon: "🛡️", title: "Avoid Risks", description: "Prevent losing customers due to hard-to-pronounce or forgettable names." },
                { icon: "⚡", title: "Save Time", description: "Get professional names in 7-10 days instead of weeks of brainstorming." },
                { icon: "✅", title: "Confident Launch", description: "Remove doubts with a professionally analyzed and verified name." },
                { icon: "📱", title: "Digital Ready", description: "Verify domains and social handles are free before you start." }
            ]
        },
        logoStandard: {
            label: isUz ? "Unikal Logo" : "Unique Logo",
            subDescription: isUz ? "Endigina boshlamoqchi bo'lganlar uchun" : "For those just starting out",
            description: isUz ? "Faqat logotip va uning asosiy ko'rinishlari." : "Just the logo and its main variations.",
            price: basePricesUSD.logoStandard,
            timeline: isUz ? "⏱ 7–10 ish kuni" : "⏱ 7–10 business days",
            features: isUz ? [
                "3 ta logo varianti — bittasini tanlaysiz",
                "Har bir variant uchun strategik izoh",
                "Logo 4 ko'rinishda: Yotiq, Tik, Qora-oq va faqat belgisi",
                "Ijtimoiy tarmoqlar uchun profil rasmlari",
                "Barcha manba fayllar (PNG, SVG, AI)",
                "8 ta aloqa nuqtasida vizual namoyish",
                "1 ta tuzatish imkoniyati"
            ] : [
                "3 concepts - pick one",
                "Strategic reasoning",
                "4 lockups (Horizontal, Vertical, B&W, Icon)",
                "Social media profile pics",
                "3 file formats (PNG, SVG, AI)",
                "Visuals on 8 touchpoints",
                "1 revision"
            ],
            benefits: isUz ? [
                { icon: "🎯", title: "Hamma joyga mos keladi", description: "Logongiz sayt, Instagram va chop etishga to'liq tayyor holatda topshiriladi." },
                { icon: "✅", title: "Professional ko'rinish", description: "Mijozlaringizda brendingizga nisbatan birinchi ko'rishdayoq ishonch uyg'otadi." },
                { icon: "👁️", title: "Real ko'rinishni bilasiz", description: "8 ta muhim nuqtada logongiz qanday ko'rinishini oldindan vizual ko'rasiz." },
                { icon: "🛡️", title: "Fayllar to'liq sizniki", description: "Barcha original fayllar topshiriladi, kelajakda xohlagancha foydalana olasiz." }
            ] : [
                { icon: "🎯", title: "Works everywhere", description: "Ready for web, social and print." },
                { icon: "✅", title: "Professional look", description: "Confidence in your brand image." },
                { icon: "👁️", title: "Real world visuals", description: "See it on 8 key touchpoints." },
                { icon: "🛡️", title: "Full ownership", description: "Source files are yours forever." }
            ]
        },
        logoPremium: {
            label: isUz ? "Logo + Firma uslubi" : "Logo + Visual Identity",
            subDescription: isUz ? "O'sishni rejalashtiraganlar uchun" : "For those planning growth",
            description: isUz ? "To'liq vizual tizim va qo'llash qoidalari." : "Complete visual system and rules.",
            price: basePricesUSD.logoPremium,
            recommended: true,
            timeline: isUz ? "⏱ 14–20 ish kuni" : "⏱ 14–20 business days",
            features: isUz ? [
                "3 ta logo varianti — bittasini tanlaysiz",
                "Har bir variant uchun strategik izoh",
                "Logo 4 ko'rinishda: Yotiq, Tik, Qora-oq va faqat belgisi",
                "Ijtimoiy tarmoqlar uchun profil rasmlari",
                "Barcha manba fayllar (PNG, SVG, AI)",
                "Rasmiy ranglar to'plami va aniq kodlari",
                "Rasmiy brend shriftlari va qo'llash qoidalari",
                "15 ta aloqa nuqtasida vizual namoyish",
                "3 ta tuzatish imkoniyati"
            ] : [
                "3 concepts - pick one",
                "Strategic reasoning",
                "4 lockups",
                "Social profile pics",
                "Source files (AI, SVG, PNG)",
                "Official color palette & codes",
                "Official brand fonts",
                "Visuals on 15 touchpoints",
                "3 revisions"
            ],
            benefits: isUz ? [
                { icon: "🏆", title: "Har joyda professional qiyofa", description: "Sayt, Instagram, paket va vizitka — hammasi bir xil mukammal uslubda." },
                { icon: "💼", title: "Xodimlar uchun tushunarli", description: "Aniq vizual qoidalar bo'lgach, jamoangiz brendni to'g'ri qo'llaydi." },
                { icon: "📸", title: "Tayyor taqdimot", description: "15 ta nuqtada brendingizni vizual ko'rasiz — investorlarga ko'rsatishga tayyor." },
                { icon: "📈", title: "Brend qiymati oshadi", description: "Yaxlit va izchil ko'rinish professional biznesning asosiy belgisidir." }
            ] : [
                { icon: "🏆", title: "Consistent look", description: "Website, social and print match." },
                { icon: "💼", title: "Easy for team", description: "Clear rules for everyone." },
                { icon: "📸", title: "Ready for clients", description: "Visuals on 15 touchpoints." },
                { icon: "📈", title: "Brand value up", description: "Consistency is professional." }
            ]
        },
        logoVIP: {
            label: isUz ? "Logo + Stil + Brandbook" : "Logo + Style + Brandbook",
            subDescription: isUz ? "Hamma narsani bir marta to'g'ri qilmoqchilar uchun" : "For those doing it right once",
            description: isUz ? "Brendingizning to'liq 'konstitutsiyasi'." : "Full 'constitution' of your brand.",
            price: basePricesUSD.logoVIP,
            timeline: isUz ? "⏱ 20–25 ish kuni" : "⏱ 20–25 business days",
            features: isUz ? [
                "3 ta logo varianti + chuqur strategik tahlil",
                "Logo 4 ko'rinishda: Yotiq, Tik, Qora-oq va faqat belgisi",
                "Ijtimoiy tarmoqlar uchun profil rasmlari",
                "Barcha manba fayllar (PNG, SVG, AI)",
                "Rasmiy ranglar va shriftlar tizimi",
                "To'liq Brandbook (30-50 sahifa)",
                "25 ta aloqa nuqtasida professional vizual",
                "Logoning to'liq mulk huquqi sertifikati",
                "Cheksiz tuzatish (30 kun ichida)"
            ] : [
                "3 concepts + deep strategic reasoning",
                "4 lockups + social pics",
                "Source files + Color/Font systems",
                "Full Brandbook (30-50 pages)",
                "Visuals on 25 touchpoints",
                "Unlimited revisions (30 days)",
                "Full ownership certificate"
            ],
            benefits: isUz ? [
                { icon: "📖", title: "Mukammal qo'llanma", description: "Bu kitob bilan istalgan dizayner brendingizni to'g'ri davom ettira oladi." },
                { icon: "🔒", title: "Yillar o'tsa ham o'zgarmas", description: "Brendingiz 10 yildan keyin ham bugungidek kuchli va zamonaviy ko'rinadi." },
                { icon: "🌍", title: "Xalqaro standart", description: "Investorlar va hamkorlar sizni jiddiy, professional kompaniya deb bilishadi." },
                { icon: "💎", title: "Oqilona sarmoya", description: "Bu bir marta qilinadigan va biznesingizga yillar davomida foyda keltiradigan investitsiya." }
            ] : [
                { icon: "📖", title: "Easy handover", description: "Hand it to any designer." },
                { icon: "🔒", title: "Built to last", description: "Stays strong for 10+ years." },
                { icon: "🌍", title: "Global standard", description: "Investors see a serious company." },
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
                { icon: "🏢", title: "Bozorda farqlanish", description: "Raqobatchilaringizdan vizual jihatdan keskin ajralib turasiz." }
            ] : [
                { icon: "🎁", title: "Attractive pack", description: "Make customers want to touch and buy your product." },
                { icon: "🏢", title: "Market presence", description: "Stand out visually from every competitor on the shelf." }
            ]
        },
        smm: { 
            label: isUz ? "Instagram uchun stil" : "Social Media Style", 
            description: isUz ? "Sahifangizni tartibli va brendga mos qilish." : "Make your page organized and brand-consistent.",
            price: basePricesUSD.smm, 
            timeline: isUz ? "⏱ 5-7 ish kuni" : "⏱ 5-7 business days",
            features: isUz ? ["Profil rasmi va bio dizayni", "9 ta post uchun shablon", "Storislar uchun dizayn tizimi", "Highlight ikonkalari"] : ["Profile picture and bio design", "9 post templates", "Design system for stories", "Highlight icons"],
            benefits: isUz ? [
                { icon: "📱", title: "Tartibli sahifa", description: "Instagram profilingiz professional va ishonchli ko'rinadi." },
                { icon: "✨", title: "Oson kontent", description: "Tayyor shablonlar bilan post tayyorlash 2 barobar tezlashadi." }
            ] : [
                { icon: "📱", title: "Organized profile", description: "Your Instagram looks professional and trustworthy." },
                { icon: "✨", title: "Easy content", description: "Create posts twice as fast with pre-designed templates." }
            ]
        },
        urgency: { 
            label: isUz ? "Shoshilinch loyiha (+50%)" : "Urgent Project (+50%)", 
            description: isUz ? "Loyihangizni navbatsiz va tezkor tayyorlab berish." : "Expedited project delivery ahead of queue.",
            price: 0,
            features: isUz ? ["Ishchi guruhni safarbar qilish", "Dam olish kunlarisiz ishlash", "Muddati 2-3 barobarga qisqaradi"] : ["Mobilizing workforce", "Working through weekends", "2-3x faster delivery"],
            benefits: isUz ? [
                { icon: "🚀", title: "Vaqtdan yutasiz", description: "Bozorga tezroq kirib borasiz." },
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
            features: isUz ? ["Yuridik shartnoma", "Ma'lumotlar uchinchi shaxsga berilmaydi", "Portfolioga qo'yilmaydi"] : ["Legal agreement", "No third-party data sharing", "Excluded from public portfolio"],
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