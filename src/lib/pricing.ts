
const USD_TO_UZS_RATE = 12700;

const convertToUzs = (usd: number) => {
    if (usd === 0) return 0;
    // Round to nearest 100,000 UZS for cleaner pricing
    return Math.round(usd * USD_TO_UZS_RATE / 100000) * 100000;
}

const uzServiceDetails = {
    audit: { label: "Logo Auditi", description: "Mavjud logotipni tahlil qilish va yaxshilash bo'yicha tavsiyalar.", price: convertToUzs(100), timeline: "2-3 kun", note: null, features: [] },
    namingCheck: { label: "Neyming Tekshiruvi", description: "Brend nomining O'zbekiston va xalqaro bazalarda bo'shligini tekshirish.", price: convertToUzs(120), timeline: "1-2 kun", note: null, features: [] },
    consultation: { label: "1 soatlik konsultatsiya", description: "Brending bo'yicha har qanday savolingizga tezkor yo'l-yo'riq va professional maslahat.", price: convertToUzs(80), timeline: "1 soat", note: null, features: [] },
    strategy: { label: "Brend-strategiya va platforma", description: "Bozor tahlili, brend auditi, pozitsiyalash va qadriyatlar taklifini ishlab chiqish.", price: convertToUzs(4700), timeline: "8 haftadan", note: null, features: [] },
    commStrategy: { label: "Kommunikatsion strategiya", description: "Mijozlar bilan muloqot strategiyasi: ohang, asosiy xabarlar, kanallar.", price: convertToUzs(3900), timeline: "8 haftadan", note: null, features: [] },
    namingStart: { label: "Neyming Start", description: "Kichik biznes uchun ideal.", price: 8200000, timeline: "1-2 hafta", note: null, features: ["5-7 ta nom varianti", "Asosiy tekshiruv", "Domen tekshiruvi"] },
    namingPro: { label: "Neyming Pro", description: "O'rta va rivojlanayotgan biznes uchun.", price: convertToUzs(1000), timeline: "2-3 hafta", note: null, features: ["10-15 ta nom varianti", "Chuqurroq tahlil", "Domen va ijtimoiy tarmoqlar tekshiruvi", "Slogan (shior) konsepsiyasi"], recommended: true },
    namingMax: { label: "Neyming Max", description: "Katta va xalqaro bozorga mo'ljallangan loyihalar uchun.", price: convertToUzs(1600), timeline: "3-4 hafta", note: null, features: ["20+ nom varianti", "To'liq strategik neyming", "Xalqaro bazalarda tekshiruv", "Slogan (shior) ishlab chiqish", "Falsafiy ma'no"] },
    logoStart: { label: "Logotip Start", description: "Startaplar uchun tezkor yechim.", price: 9900000, timeline: "1-2 hafta", note: null, features: ["1 ta konsepsiya", "Asosiy ranglar va shriftlar", "2 ta o'zgartirish", "Vektor formatlar (SVG, AI)"] },
    logoPro: { label: "Logotip Pro", description: "O'z brendini jiddiy rivojlantirish niyatidagilar uchun.", price: convertToUzs(2000), timeline: "2-4 hafta", note: null, features: ["2 ta konsepsiya", "To'liq firma uslubi (rang, shrift)", "5 ta nositelda namoyish", "Brend-falsafasi", "Brendbuk Light versiya"], recommended: true },
    logoMax: { label: "To'liq dizayn-tizim", description: "<strong>Logotipni o'z ichiga oladi.</strong> Yirik brendlar uchun.", price: convertToUzs(3000), timeline: "4-6 hafta", note: null, features: ["3+ konsepsiya", "Kengaytirilgan firma uslubi", "Ikonikalar va piktogrammalar", "Brend patternlari", "To'liq Brendbuk"] },
    brandbook: { label: "Brendbuk va gaydlayn", description: "Firma uslubidan foydalanish bo'yicha qoidalar hujjati.", price: convertToUzs(1000), timeline: "1 haftadan", note: null, features: [] },
    packaging: { label: "Qadoq dizayni", description: "3 SKU uchun qadoq ishlab chiqish, chop etishga tayyorlash. Qadoq formasi alohida ishlab chiqiladi.", price: convertToUzs(1000), timeline: "4-6 hafta", note: null, features: [] },
    smm: { label: "Ijtimoiy tarmoqlar uchun stil", description: "Postlar va storislarni firma uslubida bezash.", price: convertToUzs(1000), timeline: "2 haftadan", note: null, features: [] },
    merch: { label: "Brendli merch va nositellar", description: "Kiyim, aksessuarlar, POSM materiallari dizayni.", price: 0, timeline: "2 haftadan", note: "Individual", features: [] },
    illustrations: { label: "Illustratsiyalar va animatsiya", description: "Firma grafikasi, infografika va animatsiyalar yaratish.", price: 0, timeline: "3 haftadan", note: "Individual", features: [] },
    urgency: { label: "Shoshilinch loyiha (+50%)", description: "Loyiha navbatsiz, qisqa muddatda (2-3 kun) tayyorlanadi. Umumiy narxga 50% ustama qo'shiladi.", price: 0, timeline: "Individual", note: "+50%", features: [] },
    nda: { label: "Maxfiylik shartnomasi (NDA) (+25%)", description: "Loyiha ma'lumotlarini oshkor etmaslik shartnomasi. Umumiy narxga 25% ustama qo'shiladi.", price: 0, timeline: "Individual", note: "+25%", features: [] }
};

