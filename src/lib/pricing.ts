

const uzServiceDetails = {
    audit: { label: "Logo Auditi", description: "Mavjud logotipni tahlil qilish va yaxshilash bo'yicha tavsiyalar.", price: 1300000, timeline: "2-3 kun", note: null },
    namingCheck: { label: "Neyming Tekshiruvi", description: "Brend nomining O'zbekiston va xalqaro bazalarda bo'shligini tekshirish.", price: 1500000, timeline: "1-2 kun", note: null },
    consultation: { label: "1 soatlik konsultatsiya", description: "Brending bo'yicha har qanday savolingizga tezkor yo'l-yo'riq va professional maslahat.", price: 1000000, timeline: "1 soat", note: null },
    strategy: { label: "Brend-strategiya va platforma", description: "Bozor tahlili, brend auditi, pozitsiyalash va qadriyatlar taklifini ishlab chiqish.", price: 60000000, timeline: "8 haftadan", note: null },
    commStrategy: { label: "Kommunikatsion strategiya", description: "Mijozlar bilan muloqot strategiyasi: ohang, asosiy xabarlar, kanallar.", price: 50000000, timeline: "8 haftadan", note: null },
    naming: { label: "Neyming (Brend nom ishlab chiqish)", description: "Brendingiz uchun unutilmas va kuchli nom tanlash.", price: 13000000, timeline: "2-3 hafta", note: null },
    logo: { label: "Logotip va bazaviy stil", description: "Logotip, ranglar palitrasi, shriftlar. 2 ta konsepsiya, 5 ta nositelda namoyish.", price: 26000000, timeline: "2-4 hafta", note: null },
    designSystem: { label: "To'liq dizayn-tizim", description: "<strong>Logotipni o'z ichiga oladi.</strong> Ranglar, shriftlar, firma grafikasi, ikonikalar, tasvirlar uslubi. 3 ta konsepsiya.", price: 39000000, timeline: "4-6 hafta", note: null },
    brandbook: { label: "Brendbuk va gaydlayn", description: "Firma uslubidan foydalanish bo'yicha qoidalar hujjati.", price: 13000000, timeline: "1 haftadan", note: null },
    packaging: { label: "Qadoq dizayni", description: "3 SKU uchun qadoq ishlab chiqish, chop etishga tayyorlash. Qadoq formasi alohida ishlab chiqiladi.", price: 13000000, timeline: "4-6 hafta", note: null },
    smm: { label: "Ijtimoiy tarmoqlar uchun stil", description: "Postlar va storislarni firma uslubida bezash.", price: 13000000, timeline: "2 haftadan", note: null },
    merch: { label: "Brendli merch va nositellar", description: "Kiyim, aksessuarlar, POSM materiallari dizayni.", price: 0, timeline: "2 haftadan", note: "Individual hisoblanadi" },
    illustrations: { label: "Illustratsiyalar va animatsiya", description: "Firma grafikasi, infografika va animatsiyalar yaratish.", price: 0, timeline: "3 haftadan", note: "Individual hisoblanadi" },
    urgency: { label: "Shoshilinch loyiha (+50%)", description: "Loyiha navbatsiz, qisqa muddatda (2-3 kun) tayyorlanadi. Umumiy narxga 50% ustama qo'shiladi.", price: 0, timeline: "Individual", note: "+50%" },
    nda: { label: "Maxfiylik shartnomasi (NDA) (+25%)", description: "Loyiha ma'lumotlarini oshkor etmaslik shartnomasi. Umumiy narxga 25% ustama qo'shiladi.", price: 0, timeline: "Individual", note: "+25%" }
};

