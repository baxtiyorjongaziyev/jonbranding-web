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
            features: isUz ? ["Logoning texnik tahlili", "Bozorga moslik tekshiruvi", "Kamchiliklar ro'yxati", "Yaxshilash bo'yicha tavsiyalar"] : ["Technical analysis", "Market fit check", "List of weaknesses", "Improvement tips"]
        },
        namingCheck: {
            label: isUz ? "Neyming Tekshiruvi" : (isRu ? "Проверка нейминга" : "Naming Check"),
            description: isUz ? "Brend nomini huquqiy va raqamli bazalarda tekshirish." : "Checking brand name availability in legal and digital databases.",
            price: basePricesUSD.namingCheck,
            timeline: isUz ? "⏱ 1-2 ish kuni" : "⏱ 1-2 business days",
            features: isUz ? [
                "O'zbekistondan tekshiruv",
                "2. Xalqaro bazadan tekshiruv",
                "Internetda ma'lum mashhur nomlar tekshiruvi"
            ] : [
                "Local database check",
                "2. International database check",
                "Global popular names check"
            ]
        },
        consultation: {
            label: isUz ? "Konsultatsiya" : (isRu ? "Консультация" : "Consultation"),
            description: isUz ? "Brending va biznesni upakovka qilish bo'yicha professional maslahat." : "Professional advice on branding and business packaging.",
            price: basePricesUSD.consultation,
            timeline: isUz ? "⏱ 60 daqiqa" : "⏱ 60 minutes",
            features: isUz ? ["Muammolarni tahlil qilish", "Brending strategiyasi", "Savollarga javoblar", "Yo'l xaritasi tuzish"] : ["Problem analysis", "Branding strategy", "Q&A session", "Roadmap creation"]
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
            ] : ["Market & Competitor analysis", "Target audience map", "Brand platform", "Positioning strategy", "USP development"]
        },
        commStrategy: {
            label: isUz ? "Kommunikatsion strategiya" : (isRu ? "Коммуникационная стратегия" : "Communication Strategy"),
            description: isUz ? "Mijozlar bilan muloqot va reklama tili." : "Communication and advertising language for customers.",
            price: basePricesUSD.commStrategy,
            timeline: isUz ? "⏱ 15-20 ish kuni" : "⏱ 15-20 business days",
            features: isUz ? ["Brend ovozi (Tone of Voice)", "Asosiy xabarlar tizimi", "Media kanallar tanlovi", "Kontent rejasi tamoyillari"] : ["Tone of Voice", "Key messaging system", "Media channel selection", "Content plan principles"]
        },
        namingVIP: {
            label: "Naming VIP",
            description: "",
            subDescription: isUz ? "Nom emas — aktiv | Jiddiy investitsiya qiladiganlar uchun" : "Not just a name — an asset | For serious investors",
            price: basePricesUSD.namingVIP,
            timeline: isUz ? "⏱ 20–25 ish kuni" : "⏱ 20–25 business days",
            features: isUz ? [
                "10 ta nom varianti tayyorlanadi",
                "Har bir nom uchun strategik izoh",
                "Talaffuz, esda qolish va jaranglash testi",
                "Domen bo'shligini tekshirish (.com, .uz)",
                "Social username bo'shligini tekshirish",
                "O'zbekiston va xalqaro patent tekshiruvi",
                "Raqobatchilar tahlili va farqli pozitsiya",
                "Xalqaro lingvistik tekshiruv",
                "Nomning mijozga hissiy ta'siri tahlili",
                "3 ta qisqa shior (slogan) varianti",
                "Patentga topshirish xizmati (davlat bojlari alohida)",
                "Nom mulkingizni tasdiqlovchi sertifikat",
                "30 daqiqalik shaxsiy konsultatsiya",
                "Cheksiz tuzatish (30 kun ichida)"
            ] : [
                "10 name concepts",
                "Strategic reasoning for each",
                "Phonetics, recall & ring testing",
                "Domain check (.com, .uz)",
                "Social handles availability",
                "Local & International patent check",
                "Competitor analysis & positioning",
                "International linguistic check",
                "Emotional impact analysis",
                "3 slogan variants",
                "Official patent filing (fees excluded)",
                "Ownership certificate",
                "30-min strategy consultation",
                "Unlimited revisions (30 days)"
            ],
            benefits: isUz ? [
                { icon: "🌍", title: "Xalqaro bozorga tayyor bo'lasiz", description: "Nomingiz boshqa tillarda tekshiriladi — dunyo bo'ylab ishlaydi, hech qayerda noqulay ma'no bermaydi." },
                { icon: "🔒", title: "Nomingiz to'liq sizniki bo'ladi", description: "Patent va sertifikat bilan nomingiz rasman himoyalanadi. Hech kim o'g'irlay olmaydi." },
                { icon: "💎", title: "Biznesingizga qiymat qo'shiladi", description: "Himoyalangan kuchli nom — kompaniya qiymatining bir qismi. Investorlar uchun jiddiy signal." },
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
            description: "",
            subDescription: isUz ? "To'g'ri nom, to'g'ri asos | O'sishni rejalashtiraganlar uchun" : "Right name, right foundation | For those planning growth",
            price: basePricesUSD.namingPremium,
            recommended: true,
            timeline: isUz ? "⏱ 14–20 ish kuni" : "⏱ 14–20 business days",
            features: isUz ? [
                "6 ta nom varianti tayyorlanadi",
                "Har bir nom uchun strategik izoh",
                "Talaffuz, esda qolish va jaranglash testi",
                "Domen bo'shligini tekshirish (.com, .uz)",
                "Social username bo'shligini tekshirish",
                "O'zbekiston bazasida patent tekshiruvi",
                "Raqobatchilar nomlari tahlili",
                "Nomning mijozga hissiy ta'siri tahlili",
                "3 ta tuzatish imkoniyati"
            ] : [
                "6 name concepts",
                "Strategic reasoning for each",
                "Phonetics, recall & ring testing",
                "Domain check (.com, .uz)",
                "Social handles availability",
                "Local patent check",
                "Competitor analysis",
                "Emotional impact analysis",
                "3 revision rounds"
            ],
            benefits: isUz ? [
                { icon: "⚖️", title: "Huquqiy xavfsizlik", description: "Kimdir sizning nomingizni oldin patent qilmaganligini tekshiramiz. Kelajakda qimmat muammolardan qutulasiz." },
                { icon: "🏆", title: "Raqobatdan ajralib turasiz", description: "Bozordagi o'xshash nomlarni tahlil qilib, hech kimga o'xshamagan nom topamiz. Mijozlar sizni eslab qoladi." },
                { icon: "❤️", title: "Mijozlar nomingizni yaxshi ko'radi", description: "Nomga his-tuyg'u yuklanadi — mijozlar eslab qoladi va do'stlariga aytib beradi." },
                { icon: "📈", title: "Brendingiz kuchli boshlanadi", description: "Kuchli nom marketing xarajatlarini kamaytiradi. Nom o'zi ishlaydi va brendingizni mustahkamlaydi." }
            ] : [
                { icon: "⚖️", title: "Legal Safety", description: "We ensure no one else has patented the name, saving you from future legal costs." },
                { icon: "🏆", title: "Stand Out", description: "We find a unique identity that customers will remember above competitors." },
                { icon: "❤️", title: "Emotional Connection", description: "We inject feelings into the name that build long-term customer loyalty." },
                { icon: "📈", title: "Strong Start", description: "A great name reduces marketing costs by working for you consistently." }
            ]
        },
        namingStandard: {
            label: "Naming Standart",
            description: "",
            subDescription: isUz ? "Tez va ishonchli start | Endigina boshlamoqchi bo'lganlar uchun" : "Fast and reliable start | For those just starting out",
            price: basePricesUSD.namingStandard,
            timeline: isUz ? "⏱ 7–10 ish kuni" : "⏱ 7–10 business days",
            features: isUz ? [
                "3 ta nom varianti tayyorlanadi",
                "Har bir nom uchun qisqa izoh",
                "Talaffuz qulayligi va esda qolish testi",
                "Domen bo'shligini tekshirish (.com, .uz)",
                "Social username bo'shligini tekshirish",
                "1 ta tuzatish imkoniyati"
            ] : [
                "3 name concepts",
                "Brief explanation for each",
                "Phonetics & recall testing",
                "Domain check (.com, .uz)",
                "Social handles availability",
                "1 revision round"
            ],
            benefits: isUz ? [
                { icon: "🛡️", title: "Xavfli nomdan qutulasiz", description: "Esda qolmaydigan yoki noto'g'ri talaffuz qilinadigan nom mijozlaringizni yo'qotadi. Biz buni oldini olamiz." },
                { icon: "⚡", title: "Vaqt tejaysiz", description: "Yuzlab nom o'ylab o'tirish o'rniga, 7–10 kunda professional tahlil qilingan nom olasiz." },
                { icon: "✅", title: "Ishonch bilan boshlaysiz", description: "\"To'g'ri nom topdimmi?\" degan shubha yo'qoladi. Tahlil qilingan, tekshirilgan nom qo'lingizda bo'ladi." },
                { icon: "📱", title: "Digital tayyor bo'lasiz", description: "Domen va username band emasligini bilib olasiz — keyinchalik muammo bo'lmaydi." }
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
                "3 ta logo varianti tayyorlanadi — bittasini tanlaysiz",
                "Har bir variant uchun izoh beriladi",
                "Logo 4 xil ko'rinishda: Yotiq, Tik, Qora-oq va belgisi alohida",
                "Ijtimoiy tarmoqlar uchun profil rasmi",
                "3 xil fayl formati (PNG, SVG, AI)",
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
                { icon: "🎯", title: "Hujjatlarda ham, tarmoqlarda ham ishlaydi", description: "Logongiz hamma joyga — sayt, Instagram va chop etishga tayyor." },
                { icon: "✅", title: "Professional ko'rinish", description: "O'zingiz yasaganga o'xshamaydigan professional ko'rinish." },
                { icon: "👁️", title: "Real hayotda qanday ko'rinishini bilasiz", description: "8 ta muhim nuqtada logongiz qanday ko'rinishini vizual ko'rasiz." },
                { icon: "🛡️", title: "Fayllar to'liq sizniki", description: "Barcha manba fayllar topshiriladi, keyinchalik foydalanishga qulay." }
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
            description: isUz ? "To'liq vizual tizim va qoidalar." : "Complete visual system and rules.",
            price: basePricesUSD.logoPremium,
            recommended: true,
            timeline: isUz ? "⏱ 14–20 ish kuni" : "⏱ 14–20 business days",
            features: isUz ? [
                "3 ta logo varianti tayyorlanadi — bittasini tanlaysiz",
                "Har bir variant uchun izoh beriladi",
                "Logo 4 xil ko'rinishda: Yotiq, Tik, Qora-oq va belgisi alohida",
                "Ijtimoiy tarmoqlar uchun profil rasmi",
                "3 xil fayl formati (PNG, SVG, AI)",
                "Rasmiy ranglar to'plami va aniq kodlari",
                "Rasmiy brend shrifti va qo'llash qoidalari",
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
                { icon: "🏆", title: "Har joyda bir xil, professional ko'rinasiz", description: "Saytingiz, Instagramingiz, vizitchangiz — hammasi bir uslubda." },
                { icon: "💼", title: "Xodimlaringiz ham to'g'ri ishlatadi", description: "Aniq qoidalar bo'lgach, hech kim adashmaydi." },
                { icon: "📸", title: "Mijozlarga ko'rsatishga tayyor", description: "15 ta nuqtada brendingizni vizual ko'rasiz." },
                { icon: "📈", title: "Brend qiymati oshadi", description: "Izchil ko'rinish — professional biznes belgisidir." }
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
                "3 ta logo varianti + har biri uchun chuqur strategik izoh",
                "Logo 4 xil ko'rinishda: Yotiq, Tik, Qora-oq va belgisi alohida",
                "Ijtimoiy tarmoqlar uchun profil rasmi",
                "3 xil fayl formati (PNG, SVG, AI)",
                "Rasmiy ranglar va shriftlar tizimi",
                "To'liq Brandbook (30-50 sahifa)",
                "25 ta aloqa nuqtasida professional vizual",
                "Cheksiz tuzatish (30 kun ichida)",
                "Logoning to'liq mulkchilik huquqi sertifikati"
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
                { icon: "📖", title: "Istalgan odamga berib, to'g'ri natija olasiz", description: "Qo'llanma bilan har qanday dizayner to'g'ri ishlaydi." },
                { icon: "🔒", title: "Brend yillar o'tsa ham buzilmaydi", description: "Brendingiz 10 yildan keyin ham bir xil kuchli ko'rinadi." },
                { icon: "🌍", title: "Xalqaro darajada tayyor ko'rinasiz", description: "Investorlar jiddiy kompaniya ekaningizni bilishadi." },
                { icon: "💎", title: "Bu bir marta qilinadigan investitsiya", description: "To'g'ri qilingan brend kamida 10 yil xizmat qiladi." }
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
            features: isUz ? ["Vizual konsepsiya", "Qadoqni 3D namoyish qilish", "Chop etishga tayyor fayllar", "Materiallar bo'yicha tavsiyalar"] : ["Visual concept", "3D presentation", "Print-ready files", "Material recommendations"]
        },
        smm: { 
            label: isUz ? "Instagram uchun stil" : "Social Media Style", 
            description: isUz ? "Sahifangizni tartibli va brendga mos qilish." : "Make your page organized and brand-consistent.",
            price: basePricesUSD.smm, 
            timeline: isUz ? "⏱ 5-7 ish kuni" : "⏱ 5-7 business days",
            features: isUz ? ["Profil rasmi va bio dizayni", "9 ta post uchun shablon", "Storislar uchun dizayn tizimi", "Highlight ikonkalari"] : ["Bio & profile design", "9 post templates", "Stories design system", "Highlight icons"]
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