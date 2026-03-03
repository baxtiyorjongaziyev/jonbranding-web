
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
            features: isUz ? ["O'zbekistondan tekshiruv", "Xalqaro bazadan tekshiruv", "Internetda mashhur nomlar tekshiruvi"] : ["Local check", "International check", "Famous names check"],
            benefits: isUz ? [
                { icon: "⚖️", title: "Huquqiy xavfsizlik", description: "Nomingiz boshqa patent bilan to'qnash kelmasligini bilasiz." },
                { icon: "✅", title: "Ishonch bilan boshlash", description: "Nomning band emasligiga amin bo'lib, ishni boshlaysiz." }
            ] : [
                { icon: "⚖️", title: "Legal Safety", description: "Check availability." },
                { icon: "✅", title: "Confident Start", description: "Start knowing the name is free." }
            ]
        },
        consultation: {
            label: isUz ? "Konsultatsiya" : (isRu ? "Консультация" : "Consultation"),
            description: isUz ? "Brending va biznesni upakovka qilish bo'yicha professional maslahat." : "Professional advice on branding and business packaging.",
            price: basePricesUSD.consultation,
            timeline: isUz ? "⏱ 60 daqiqa" : "⏱ 60 minutes",
            features: isUz ? ["Muammolarni tahlil qilish", "Brending strategiyasi", "Savollarga javoblar", "Yo'l xaritasi tuzish"] : ["Problem analysis", "Branding strategy", "Q&A", "Roadmap"],
            benefits: isUz ? [
                { icon: "💬", title: "Ekspert fikri", description: "9 yillik tajribaga ega mutaxassisdan shaxsiy maslahat." },
                { icon: "🎯", title: "Aniq maqsad", description: "Biznesingiz uchun qaysi brending bosqichi kerakligini aniqlaysiz." }
            ] : [
                { icon: "💬", title: "Expert opinion", description: "Personal advice." },
                { icon: "🎯", title: "Clear Goal", description: "Define branding steps." }
            ]
        },
        strategy: {
            label: isUz ? "Brend-strategiya" : (isRu ? "Бренд-стратегия" : "Brand Strategy"),
            description: isUz ? "Biznesingiz uchun natija keltiradigan poydevor." : "A foundation that brings results for your business.",
            price: basePricesUSD.strategy,
            timeline: isUz ? "⏱ 20-30 ish kuni" : "⏱ 20-30 business days",
            features: isUz ? ["Bozor va raqobat tahlili", "Maqsadli auditoriya xaritasi", "Brend platformasi", "Pozitsiyalash strategiyasi", "Noyob Sotuv Taklifi (USP)"] : ["Market analysis", "Audience map", "Brand platform", "Positioning", "USP"],
            benefits: isUz ? [
                { icon: "📊", title: "Bozorda aniq o'rin", description: "Raqobatchilaringizdan qanday ajralib turishni aniq bilasiz." },
                { icon: "🚀", title: "Sotuvlar o'sishi", description: "To'g'ri pozitsiyalash mijozlar sonini oshiradi." }
            ] : [
                { icon: "📊", title: "Market Position", description: "Stand out." },
                { icon: "🚀", title: "Sales Growth", description: "Increase conversion." }
            ]
        },
        commStrategy: {
            label: isUz ? "Kommunikatsion strategiya" : (isRu ? "Конмуникационная стратегия" : "Communication Strategy"),
            description: isUz ? "Mijozlar bilan muloqot va reklama tili." : "Communication and advertising language for customers.",
            price: basePricesUSD.commStrategy,
            timeline: isUz ? "⏱ 15-20 ish kuni" : "⏱ 15-20 business days",
            features: isUz ? ["Brend ovozi (Tone of Voice)", "Asosiy xabarlar tizimi", "Media kanallar tanlovi", "Kontent rejasi tamoyillari"] : ["Tone of Voice", "Messaging", "Media channels", "Content plan"],
            benefits: isUz ? [
                { icon: "📢", title: "Mijoz bilan til topishish", description: "Auditoriya bilan qaysi tilda gaplashishni belgilaysiz." },
                { icon: "🔗", title: "Yaxlit muloqot", description: "Barcha kanallarda brendingiz bir xil va kuchli yangraydi." }
            ] : [
                { icon: "📢", title: "Connection", description: "Define language." },
                { icon: "🔗", title: "Unified Voice", description: "Sound consistent." }
            ]
        },
        namingVIP: {
            label: "Naming VIP",
            description: isUz ? "Nom emas — aktiv" : "Not just a name — an asset",
            subDescription: isUz ? "Nom emas — aktiv" : "Not just a name — an asset",
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
                "Nomning hissiy ma'nosi — mijoz ko'nglidagi taassurot",
                "3 ta qisqa shior varianti (masalan: Nike — 'Just Do It')",
                "Patentga topshirish xizmati (davlat bojlari alohida)",
                "Nom sizning mulkingiz ekanligini tasdiqlovchi sertifikat",
                "30 daqiqalik shaxsiy konsultatsiya",
                "Cheksiz tuzatish (30 kun ichida)"
            ] : ["10 concepts", "Strategy", "Phonetics", "Domain check", "Social check", "Patent check", "Competitor analysis", "Linguistics", "Emotional impact", "3 slogans", "Patent filing", "Certificate", "Consultation", "Unlimited revisions"],
            benefits: isUz ? [
                { icon: "🌍", title: "Xalqaro bozorga tayyor", description: "Nomingiz boshqa tillarda ham tekshiriladi — dunyo bo'ylab ishlaydi." },
                { icon: "🔒", title: "To'liq sizning mulkingiz", description: "Patent va sertifikat bilan nomingiz rasman himoyalanadi." },
                { icon: "💎", title: "Biznesingizga qiymat qo'shiladi", description: "Himoyalangan kuchli nom — kompaniya qiymatining bir qismi." },
                { icon: "🎯", title: "To'g'ri qaror qabul qilasiz", description: "30 daqiqa shaxsiy suhbatda to'g'ri yo'lni birgalikda belgilaymiz." }
            ] : [
                { icon: "🌍", title: "Global Ready", description: "Check in 6 languages." },
                { icon: "🔒", title: "Full Ownership", description: "Protected by patent." },
                { icon: "💎", title: "Business Value", description: "Asset for valuation." },
                { icon: "🎯", title: "Expert Decision", description: "Strategy session." }
            ]
        },
        namingPremium: {
            label: "Naming Premium",
            description: isUz ? "To'g'ri nom, to'g'ri asos" : "Right name, right foundation",
            subDescription: isUz ? "To'g'ri nom, to'g'ri asos" : "Right name, right foundation",
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
                "Raqobatchilar nomlari tahlili",
                "Nomning hissiy ma'nosi va mijozga ta'siri",
                "3 ta tuzatish imkoniyati"
            ] : ["6 concepts", "Strategy", "Phonetics", "Domain/Social check", "Local patent check", "Competitor analysis", "Emotional impact", "3 revisions"],
            benefits: isUz ? [
                { icon: "⚖️", title: "Huquqiy xavfsizlik", description: "Kimdir nomingizni oldin patent qilmaganligini tekshiramiz." },
                { icon: "🏆", title: "Raqobatdan ajralib turasiz", description: "Bozordagi o'xshash nomlarni tahlil qilib, unikal nom find qilamiz." },
                { icon: "❤️", title: "Mijozlar yaxshi ko'radi", description: "Nomga his-tuyg'u yuklanadi — mijozlar eslab qoladi." },
                { icon: "📈", title: "Brendingiz kuchli boshlanadi", description: "Kuchli nom marketing xarajatlarini sezilarli kamaytiradi." }
            ] : [
                { icon: "⚖️", title: "Legal Safety", description: "Avoid conflicts." },
                { icon: "🏆", title: "Stand Out", description: "Unique name." },
                { icon: "❤️", title: "Customer Love", description: "Memorable impact." },
                { icon: "📈", title: "Strong Start", description: "Lower marketing cost." }
            ]
        },
        namingStandard: {
            label: "Naming Standart",
            description: isUz ? "Tez va ishonchli start" : "Fast and reliable start",
            subDescription: isUz ? "Tez va ishonchli start" : "Fast and reliable start",
            price: basePricesUSD.namingStandard,
            timeline: isUz ? "⏱ 7–10 ish kuni" : "⏱ 7–10 business days",
            features: isUz ? [
                "3 ta nom varianti tayyorlanadi",
                "Har bir nom uchun qisqa izoh",
                "Nomning talaffuzi qulay va esda qolishi tekshiriladi",
                "Domen bo'shligini tekshirish (.com, .uz)",
                "Instagram va Telegram username bo'shligini tekshirish",
                "1 ta tuzatish imkoniyati"
            ] : ["3 concepts", "Brief info", "Recall test", "Domain/Social check", "1 revision"],
            benefits: isUz ? [
                { icon: "🛡️", title: "Xavfli nomdan qutulasiz", description: "Esda qolmaydigan yoki noto'g'ri talaffuz nom mijoz yo'qotadi." },
                { icon: "⚡", title: "Vaqt tejaysiz", description: "Yuzlab nom o'ylab o'tirmasdan, professional nom olasiz." },
                { icon: "✅", title: "Ishonch bilan boshlaysiz", description: "Tahlil qilingan, tekshirilgan nom qo'lingizda bo'ladi." },
                { icon: "📱", title: "Digital tayyor bo'lasiz", description: "Domen va social media username band emasligini bilasiz." }
            ] : [
                { icon: "🛡️", title: "Risk Free", description: "Avoid bad names." },
                { icon: "⚡", title: "Save Time", description: "Fast results." },
                { icon: "✅", title: "Trust", description: "Verified name." },
                { icon: "📱", title: "Digital Ready", description: "Socials ready." }
            ]
        },
        logoStandard: {
            label: isUz ? "Logo Standart" : "Standard Logo",
            description: isUz ? "Logom tayyor bo'lsin" : "Logo ready to go",
            subDescription: isUz ? "Endigina boshlamoqchi bo'lganlar uchun" : "For those just starting out",
            price: basePricesUSD.logoStandard,
            timeline: isUz ? "⏱ 5 ish kuni" : "⏱ 5 business days",
            features: isUz ? [
                "3 ta logo varianti tayyorlanadi — uchtalasidan birini tanlaysiz",
                "Har bir variant uchun izoh beriladi",
                "Logo 4 xil ko'rinishda (Gorizontal, Vertikal, Oq-qora, Belgi)",
                "Instagram va Telegram uchun profil rasmi",
                "3 xil fayl formatida (PNG, SVG, AI)",
                "8 ta aloqa nuqtasi (vizitka, profil, sayt, qadoq, peshlavha, forma, banner, email imzo)",
                "2 ta tuzatish imkoniyati"
            ] : ["3 concepts", "Reasoning", "4 lockups", "Social pics", "3 formats", "8 touchpoints", "2 revisions"],
            benefits: isUz ? [
                { icon: "🎯", title: "Hamma joyga tayyor", description: "Sayt, Instagram, chop etish — logongiz barcha formatda tayyor." },
                { icon: "✅", title: "Ishonch uyg'otadi", description: "Professional ko'rinish — mijozlar birinchi qarashda ishonch his qiladi." },
                { icon: "👁️", title: "Real ko'rinish", description: "8 ta joyda logongiz qanday ko'rinishini ko'rasiz." },
                { icon: "🛡️", title: "Fayllar to'liq sizniki", description: "Barcha fayllar sizga topshiriladi." }
            ] : [
                { icon: "🎯", title: "Ready everywhere", description: "Print & Web." },
                { icon: "✅", title: "Professional", description: "Instant trust." },
                { icon: "👁️", title: "Visualization", description: "8 locations." },
                { icon: "🛡️", title: "Full Ownership", description: "Source files." }
            ]
        },
        logoPremium: {
            label: isUz ? "Logo + Firma Uslubi" : "Logo + Visual Identity",
            description: isUz ? "Brendingizga mos firma uslubini (Vizual aydentika) ishlab chiqish kiradi." : "Development of visual identity consistent with your brand",
            subDescription: isUz ? "O'sishni rejalashtiraganlar uchun" : "For those planning growth",
            price: basePricesUSD.logoPremium,
            recommended: true,
            timeline: isUz ? "⏱ 10 ish kuni" : "⏱ 10 business days",
            features: isUz ? [
                "4 ta logo varianti tayyorlanadi — to'rttasidan birini tanlaysiz",
                "Har bir variant uchun izoh beriladi",
                "Logo 4 xil ko'rinishda + Profil rasmlari",
                "3 xil fayl formatida (PNG, SVG, AI)",
                "Rasmiy ranglar to'plami (aniq kodlari bilan)",
                "Rasmiy shrift — brendingizning yagona uslubi",
                "15 ta aloqa nuqtasi (SMM postlar, storislar, prezentatsiya, konvert, sumka, avto-brendlash va h.k.)",
                "3 ta tuzatish imkoniyati"
            ] : ["4 concepts", "Reasoning", "4 lockups", "3 formats", "Color palette", "Official fonts", "15 touchpoints", "3 revisions"],
            benefits: isUz ? [
                { icon: "🏆", title: "Professional qiyofa", description: "Sayt, Instagram, vizitka — hammasi bir xil professional uslubda." },
                { icon: "💼", title: "Xodimlaringiz ham to'g'ri ishlatadi", description: "Aniq qoidalar bo'lgach, hech kim rang va shriftda adashmaydi." },
                { icon: "📸", title: "15 ta joyda vizual kafolat", description: "Har bir muhim joyda brendingiz qanday ko'rinishi aniq bo'ladi." },
                { icon: "📈", title: "Brend qiymati oshadi", description: "Izchil ko'rinish — professional biznes belgisi." }
            ] : [
                { icon: "🏆", title: "Consistent", description: "Uniform style." },
                { icon: "💼", title: "Team Ready", description: "Clear rules." },
                { icon: "📸", title: "Verified", description: "15 touchpoints." },
                { icon: "📈", title: "Valuation", description: "Business asset." }
            ]
        },
        logoVIP: {
            label: isUz ? "Logo + Stil + Brandbook" : "Logo + Style + Brandbook",
            description: isUz ? "Hamma narsani bir marta to'g'ri qiling" : "Do everything right once",
            subDescription: isUz ? "Jiddiy investitsiya qiladiganlar uchun" : "For serious investors",
            price: basePricesUSD.logoVIP,
            timeline: isUz ? "⏱ 15–20 ish kuni" : "⏱ 15–20 business days",
            features: isUz ? [
                "5 ta logo varianti — beshtasidan birini tanlaysiz",
                "Har bir variant uchun chuqur strategik izoh",
                "Logo 4 xil ko'rinishda + Profil rasmlari",
                "3 xil fayl formatida (PNG, SVG, AI)",
                "Rasmiy ranglar to'plami — 3–5 ta rasmiy rangi va kodi",
                "Rasmiy shrift — brendingizning maxsus shriftlari",
                "Brandbook — brenddan foydalanish bo'yicha to'liq qo'llanma",
                "Logotip animatsiyasi (Motion design)",
                "Telegram stikerlar to'plami (10 ta)",
                "25 ta aloqa nuqtasi (mobil ilova, billbord, merch, ofis dizayni, ko'rgazma stendi, motion-reklama va h.k.)",
                "Logoning to'liq mulkchilik huquqi sertifikati",
                "Cheksiz tuzatish (30 kun ichida)"
            ] : ["5 concepts", "Deep strategy", "4 lockups", "3 formats", "Color palette", "Official fonts", "Full Brandbook", "Logo animation", "10 stickers", "25 touchpoints", "Ownership cert", "Unlimited revisions"],
            benefits: isUz ? [
                { icon: "📖", title: "Istalgan odamga topshiring", description: "Dizayner yoki SMMchi qo'llanmani o'qib brendni to'g'ri ishlatadi." },
                { icon: "🔒", title: "Abadiy sifat", description: "Hamma qoidalar yozilgan — brendingiz 10 yildan keyin ham kuchli qoladi." },
                { icon: "🌍", title: "Xalqaro standart", description: "Investor yoki xorijiy hamkor ko'rsa — jiddiy kompaniya ekanini his qiladi." },
                { icon: "💎", title: "Oqilona sarmoya", description: "Har yili rebranding o'rniga — bir marta to'g'ri qilingan investitsiya." }
            ] : [
                { icon: "📖", title: "Transferable", description: "Easy handover." },
                { icon: "🔒", title: "Lasting", description: "10+ years value." },
                { icon: "🌍", title: "Global", description: "Standard quality." },
                { icon: "💎", title: "Smart Asset", description: "One-time investment." }
            ]
        },
        packaging: { 
            label: isUz ? "Qadoq dizayni" : "Packaging Design", 
            description: isUz ? "Mahsulotingizning javondagi asosiy quroli." : "Your product's main weapon on the shelf.",
            price: basePricesUSD.packaging, 
            timeline: isUz ? "⏱ 10-15 ish kuni" : "⏱ 10-15 business days",
            features: isUz ? ["Vizual konsepsiya", "Qadoqni 3D namoyish qilish", "Chop etishga tayyor fayllar", "Materiallar bo'yicha tavsiyalar"] : ["Visual concept", "3D Visualization", "Print files", "Material tips"],
            benefits: isUz ? [
                { icon: "🎁", title: "Jozibador qadoq", description: "Mijoz mahsulotingizni ushlab ko'rgisi va sotib olgisi keladi." },
                { icon: "🏢", title: "Bozorda farqlanish", description: "Raqobatchilardan vizual jihatdan keskin ajralib turasiz." }
            ] : [
                { icon: "🎁", title: "Attractive", description: "Sales magnet." },
                { icon: "🏢", title: "Stand Out", description: "Shelf differentiation." }
            ]
        },
        smm: { 
            label: isUz ? "Instagram uchun stil" : "Social Media Style", 
            description: isUz ? "Sahifangizni tartibli va brendga mos qilish." : "Make your page organized and brand-consistent.",
            price: basePricesUSD.smm, 
            timeline: isUz ? "⏱ 5-7 ish kuni" : "⏱ 5-7 business days",
            features: isUz ? ["Profil rasmi va bio dizayni", "9 ta post uchun shablon", "Storislar uchun dizayn tizimi", "Highlight ikonkalari"] : ["Bio/Profile design", "9 post templates", "Story system", "Highlight icons"],
            benefits: isUz ? [
                { icon: "📱", title: "Tartibli sahifa", description: "Instagram profilingiz professional va ishonchli ko'rinadi." },
                { icon: "✨", title: "Oson kontent", description: "Tayyor shablonlar bilan post tayyorlash 2 barobar tezlashadi." }
            ] : [
                { icon: "📱", title: "Organized", description: "Trust building." },
                { icon: "✨", title: "Easy", description: "Fast content creation." }
            ]
        },
        urgency: { 
            label: isUz ? "Shoshilinch loyiha" : "Urgent Project", 
            description: isUz ? "Loyihangizni navbatsiz va tezkor tayyorlab berish." : "Expedited delivery ahead of queue.",
            price: 0,
            timeline: isUz ? "⏱ 2-3 barobar tezroq" : "⏱ 2-3x faster",
            features: isUz ? ["Ishchi guruhni safarbar qilish", "Dam olish kunlarisiz ishlash", "Muddati 2-3 barobarga qisqaradi", "Loyiha birinchi darajali ustuvorlikda bo'ladi"] : ["Mobilization", "24/7 work", "Fast delivery", "Top priority"],
            benefits: isUz ? [
                { icon: "🚀", title: "Vaqtdan yutasiz", description: "Bozorga raqobatchilardan tezroq kirib borasiz." },
                { icon: "🔥", title: "Prioritet", description: "Sizning loyihangiz biz uchun birinchi darajali." }
            ] : [
                { icon: "🚀", title: "Save Time", description: "Speed to market." },
                { icon: "🔥", title: "Priority", description: "Number 1 focus." }
            ]
        },
        nda: { 
            label: isUz ? "NDA — Maxfiylik" : "NDA — Confidentiality", 
            description: isUz ? "Loyihangiz ma'lumotlari sir saqlanishini kafolatlash." : "Guaranteed confidentiality.",
            price: 0,
            timeline: isUz ? "⏱ Darhol kuchga kiradi" : "⏱ Immediate",
            features: isUz ? ["Yuridik shartnoma (NDA)", "Ma'lumotlar uchinchi shaxsga berilmaydi", "Portfolioga qo'yilmaydi", "Barcha qidiruv bazalaridan maxfiylik"] : ["Legal agreement", "No sharing", "No portfolio", "Private"],
            benefits: isUz ? [
                { icon: "🔒", title: "Maxfiylik", description: "Biznes sirlaringiz biz bilan xavfsiz." },
                { icon: "🛡️", title: "Xavfsizlik", description: "Ma'lumotlar to'liq himoyalangan." }
            ] : [
                { icon: "🔒", title: "Privacy", description: "Business secrets safe." },
                { icon: "🛡️", title: "Security", description: "Full protection." }
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
        surchargesApplied.push({ name: isUz ? 'Shoshilinch loyiha (+50%)' : 'Urgent (+50%)', value: val });
    }
    if (selectedServices.nda) {
        const val = basePrice * 0.5;
        surchargesTotal += val;
        surchargesApplied.push({ name: isUz ? 'NDA (Maxfiylik) (+50%)' : 'NDA (+50%)', value: val });
    }

    const totalBeforeDiscounts = basePrice + surchargesTotal;
    let finalPrice = totalBeforeDiscounts;
    const discountsApplied = [];

    const isPromoApplied = ['RAMAZON', 'PCG', 'KURSDOSH', 'TEZ NATIJA'].includes(promoCode?.toUpperCase());

    if (isPromoApplied) {
        const val = totalBeforeDiscounts * 0.50;
        discountsApplied.push({ name: lang === 'uz' ? 'Maxsus chegirma (-50%)' : 'Special (-50%)', value: val });
        finalPrice -= val;
    } else {
        if (discountType === 'package' && mainServicesCount >= 2) {
            const val = totalBeforeDiscounts * 0.20;
            discountsApplied.push({ name: lang === 'uz' ? 'Paketli chegirma (-20%)' : 'Package (-20%)', value: val });
            finalPrice -= val;
        } else if (discountType === 'full') {
            if (mainServicesCount >= 2) {
                const packageVal = totalBeforeDiscounts * 0.20;
                discountsApplied.push({ name: lang === 'uz' ? 'Paketli chegirma (-20%)' : 'Package (-20%)', value: packageVal });
                finalPrice -= packageVal;
                const upfrontVal = finalPrice * 0.10;
                discountsApplied.push({ name: lang === 'uz' ? "Oldindan to'lov (-10%)" : "Upfront (-10%)", value: upfrontVal });
                finalPrice -= upfrontVal;
            } else {
                const upfrontVal = totalBeforeDiscounts * 0.10;
                discountsApplied.push({ name: lang === 'uz' ? "Oldindan to'lov (-10%)" : "Upfront (-10%)", value: upfrontVal });
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

    return [
        { 
            feature: isUz ? "Naming Premium" : (isRu ? "Нейминг Премиум" : "Naming Premium"), 
            competitors: { jon: "$980", mano: "$3,150", abba: "$3,000", mountain: "$2,750" } 
        },
        { 
            feature: isUz ? "Logo va firma uslubi" : (isRu ? "Логотип и фирменный стиль" : "Logo & Visual Identity"), 
            competitors: { jon: "$1,550", mano: "$6,450", abba: "$6,150", mountain: "$5,600" } 
        },
        { 
            feature: isUz ? "Qadoq dizayni" : (isRu ? "Дизайн упаковки" : "Packaging Design"), 
            competitors: { jon: "$1,150", mano: "$9,450", abba: "$6,300", mountain: "$4,700" } 
        },
        { 
            feature: isUz ? "Brend-strategiya va platforma" : (isRu ? "Бренд-стратегия и платформа" : "Brand Strategy & Platform"), 
            competitors: { jon: "$4,750", mano: "$18,900", abba: null, mountain: false } 
        },
        { 
            feature: isUz ? "Kommunikatsion strategiya" : (isRu ? "Коммуникационная стратегия" : "Communication Strategy"), 
            competitors: { jon: "$3,950", mano: "$15,000", abba: null, mountain: false } 
        },
        { 
            feature: isUz ? "Ijtimoiy tarmoqlar uchun stil" : (isRu ? "Стиль для соцсетей" : "Social Media Style"), 
            competitors: { jon: "$980", mano: "$3,500", abba: null, mountain: null } 
        },
        { 
            feature: isUz ? "100% Mamnuniyat Kafolati" : (isRu ? "100% Гарантия удовлетворенности" : "100% Satisfaction Guarantee"), 
            competitors: { jon: true, mano: false, abba: false, mountain: false } 
        },
        { 
            feature: isUz ? "Shaffof jarayon va doimiy aloqa" : (isRu ? "Прозрачный процесс и связь" : "Transparent Process & Communication"), 
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
    if (selections.promoCode) summary += ` (Promokod: ${selections.promoCode})`;
    if (selections.discountType === 'full') summary += ` (100% Oldindan to'lov)`;
    
    return summary;
};