const ruServiceDetails = {
    audit: { label: "Аудит логотипа", description: "Анализ существующего логотипа и рекомендации по улучшению.", price: 1300000, timeline: "2-3 дня", note: null },
    namingCheck: { label: "Проверка нейминга", description: "Проверка доступности имени бренда в базах данных Узбекистана и международных базах.", price: 1500000, timeline: "1-2 дня", note: null },
    consultation: { label: "1-часовая консультация", description: "Быстрые рекомендации и профессиональные советы по любому вопросу брендинга.", price: 1000000, timeline: "1 час", note: null },
    strategy: { label: "Бренд-стратегия и платформа", description: "Анализ рынка, аудит бренда, разработка позиционирования и ценностного предложения.", price: 60000000, timeline: "от 8 недель", note: null },
    commStrategy: { label: "Коммуникационная стратегия", description: "Стратегия общения с клиентами: тон, ключевые сообщения, каналы.", price: 50000000, timeline: "от 8 недель", note: null },
    naming: { label: "Нейминг (разработка имени бренда)", description: "Выбор запоминающегося и сильного имени для вашего бренда.", price: 13000000, timeline: "2-3 недели", note: null },
    logo: { label: "Логотип и базовый стиль", description: "Логотип, цветовая палитра, шрифты. 2 концепции, демонстрация на 5 носителях.", price: 26000000, timeline: "2-4 недели", note: null },
    designSystem: { label: "Полная дизайн-система", description: "<strong>Включает логотип.</strong> Цвета, шрифты, фирменная графика, иконки, стиль изображений. 3 концепции.", price: 39000000, timeline: "4-6 недель", note: null },
    brandbook: { label: "Брендбук и гайдлайн", description: "Документ с правилами использования фирменного стиля.", price: 13000000, timeline: "от 1 недели", note: null },
    packaging: { label: "Дизайн упаковки", description: "Разработка упаковки для 3 SKU, подготовка к печати. Форма упаковки разрабатывается отдельно.", price: 13000000, timeline: "4-6 недель", note: null },
    smm: { label: "Стиль для социальных сетей", description: "Оформление постов и сторис в фирменном стиле.", price: 13000000, timeline: "от 2 недель", note: null },
    merch: { label: "Брендированный мерч и носители", description: "Дизайн одежды, аксессуаров, POSM-материалов.", price: 0, timeline: "от 2 недель", note: "Рассчитывается индивидуально" },
    illustrations: { label: "Иллюстрации и анимация", description: "Создание фирменной графики, инфографики и анимаций.", price: 0, timeline: "от 3 недель", note: "Рассчитывается индивидуально" },
    urgency: { label: "Срочный проект (+50%)", description: "Проект выполняется вне очереди, в короткие сроки (2-3 дня). К общей стоимости добавляется 50%.", price: 0, timeline: "Индивидуально", note: "+50%" },
    nda: { label: "Договор о неразглашении (NDA) (+25%)", description: "Договор о неразглашении информации о проекте. К общей стоимости добавляется 25%.", price: 0, timeline: "Индивидуально", note: "+25%" }
};

const enServiceDetails = {
    audit: { label: "Logo Audit", description: "Analysis of the existing logo and recommendations for improvement.", price: 1300000, timeline: "2-3 days", note: null },
    namingCheck: { label: "Naming Check", description: "Checking the availability of the brand name in Uzbekistan and international databases.", price: 1500000, timeline: "1-2 days", note: null },
    consultation: { label: "1-hour consultation", description: "Quick guidance and professional advice on any branding question.", price: 1000000, timeline: "1 hour", note: null },
    strategy: { label: "Brand Strategy and Platform", description: "Market analysis, brand audit, positioning and value proposition development.", price: 60000000, timeline: "from 8 weeks", note: null },
    commStrategy: { label: "Communication Strategy", description: "Customer communication strategy: tone, key messages, channels.", price: 50000000, timeline: "from 8 weeks", note: null },
    naming: { label: "Naming (Brand Name Development)", description: "Choosing a memorable and strong name for your brand.", price: 13000000, timeline: "2-3 weeks", note: null },
    logo: { label: "Logo and Basic Style", description: "Logo, color palette, fonts. 2 concepts, demonstration on 5 carriers.", price: 26000000, timeline: "2-4 weeks", note: null },
    designSystem: { label: "Full Design System", description: "<strong>Includes logo.</strong> Colors, fonts, corporate graphics, icons, image style. 3 concepts.", price: 39000000, timeline: "4-6 weeks", note: null },
    brandbook: { label: "Brandbook and Guideline", description: "A document with rules for using the corporate identity.", price: 13000000, timeline: "from 1 week", note: null },
    packaging: { label: "Packaging Design", description: "Packaging development for 3 SKUs, preparation for printing. The packaging form is developed separately.", price: 13000000, timeline: "4-6 weeks", note: null },
    smm: { label: "Style for Social Networks", description: "Design of posts and stories in corporate style.", price: 13000000, timeline: "from 2 weeks", note: null },
    merch: { label: "Branded Merch and Carriers", description: "Design of clothing, accessories, POSM materials.", price: 0, timeline: "from 2 weeks", note: "Calculated individually" },
    illustrations: { label: "Illustrations and Animation", description: "Creation of corporate graphics, infographics and animations.", price: 0, timeline: "from 3 weeks", note: "Calculated individually" },
    urgency: { label: "Urgent Project (+50%)", description: "The project is carried out out of turn, in a short time (2-3 days). 50% is added to the total cost.", price: 0, timeline: "Individual", note: "+50%" },
    nda: { label: "Non-Disclosure Agreement (NDA) (+25%)", description: "Agreement on non-disclosure of project information. 25% is added to the total cost.", price: 0, timeline: "Individual", note: "+25%" }
};