const ruServiceDetails = {
    audit: { label: "Аудит логотипа", description: "Анализ существующего логотипа и рекомендации по улучшению.", price: convertToUzs(100), timeline: "2-3 дня", note: null, features: [] },
    namingCheck: { label: "Проверка нейминга", description: "Проверка доступности имени бренда в базах данных Узбекистана и международных базах.", price: convertToUzs(120), timeline: "1-2 дня", note: null, features: [] },
    consultation: { label: "1-часовая консультация", description: "Быстрые рекомендации и профессиональные советы по любому вопросу брендинга.", price: convertToUzs(80), timeline: "1 час", note: null, features: [] },
    strategy: { label: "Бренд-стратегия и платформа", description: "Анализ рынка, аудит бренда, разработка позиционирования и ценностного предложения.", price: convertToUzs(4700), timeline: "от 8 недель", note: null, features: [] },
    commStrategy: { label: "Коммуникационная стратегия", description: "Стратегия общения с клиентами: тон, ключевые сообщения, каналы.", price: convertToUzs(3900), timeline: "от 8 недель", note: null, features: [] },
    namingStart: { label: "Нейминг Старт", description: "Идеально для малого бизнеса.", price: 8200000, timeline: "1-2 недели", note: null, features: ["5-7 вариантов имени", "Базовая проверка", "Проверка домена"] },
    namingPro: { label: "Нейминг Про", description: "Для среднего и развивающегося бизнеса.", price: convertToUzs(1000), timeline: "2-3 недели", note: null, features: ["10-15 вариантов имени", "Глубокий анализ", "Проверка доменов и соцсетей", "Концепция слогана"], recommended: true },
    namingMax: { label: "Нейминг Макс", description: "Для крупных и международных проектов.", price: convertToUzs(1600), timeline: "3-4 недели", note: null, features: ["20+ вариантов имени", "Полный стратегический нейминг", "Международная проверка", "Разработка слогана", "Философский смысл"] },
    logoStart: { label: "Логотип Старт", description: "Быстрое решение для стартапов.", price: 9900000, timeline: "1-2 недели", note: null, features: ["1 концепция", "Основные цвета и шрифты", "2 правки", "Векторные форматы (SVG, AI)"] },
    logoPro: { label: "Логотип Про", description: "Для тех, кто серьезно настроен развивать свой бренд.", price: convertToUzs(2000), timeline: "2-4 недели", note: null, features: ["2 концепции", "Полный фирменный стиль (цвет, шрифт)", "Демонстрация на 5 носителях", "Философия бренда", "Брендбук Light версия"], recommended: true },
    logoMax: { label: "Полная дизайн-система", description: "<strong>Включает логотип.</strong> Для крупных брендов.", price: convertToUzs(3000), timeline: "4-6 недель", note: null, features: ["3+ концепции", "Расширенный фирменный стиль", "Иконки и пиктограммы", "Фирменные паттерны", "Полный Брендбук"] },
    brandbook: { label: "Брендбук и гайдлайн", description: "Документ с правилами использования фирменного стиля.", price: convertToUzs(1000), timeline: "от 1 недели", note: null, features: [] },
    packaging: { label: "Дизайн упаковки", description: "Разработка упаковки для 3 SKU, подготовка к печати. Форма упаковки разрабатывается отдельно.", price: convertToUzs(1000), timeline: "4-6 недель", note: null, features: [] },
    smm: { label: "Стиль для социальных сетей", description: "Оформление постов и сторис в фирменном стиле.", price: convertToUzs(1000), timeline: "от 2 недель", note: null, features: [] },
    merch: { label: "Брендированный мерч и носители", description: "Дизайн одежды, аксессуаров, POSM-материалов.", price: 0, timeline: "от 2 недель", note: "Индивидуально", features: [] },
    illustrations: { label: "Иллюстрации и анимация", description: "Создание фирменной графики, инфографики и анимаций.", price: 0, timeline: "от 3 недель", note: "Индивидуально", features: [] },
    urgency: { label: "Срочный проект (+50%)", description: "Проект выполняется вне очереди, в короткие сроки (2-3 дня). К общей стоимости добавляется 50%.", price: 0, timeline: "Индивидуально", note: "+50%", features: [] },
    nda: { label: "Договор о неразглашении (NDA) (+25%)", description: "Договор о неразглашении информации о проекте. К общей стоимости добавляется 25%.", price: 0, timeline: "Индивидуально", note: "+25%", features: [] }
};

