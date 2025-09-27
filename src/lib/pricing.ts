

const uzServiceDetails = {
    audit: { label: "Logo Auditi", description: "Mavjud logotipni tahlil qilish va yaxshilash bo'yicha tavsiyalar.", price: 1500000, timeline: "2-3 kun", note: null },
    namingCheck: { label: "Neyming Tekshiruvi", description: "Brend nomining O'zbekiston va xalqaro bazalarda bo'shligini tekshirish.", price: 2000000, timeline: "1-2 kun", note: null },
    consultation: { label: "30 daqiqalik maslahat", description: "Brending bo'yicha har qanday savolingizga tezkor yo'l-yo'riq va professional maslahat.", price: 500000, timeline: "30 daqiqa", note: null },
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
    urgency: { label: "Shoshilinch loyiha (+50%)", description: "Loyiha navbatsiz, qisqa muddatda (2-3 kun) tayyorlanadi. Umumiy narxga 50% ustama qo'shiladi.", price: 0, timeline: "Individual", note: "Narxga qo'shiladi" },
    nda: { label: "Maxfiylik shartnomasi (NDA) (+25%)", description: "Loyiha ma'lumotlarini oshkor etmaslik shartnomasi. Umumiy narxga 25% ustama qo'shiladi.", price: 0, timeline: "Individual", note: "Narxga qo'shiladi" }
};

const ruServiceDetails = {
    audit: { label: "Аудит логотипа", description: "Анализ существующего логотипа и рекомендации по улучшению.", price: 1500000, timeline: "2-3 дня", note: null },
    namingCheck: { label: "Проверка нейминга", description: "Проверка доступности имени бренда в базах данных Узбекистана и международных базах.", price: 2000000, timeline: "1-2 дня", note: null },
    consultation: { label: "30-минутная консультация", description: "Быстрые рекомендации и профессиональные советы по любому вопросу брендинга.", price: 500000, timeline: "30 минут", note: null },
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
    urgency: { label: "Срочный проект (+50%)", description: "Проект выполняется вне очереди, в короткие сроки (2-3 дня). К общей стоимости добавляется 50%.", price: 0, timeline: "Индивидуально", note: "к цене" },
    nda: { label: "Договор о неразглашении (NDA) (+25%)", description: "Договор о неразглашении информации о проекте. К общей стоимости добавляется 25%.", price: 0, timeline: "Индивидуально", note: "к цене" }
};

export const getServiceDetails = (lang: 'uz' | 'ru') => {
    return lang === 'ru' ? ruServiceDetails : uzServiceDetails;
};

export const serviceDetails = uzServiceDetails; // Default export for backward compatibility


export function formatPrice(price: number, lang: 'uz' | 'ru' = 'uz') {
    const currency = lang === 'ru' ? 'сум' : 'so\'m';
    if (price === 0) return lang === 'ru' ? 'По догов.' : "Kelishiladi";
    return `${price.toLocaleString('fr-FR')} ${currency}`;
}


export const comparisonData = (lang: 'uz' | 'ru' = 'uz') => {
    const sd = getServiceDetails(lang);
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
        feature: lang === 'ru' ? '100% Гарантия Удовлетворенности' : '100% Mamnuniyat Kafolati', 
        isBenefit: true,
        competitors: { jon: true, mano: false, abba: false, mountain: false }
      },
      { 
        feature: lang === 'ru' ? 'Прозрачный процесс и постоянная связь' : 'Shaffof jarayon va doimiy aloqa', 
        isBenefit: true,
        competitors: { jon: true, mano: true, abba: null, mountain: true }
      },
      { 
        feature: lang === 'ru' ? 'Скидка -50% для членов PCG' : 'PCG a\'zolari uchun -50% chegirma', 
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
export const bonusThreshold = 18750000;


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


export const calculatePackagePrice = (selections: PackageSelections, lang: 'uz' | 'ru' = 'uz'): PriceDetails => {
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
        surcharges.push({ name: lang === 'ru' ? 'Надбавка за срочность (+50%)' : 'Shoshilinch uchun ustama (+50%)', value: surchargeAmount });
    }

    if (selectedServices.nda) {
        const surchargeAmount = basePrice * ndaSurcharge;
        priceAfterSurcharges += surchargeAmount;
        surcharges.push({ name: lang === 'ru' ? 'Надбавка за NDA (+25%)' : 'NDA uchun ustama (+25%)', value: surchargeAmount });
    }
    
    let priceAfterDiscount = priceAfterSurcharges;
    const discountsApplied: { name: string, value: number }[] = [];
    
    if (mainServicesCount >= packageDiscountThreshold) {
        const discountAmount = priceAfterSurcharges * packageDiscount;
        priceAfterDiscount -= discountAmount;
        discountsApplied.push({ name: lang === 'ru' ? `Пакетная скидка (-20%)` : `Paketli chegirma (-20%)`, value: discountAmount });
    }

    if (wantsUpfrontPayment) {
        const discountAmount = priceAfterDiscount * upfrontDiscount;
        priceAfterDiscount -= discountAmount;
        discountsApplied.push({ name: lang === 'ru' ? `За предоплату (-10%)` : `Oldindan to'lov uchun (-10%)`, value: discountAmount });
    }
    
    const finalPrice = priceAfterDiscount;
    const savings = priceAfterSurcharges - finalPrice;
    
    const bonusDescription = lang === 'ru' ? "Дизайн визитной карточки в подарок" : "Biznes vizitka dizayni sovg'a tariqasida";
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

export const generateSummary = (selections: PackageSelections, lang: 'uz' | 'ru' = 'uz') => {
    const { selectedServices, wantsUpfrontPayment } = selections;
    const sd = getServiceDetails(lang);
    
    const services = [];
    for (const serviceKey in selectedServices) {
        if (serviceKey in sd && selectedServices[serviceKey as keyof SelectedServices]) {
            const service = sd[serviceKey as keyof SelectedServices];
            if(service.price > 0 || service.note?.includes('qo\'shiladi') || service.note?.includes('к цене')) {
                services.push(service.label);
            }
        }
    }

    let summary = `${lang === 'ru' ? 'Выбранные услуги' : 'Tanlangan xizmatlar'}: ${services.join(', ') || (lang === 'ru' ? 'Нет' : 'Yo\'q')}`;

    const { discountApplied, bonus, surcharges } = calculatePackagePrice(selections, lang);
    
    const conditions = [];

    if (surcharges.some(s => s.name.includes('Shoshilinch') || s.name.includes('Срочность'))) {
        conditions.push(lang === 'ru' ? "Срочный" : "Shoshilinch");
    }
     if (surcharges.some(s => s.name.includes('NDA'))) {
        conditions.push("NDA");
    }
    if (wantsUpfrontPayment) {
        conditions.push(lang === 'ru' ? "100% предоплата" : "100% oldindan to'lov");
    }

    if (conditions.length > 0) {
        summary += `\n${lang === 'ru' ? 'Особые условия' : 'Maxsus shartlar'}: ${conditions.join(', ')}`;
    }

    if (discountApplied.length > 0) {
        const discountText = discountApplied.map(d => `${d.name} (${formatPrice(d.value, lang)})`).join('; ');
        summary += `\n${lang === 'ru' ? 'Примененные скидки' : 'Qo\'llanilgan chegirmalar'}: ${discountText}`;
    }

    if (bonus) {
        summary += `\n${lang === 'ru' ? 'Бонус' : 'Bonus'}: ${bonus}`;
    }

    return summary;
}