export const getServiceDetails = (lang: 'uz' | 'ru' | 'en') => {
    switch (lang) {
        case 'ru': return ruServiceDetails;
        case 'en': return enServiceDetails;
        default: return uzServiceDetails;
    }
};

export const serviceDetails = uzServiceDetails; // Default export for backward compatibility


export function formatPrice(price: number, lang: 'uz' | 'ru' | 'en' = 'uz') {
    if (price === 0) {
        if (lang === 'ru') return 'По догов.';
        if (lang === 'en') return 'On Request';
        return "Kelishiladi";
    }

    const currency = lang === 'ru' ? 'сум' : (lang === 'en' ? 'sum' : "so'm");
    
    if (price >= 1000000) {
        const millions = price / 1000000;
        const formattedMillions = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
        return `${formattedMillions} mln ${currency}`;
    }

    return `${price.toLocaleString('fr-FR')} ${currency}`;
}


export const comparisonData = (lang: 'uz' | 'ru' | 'en' = 'uz') => {
    const sd = getServiceDetails(lang);
    const satisfactionGuarantee = lang === 'ru' ? '100% Гарантия Удовлетворенности' : lang === 'en' ? '100% Satisfaction Guarantee' : '100% Mamnuniyat Kafolati';
    const transparentProcess = lang === 'ru' ? 'Прозрачный процесс и постоянная связь' : lang === 'en' ? 'Transparent process and constant communication' : 'Shaffof jarayon va doimiy aloqa';
    const pcgDiscount = lang === 'ru' ? 'Скидка -50% для членов PCG' : lang === 'en' ? '-50% discount for PCG members' : 'PCG a\'zolari uchun -50% chegirma';

    return [
      { 
        feature: sd.naming.label,
        competitors: { jon: `${formatPrice(sd.naming.price, lang)}`, mano: `${formatPrice(40000000, lang)}`, abba: `${formatPrice(38000000, lang)}`, mountain: `${formatPrice(35000000, lang)}` }
      },
      { 
        feature: sd.logo.label,
        competitors: { jon: `${formatPrice(sd.logo.price, lang)}`, mano: `${formatPrice(82000000, lang)}`, abba: `${formatPrice(78000000, lang)}`, mountain: `${formatPrice(71500000, lang)}` }
      },
      { 
        feature: sd.brandbook.label,
        competitors: { jon: `${formatPrice(sd.brandbook.price, lang)}`, mano: `${formatPrice(42000000, lang)}`, abba: `${formatPrice(40000000, lang)}`, mountain: `${formatPrice(50000000, lang)}` }
      },
      { 
        feature: sd.packaging.label,
        competitors: { jon: `${formatPrice(sd.packaging.price, lang)}`, mano: `${formatPrice(120000000, lang)}`, abba: `${formatPrice(80000000, lang)}`, mountain: `${formatPrice(60000000, lang)}` }
      },
      { 
        feature: sd.strategy.label,
        competitors: { jon: `${formatPrice(sd.strategy.price, lang)}`, mano: `${formatPrice(240000000, lang)}`, abba: null, mountain: false }
      },
      { 
        feature: sd.commStrategy.label,
        competitors: { jon: `${formatPrice(sd.commStrategy.price, lang)}`, mano: `${formatPrice(190000000, lang)}`, abba: null, mountain: false }
      },
      { 
        feature: sd.smm.label,
        competitors: { jon: `${formatPrice(sd.smm.price, lang)}`, mano: `${formatPrice(45000000, lang)}`, abba: null, mountain: null }
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


export type SelectedServices = Record<keyof typeof serviceDetails, boolean>;

export const packageDiscountThreshold = 3;
export const packageDiscount = 0.20; // 20%
export const upfrontDiscount = 0.10; // 10%
export const urgencySurcharge = 0.50;
export const ndaSurcharge = 0.25;
export const bonusThreshold = 50000000;


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
    
    const mainServices: (keyof SelectedServices)[] = ['naming', 'logo', 'designSystem', 'brandbook', 'packaging'];
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