const enServiceDetails = {
    audit: { label: "Logo Audit", description: "Analysis of the existing logo and recommendations for improvement.", price: convertToUzs(100), timeline: "2-3 days", note: null, features: [] },
    namingCheck: { label: "Naming Check", description: "Checking the availability of the brand name in Uzbekistan and international databases.", price: convertToUzs(120), timeline: "1-2 days", note: null, features: [] },
    consultation: { label: "1-hour consultation", description: "Quick guidance and professional advice on any branding question.", price: convertToUzs(80), timeline: "1 hour", note: null, features: [] },
    strategy: { label: "Brand Strategy and Platform", description: "Market analysis, brand audit, positioning and value proposition development.", price: convertToUzs(4700), timeline: "from 8 weeks", note: null, features: [] },
    commStrategy: { label: "Communication Strategy", description: "Customer communication strategy: tone, key messages, channels.", price: convertToUzs(3900), timeline: "from 8 weeks", note: null, features: [] },
    namingStart: { label: "Naming Start", description: "Ideal for small businesses.", price: 8200000, timeline: "1-2 weeks", note: null, features: ["5-7 name options", "Basic check", "Domain check"] },
    namingPro: { label: "Naming Pro", description: "For medium and growing businesses.", price: convertToUzs(1000), timeline: "2-3 weeks", note: null, features: ["10-15 name options", "In-depth analysis", "Domain and social media check", "Slogan concept"], recommended: true },
    namingMax: { label: "Naming Max", description: "For large and international projects.", price: convertToUzs(1600), timeline: "3-4 weeks", note: null, features: ["20+ name options", "Full strategic naming", "International database check", "Slogan development", "Philosophical meaning"] },
    logoStart: { label: "Logo Start", description: "A quick solution for startups.", price: 9900000, timeline: "1-2 weeks", note: null, features: ["1 concept", "Basic colors and fonts", "2 revisions", "Vector formats (SVG, AI)"] },
    logoPro: { label: "Logo Pro", description: "For those serious about developing their brand.", price: convertToUzs(2000), timeline: "2-4 weeks", note: null, features: ["2 concepts", "Full corporate identity (color, font)", "5 mockups", "Brand philosophy", "Brandbook Light version"], recommended: true },
    logoMax: { label: "Full Design System", description: "<strong>Includes logo.</strong> For major brands.", price: convertToUzs(3000), timeline: "4-6 weeks", note: null, features: ["3+ concepts", "Expanded corporate identity", "Icons and pictograms", "Brand patterns", "Full Brandbook"] },
    brandbook: { label: "Brandbook and Guideline", description: "A document with rules for using the corporate identity.", price: convertToUzs(1000), timeline: "from 1 week", note: null, features: [] },
    packaging: { label: "Packaging Design", description: "Packaging development for 3 SKUs, preparation for printing. The packaging form is developed separately.", price: convertToUzs(1000), timeline: "4-6 weeks", note: null, features: [] },
    smm: { label: "Style for Social Networks", description: "Design of posts and stories in corporate style.", price: convertToUzs(1000), timeline: "from 2 weeks", note: null, features: [] },
    merch: { label: "Branded Merch and Carriers", description: "Design of clothing, accessories, POSM materials.", price: 0, timeline: "from 2 weeks", note: "Individual", features: [] },
    illustrations: { label: "Illustrations and Animation", description: "Creation of corporate graphics, infographics and animations.", price: 0, timeline: "from 3 weeks", note: "Individual", features: [] },
    urgency: { label: "Urgent Project (+50%)", description: "The project is carried out out of turn, in a short time (2-3 days). 50% is added to the total cost.", price: 0, timeline: "Individual", note: "+50%", features: [] },
    nda: { label: "Non-Disclosure Agreement (NDA) (+25%)", description: "Agreement on non-disclosure of project information. 25% is added to the total cost.", price: 0, timeline: "Individual", note: "+25%", features: [] }
};

