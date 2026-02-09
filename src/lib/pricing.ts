
'use client';

const USD_TO_UZS_RATE = 12700;

const convertToUzs = (usd: number) => {
    if (usd === 0) return 0;
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
        features: ["Logotipning kuchli va zaif tomonlari tahlili", "Raqobatchilarga nisbatan tahlil", "Yaxshilash bo'yicha aniq tavsiyalar"]
    },
    namingCheck: {
        label: "Neyming Tekshiruvi",
        description: "Brend nomining O'zbekiston va xalqaro bazalarda bo'shligini tekshirish.",
        price: basePricesUSD.namingCheck,
        features: ["O'zbekiston bazasi bo'yicha chuqur tekshiruv", "Xalqaro WIPO bazasi bo'yicha tekshiruv", "Domen va ijtimoiy tarmoqlarda bo'shlik tekshiruvi"]
    },
    consultation: {
        label: "30 daqiqalik konsultatsiya",
        description: "Brending bo'yicha har qanday savolingizga tezkor yo'l-yo'riq va professional maslahat.",
        price: basePricesUSD.consultation,
        features: ["Biznesingizdagi muammoni aniqlashtirish", "Brending bo'yicha savollarga javoblar", "Keyingi qadamlar bo'yicha tavsiyalar"]
    },
    strategy: {
        label: "Brend-strategiya va platforma",
        description: "Biznesingiz uchun natija keltiradigan poydevor — bozor tahlili, pozitsiyalash va kommunikatsiya.",
        price: basePricesUSD.strategy,
        features: ["Bozor va raqobatchilar tahlili", "Maqsadli auditoriya xaritasi", "Brend platformasi (missiya, qadriyatlar)", "Pozitsiyalash va UST"]
    },
    commStrategy: {
        label: "Kommunikatsion strategiya",
        description: "Mijozlar bilan muloqot strategiyasi: ohang, asosiy xabarlar, kanallar.",
        price: basePricesUSD.commStrategy,
        features: ["Brend ovozi (Tone of Voice)", "Asosiy xabarlar ishlab chiqish", "Kommunikatsiya kanallarini rejalashtirish"]
    },
    namingVIP: {
        label: "👑 Naming VIP",
        description: "Katta va xalqaro bozorga mo'ljallangan loyihalar uchun.",
        price: basePricesUSD.namingVIP,
        features: ["Shaxsan Baxtiyorjon Gaziyev nazorati", "10+ eksklyuziv nom variantlari", "6 tilda fonetik va semantik tahlil", "3 tagacha klass bo'yicha patent tekshiruvi", "10 yilga bepul .uz domen"],
        results: ["Xalqaro miqyosda ishlaydigan kuchli nom", "Maksimal huquqiy xotirjamlik", "Eng yuqori darajadagi ijodiy yondashuv"],
        timeline: "20–25 ish kuni",
        note: "Bu tarifda biz sizga nafaqat nom, balki kelajakdagi brendingiz poydevorini beramiz."
    },
    namingPremium: {
        label: "Naming PREMIUM",
        description: "O'rta va rivojlanayotgan biznes uchun strategik yondashuv.",
        price: basePricesUSD.namingPremium,
        features: ["5 ta strategik nom variantlari", "Bir nechta tilda tahlil", "2 ta klass bo'yicha patent tekshiruvi", "5 yilga bepul .uz domen"],
        results: ["Biznes maqsadingizga xizmat qiladigan nom", "Huquqiy jihatdan toza va xavfsiz brend", "Raqobatchilardan ajralib turuvchi ovoz"],
        recommended: true,
        timeline: "14–20 ish kuni"
    },
    namingStandard: {
        label: "Naming STANDARD",
        description: "Kichik biznes va startaplar uchun ideal.",
        price: basePricesUSD.namingStandard,
        features: ["3 ta jarangli nom variantlari", ".uz domen bo'shligi tekshiruvi", "Ijtimoiy tarmoqlarda band emasligi"],
        results: ["Tez va sifatli start uchun nom", "Oson eslab qolinadigan belgi"],
        timeline: "7–10 ish kuni",
        note: "Muhim: ushbu tarifda patent tekshiruvi va chuqur semantik tahlil o'tkazilmaydi."
    },
    logoVIP: {
        label: "👑 Logo + Firma uslubi + Brandbook VIP",
        description: "Katta, o‘sishga yoki xalqaro bozorga yo‘naltirilgan bizneslar uchun.",
        price: basePricesUSD.logoVIP,
        features: [
            "Shaxsan Baxtiyorjon Gaziyev ishtiroki va nazorati",
            "Brend strategiyasi asosida 8+ logotip konsepsiyasi",
            "25+ touchpoint dizayn (offline va online)",
            "To‘liq Vizual Brandbook (ranglar, shriftlar, grid)",
            "Logotip animatsiyasi (premium sifat)",
            "3 oy davomida post-delivery qo‘llab-quvvatlash"
        ],
        results: [
            "Brendni yillar davomida olib yuradigan mustahkam tizim",
            "Jamoa va marketing uchun aniq qo‘llanma",
            "Investorlar oldida ishonchli ko‘rinish",
            "Qayta dizayn qilish ehtimoli minimal qaror"
        ],
        timeline: "20–30 ish kuni",
        note: "👉 Bu tarifda siz faqat dizayn emas, tizim va xotirjamlik olasiz."
    },
    logoPremium: {
        label: "Logo + Firma uslubi PREMIUM",
        description: "O‘z brendini jiddiy rivojlantirishni boshlagan bizneslar uchun.",
        price: basePricesUSD.logoPremium,
        features: [
            "5 ta strategik logotip konsepsiyasi",
            "Firma uslubi (ranglar, shriftlar, patternlar)",
            "15+ touchpoint vizualizatsiyasi",
            "10 ta Telegram stiker",
            "Professional taqdimot maketlari"
        ],
        results: [
            "Yaxlit vizual obraz",
            "Brendni taniladigan qiladigan firma uslubi",
            "Marketingda tartib va izchillik"
        ],
        recommended: true,
        timeline: "14–20 ish kuni",
        note: "👉 Bu tarif logotipdan keyingi eng muhim bosqich — vizual tizimni beradi."
    },
    logoStandard: {
        label: "Logotip STANDARD",
        description: "Startaplar va kichik biznes uchun tezkor yechim.",
        price: basePricesUSD.logoStandard,
        features: [
            "3 ta logotip konsepsiyasi",
            "5 ta asosiy touchpoint vizualizatsiyasi",
            "Barcha texnik formatlar (AI, PNG, PDF)",
            "Raqobatchilar tahlili"
        ],
        results: [
            "Tez ishga tushirish uchun tayyor logotip",
            "Raqobatchilar orasida yo‘qolib ketmaydigan belgi",
            "Kundalik foydalanish uchun vizual baza"
        ],
        timeline: "7–10 ish kuni",
        note: "Eslatma: bu tarifda to‘liq firma uslubi va brendbook ishlab chiqilmaydi."
    },
    packaging: {
        label: "Qadoq dizayni",
        description: "3 SKU uchun qadoq ishlab chiqish, chop etishga tayyorlash.",
        price: basePricesUSD.packaging,
        features: ["Bozor va raqobatchilar tahlili", "2 ta dizayn konsepsiyasi", "3 tagacha SKU adaptatsiyasi"]
    },
    smm: {
        label: "Ijtimoiy tarmoqlar uchun stil",
        description: "Postlar va storislarni firma uslubi va brendingda bezash.",
        price: basePricesUSD.smm,
        features: ["6 ta post shabloni", "6 ta stories shabloni", "Profil vizual konsepsiyasi"]
    },
    merch: {
        label: "Brendli merch va nositellar",
        description: "Kiyim, aksessuarlar, POSM materiallari dizayni.",
        price: 0,
        note: "Individual"
    },
    illustrations: {
        label: "Illustratsiyalar va animatsiya",
        description: "Firma grafikasi, infografika va animatsiyalar yaratish.",
        price: 0,
        note: "Individual"
    },
    urgency: {
        label: "Shoshilinch loyiha (+50%)",
        description: "Loyiha navbatsiz, qisqa muddatda tayyorlanadi.",
        price: 0,
        note: "+50%"
    },
    nda: {
        label: "Maxfiylik shartnomasi (NDA) (+50%)",
        description: "Loyiha ma'lumotlarini oshkor etmaslik shartnomasi.",
        price: 0,
        note: "+50%"
    }
};