export const getServiceDetails = (lang: 'uz' | 'ru' | 'en') => {
    switch (lang) {
        case 'ru': return ruServiceDetails;
        case 'en': return enServiceDetails;
        default: return uzServiceDetails;
    }
};

type ServiceDetailsType = typeof uzServiceDetails;

export function formatPrice(price: number, lang: 'uz' | 'ru' | 'en' = 'uz') {
    if (price === 0) {
        if (lang === 'ru') return 'По догов.';
        if (lang === 'en') return 'On Request';
        return "Kelishiladi";
    }

    const currency = lang === 'ru' ? 'сум' : (lang === 'en' ? 'sum' : "so'm");
    return `${price.toLocaleString('fr-FR')} ${currency}`;
}


export const comparisonData = (lang: 'uz' | 'ru' | 'en' = 'uz') => {
    const sd = getServiceDetails(lang);
    const satisfactionGuarantee = lang === 'ru' ? '100% Гарантия Удовлетворенности' : lang === 'en' ? '100% Satisfaction Guarantee' : '100% Mamnuniyat Kafolati';
    const transparentProcess = lang === 'ru' ? 'Прозрачный процесс и постоянная связь' : lang === 'en' ? 'Transparent process and constant communication' : 'Shaffof jarayon va doimiy aloqa';
    const pcgDiscount = lang === 'ru' ? 'Скидка -50% для членов PCG' : lang === 'en' ? '-50% discount for PCG members' : 'PCG a\'zolari uchun -50% chegirma';

    return [
      { 
        feature: sd.namingPro.label,
        competitors: { jon: `${formatPrice(sd.namingPro.price, lang)}`, mano: `${formatPrice(convertToUzs(3150), lang)}`, abba: `${formatPrice(convertToUzs(3000), lang)}`, mountain: `${formatPrice(convertToUzs(2750), lang)}` }
      },
      { 
        feature: sd.logoPro.label,
        competitors: { jon: `${formatPrice(sd.logoPro.price, lang)}`, mano: `${formatPrice(convertToUzs(6450), lang)}`, abba: `${formatPrice(convertToUzs(6150), lang)}`, mountain: `${formatPrice(convertToUzs(5600), lang)}` }
      },
      { 
        feature: sd.brandbook.label,
        competitors: { jon: `${formatPrice(sd.brandbook.price, lang)}`, mano: `${formatPrice(convertToUzs(3300), lang)}`, abba: `${formatPrice(convertToUzs(3150), lang)}`, mountain: `${formatPrice(convertToUzs(3900), lang)}` }
      },
      { 
        feature: sd.packaging.label,
        competitors: { jon: `${formatPrice(sd.packaging.price, lang)}`, mano: `${formatPrice(convertToUzs(9450), lang)}`, abba: `${formatPrice(convertToUzs(6300), lang)}`, mountain: `${formatPrice(convertToUzs(4700), lang)}` }
      },
      { 
        feature: sd.strategy.label,
        competitors: { jon: `${formatPrice(sd.strategy.price, lang)}`, mano: `${formatPrice(convertToUzs(18900), lang)}`, abba: null, mountain: false }
      },
      { 
        feature: sd.commStrategy.label,
        competitors: { jon: `${formatPrice(sd.commStrategy.price, lang)}`, mano: `${formatPrice(convertToUzs(15000), lang)}`, abba: null, mountain: false }
      },
      { 
        feature: sd.smm.label,
        competitors: { jon: `${formatPrice(sd.smm.price, lang)}`, mano: `${formatPrice(convertToUzs(3500), lang)}`, abba: null, mountain: null }
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

export const packageDiscountThreshold = 3;
export const packageDiscount = 0.20; // 20%
export const upfrontDiscount = 0.10; // 10%
export const urgencySurcharge = 0.50;
export const ndaSurcharge = 0.25;
export const bonusThreshold = convertToUzs(4000);


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


export const calculatePackagePrice = (selections: PackageSelections, lang: 'uz' | 'ru' | 'en' = 'uz'): PriceDetails => {
    const { selectedServices, wantsUpfrontPayment } = selections;
    const sd = getServiceDetails(lang);
    
    let basePrice = 0;
    let mainServicesCount = 0;
    
    const mainServices: (keyof SelectedServices)[] = ['namingPro', 'namingMax', 'logoPro', 'logoMax', 'brandbook', 'packaging', 'strategy'];
    const percentageServices: (keyof SelectedServices)[] = ['urgency', 'nda'];

    for (const serviceKey in selectedServices) {
        const key = serviceKey as keyof SelectedServices;
        if (
            sd[key] && 
            selectedServices[key] &&
            !percentageServices.includes(key)
        ) {
            basePrice += sd[key].price;
            if(mainServices.includes(key)) {
                mainServicesCount++;
            }
        }
    }

    let priceAfterSurcharges = basePrice;
    const surcharges: { name: string, value: number }[] = [];

    if (selectedServices.urgency) {
        const surchargeAmount = basePrice * urgencySurcharge;
        priceAfterSurcharges += surchargeAmount;
        let surchargeName;
        if (lang === 'ru') surchargeName = 'Надбавка за срочность (+50%)';
        else if (lang === 'en') surchargeName = 'Urgency Surcharge (+50%)';
        else surchargeName = 'Shoshilinch uchun ustama (+50%)';
        surcharges.push({ name: surchargeName, value: surchargeAmount });
    }

    if (selectedServices.nda) {
        const surchargeAmount = basePrice * ndaSurcharge;
        priceAfterSurcharges += surchargeAmount;
        let surchargeName;
        if (lang === 'ru') surchargeName = 'Надбавка за NDA (+25%)';
        else if (lang === 'en') surchargeName = 'NDA Surcharge (+25%)';
        else surchargeName = 'NDA uchun ustama (+25%)';
        surcharges.push({ name: surchargeName, value: surchargeAmount });
    }
    
    let priceAfterDiscount = priceAfterSurcharges;
    const discountsApplied: { name: string, value: number }[] = [];
    
    if (mainServicesCount >= packageDiscountThreshold) {
        const discountAmount = priceAfterSurcharges * packageDiscount;
        priceAfterDiscount -= discountAmount;
        let discountName;
        if (lang === 'ru') discountName = 'Пакетная скидка (-20%)';
        else if (lang === 'en') discountName = 'Package Discount (-20%)';
        else discountName = 'Paketli chegirma (-20%)';
        discountsApplied.push({ name: discountName, value: discountAmount });
    }

    if (wantsUpfrontPayment) {
        const discountAmount = priceAfterDiscount * upfrontDiscount;
        priceAfterDiscount -= discountAmount;
        let discountName;
        if (lang === 'ru') discountName = 'За предоплату (-10%)';
        else if (lang === 'en') discountName = 'For upfront payment (-10%)';
        else discountName = 'Oldindan to\'lov uchun (-10%)';
        discountsApplied.push({ name: discountName, value: discountAmount });
    }
    
    const finalPrice = priceAfterDiscount;
    const savings = priceAfterSurcharges - finalPrice;
    
    let bonusDescription;
    if (lang === 'ru') bonusDescription = "Аудит логотипа и 1-часовая консультация в подарок";
    else if (lang === 'en') bonusDescription = "Logo audit and 1-hour consultation as a gift";
    else bonusDescription = "Logotip auditi va 1 soatlik konsultatsiya sovg'a tariqasida";
    const bonus = finalPrice > bonusThreshold ? bonusDescription : null;

    return {
        base: basePrice,
        final: finalPrice,
        discountApplied: discountsApplied,
        savings,
        bonus,
        surcharges,
    };
}

export const generateSummary = (selections: PackageSelections, lang: 'uz' | 'ru' | 'en' = 'uz') => {
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

    let summary = `${lang === 'ru' ? 'Выбранные услуги' : lang === 'en' ? 'Selected services' : 'Tanlangan xizmatlar'}: ${services.join(', ') || (lang === 'ru' ? 'Нет' : lang === 'en' ? 'None' : 'Yo\'q')}`;

    const { discountApplied, bonus, surcharges } = calculatePackagePrice(selections, lang);
    
    const conditions = [];

    if (surcharges.some(s => s.name.includes('Shoshilinch') || s.name.includes('Срочность') || s.name.includes('Urgency'))) {
        conditions.push(lang === 'ru' ? "Срочный" : lang === 'en' ? 'Urgent' : "Shoshilinch");
    }
     if (surcharges.some(s => s.name.includes('NDA'))) {
        conditions.push("NDA");
    }
    if (wantsUpfrontPayment) {
        conditions.push(lang === 'ru' ? "100% предоплата" : lang === 'en' ? '100% upfront payment' : "100% oldindan to'lov");
    }

    if (conditions.length > 0) {
        summary += `\n${lang === 'ru' ? 'Особые условия' : lang === 'en' ? 'Special conditions' : 'Maxsus shartlar'}: ${conditions.join(', ')}`;
    }

    if (discountApplied.length > 0) {
        const discountText = discountApplied.map(d => `${d.name} (${formatPrice(d.value, lang)})`).join('; ');
        summary += `\n${lang === 'ru' ? 'Примененные скидки' : lang === 'en' ? 'Applied discounts' : 'Qo\'llanilgan chegirmalar'}: ${discountText}`;
    }

    if (bonus) {
        summary += `\n${lang === 'ru' ? 'Бонус' : 'Bonus'}: ${bonus}`;
    }

    return summary;
}