const ruServiceDetails: typeof uzServiceDetails = JSON.parse(JSON.stringify(uzServiceDetails));
const enServiceDetails: typeof uzServiceDetails = JSON.parse(JSON.stringify(uzServiceDetails));
const zhServiceDetails: typeof uzServiceDetails = JSON.parse(JSON.stringify(uzServiceDetails));

export const getServiceDetails = (lang: 'uz' | 'ru' | 'en' | 'zh') => {
    switch (lang) {
        case 'ru': return ruServiceDetails;
        case 'en': return enServiceDetails;
        case 'zh': return zhServiceDetails;
        default: return uzServiceDetails;
    }
};

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

export type SelectedServices = Record<keyof typeof basePricesUSD, boolean>;

const PROMO_CODES: Record<string, number> = {
    'JON2025': 0.05,
    'BAXTIYOR': 0.05
};

interface PackageSelections {
    selectedServices: SelectedServices;
    wantsUpfrontPayment: boolean;
    promoCode?: string;
}

export interface PriceDetails {
    base: number;
    final: number;
    discountApplied: { name: string, value: number }[];
    savings: number;
    isPromoValid?: boolean;
}

export const calculatePackagePrice = (selections: PackageSelections, lang: 'uz' | 'ru' | 'en' | 'zh' = 'uz'): PriceDetails => {
    const { selectedServices, wantsUpfrontPayment, promoCode } = selections;
    const sd = getServiceDetails(lang);

    let basePrice = 0;
    let mainServicesCount = 0;
    const mainKeys: (keyof SelectedServices)[] = ['namingStandard', 'namingPremium', 'namingVIP', 'logoStandard', 'logoPremium', 'logoVIP', 'packaging', 'strategy'];

    for (const key in selectedServices) {
        const k = key as keyof SelectedServices;
        if (selectedServices[k] && sd[k]) {
            basePrice += sd[k].price;
            if (mainKeys.includes(k)) mainServicesCount++;
        }
    }

    const discountsApplied: { name: string, value: number }[] = [];
    let finalPrice = basePrice;

    // Package discount (2 or more)
    if (mainServicesCount >= 2) {
        const packageDiscountValue = basePrice * 0.20;
        discountsApplied.push({ name: lang === 'ru' ? 'Пакетная скидка (-20%)' : 'Paketli chegirma (-20%)', value: packageDiscountValue });
        finalPrice -= packageDiscountValue;
    }

    // Upfront discount
    if (wantsUpfrontPayment) {
        const upfrontDiscountValue = finalPrice * 0.10;
        discountsApplied.push({ name: lang === 'ru' ? 'За предоплату (-10%)' : 'Oldindan to\'lov (-10%)', value: upfrontDiscountValue });
        finalPrice -= upfrontDiscountValue;
    }

    // Promo code
    const normalizedPromo = promoCode?.trim().toUpperCase();
    const promoDiscountValue = PROMO_CODES[normalizedPromo || ''];
    if (promoDiscountValue) {
        const val = finalPrice * promoDiscountValue;
        discountsApplied.push({ name: `${lang === 'ru' ? 'Промокод' : 'Promokod'} (${normalizedPromo})`, value: val });
        finalPrice -= val;
    }

    const savings = basePrice - finalPrice;

    return {
        base: basePrice,
        final: finalPrice,
        discountApplied: discountsApplied,
        savings,
        isPromoValid: !!promoDiscountValue
    };
}
