

export const serviceDetails = {
    strategy: { 
        label: "Brend-strategiya va platforma", 
        description: "Bozor tahlili, brend auditi, pozitsiyalash va qadriyatlar taklifini ishlab chiqish.", 
        price: 15000000, 
        marketPrice: 240000000,
        timeline: "8 haftadan",
        note: null,
    },
    commStrategy: { 
        label: "Kommunikatsion strategiya", 
        description: "Mijozlar bilan muloqot strategiyasi: ohang, asosiy xabarlar, kanallar.", 
        price: 11875000,
        marketPrice: 190000000,
        timeline: "8 haftadan",
        note: null,
    },
    naming: { 
        label: "Neyming", 
        description: "Brendingiz uchun unutilmas va kuchli nom tanlash.", 
        price: 2500000,
        marketPrice: 40000000,
        timeline: "2-3 hafta",
        note: null,
    },
    logo: { 
        label: "Logotip va bazaviy stil", 
        description: "Logotip, ranglar palitrasi, shriftlar. 2 ta konsepsiya, 5 ta nositelda namoyish.", 
        price: 5125000,
        marketPrice: 82000000,
        timeline: "2-4 hafta",
        note: null,
    },
    designSystem: { 
        label: "To'liq dizayn-tizim", 
        description: "Logotip, ranglar, shriftlar, firma grafikasi, ikonikalar, tasvirlar uslubi. 3 ta konsepsiya.", 
        price: 7500000,
        marketPrice: 120000000,
        timeline: "4-6 hafta",
        note: null,
    },
    brandbook: { 
        label: "Brendbuk va gaydlayn", 
        description: "Firma uslubidan foydalanish bo'yicha qoidalar hujjati.", 
        price: 2625000,
        marketPrice: 42000000,
        timeline: "1 haftadan",
        note: null,
    },
    packaging: { 
        label: "Qadoq dizayni", 
        description: "3 SKU uchun qadoq ishlab chiqish, chop etishga tayyorlash. Qadoq formasi alohida ishlab chiqiladi.", 
        price: 7500000,
        marketPrice: 120000000,
        timeline: "4-6 hafta",
        note: null,
    },
    smm: { 
        label: "Ijtimoiy tarmoqlar uchun stil", 
        description: "Postlar va storislarni firma uslubida bezash.", 
        price: 2812500,
        marketPrice: 45000000,
        timeline: "2 haftadan",
        note: null,
    }
};

export function formatPrice(price: number) {
    if (price >= 1000000) {
        return `${(price / 1000000).toLocaleString('fr-FR').replace(',', '.')} mln so'm`;
    }
    return `${price.toLocaleString('fr-FR')} so'm`;
}


export const comparisonData = [
  { 
    feature: 'Neyming',
    competitors: {
        jon: `${formatPrice(serviceDetails.naming.price)}`,
        mano: `${formatPrice(40000000)}`,
        abba: `${formatPrice(45000000)}`,
        mountain: `${formatPrice(50000000)}`,
    }
  },
  { 
    feature: 'Logotip va stil',
    competitors: {
        jon: `${formatPrice(serviceDetails.logo.price)}`,
        mano: `${formatPrice(82000000)}`,
        abba: `${formatPrice(90000000)}`,
        mountain: `${formatPrice(100000000)}`,
    }
  },
   { 
    feature: 'Brendbuk',
    competitors: {
        jon: `${formatPrice(serviceDetails.brandbook.price)}`,
        mano: `${formatPrice(42000000)}`,
        abba: `${formatPrice(45000000)}`,
        mountain: `${formatPrice(50000000)}`,
    }
  },
  { 
    feature: 'Qadoq dizayni',
    competitors: {
        jon: `${formatPrice(serviceDetails.packaging.price)}`,
        mano: `${formatPrice(120000000)}`,
        abba: `${formatPrice(130000000)}`,
        mountain: `${formatPrice(150000000)}`,
    }
  },
  { 
    feature: 'Brend-strategiya',
    competitors: {
        jon: `${formatPrice(serviceDetails.strategy.price)}`,
        mano: `${formatPrice(240000000)}`,
        abba: null,
        mountain: null,
    }
  },
   { 
    feature: 'Kommunikatsion strategiya',
    competitors: {
        jon: `${formatPrice(serviceDetails.commStrategy.price)}`,
        mano: `${formatPrice(190000000)}`,
        abba: null,
        mountain: null,
    }
  },
  { 
    feature: 'SMM uchun stil',
    competitors: {
        jon: `${formatPrice(serviceDetails.smm.price)}`,
        mano: `${formatPrice(45000000)}`,
        abba: null,
        mountain: null,
    }
  },
  { 
    feature: '100% Mamnuniyat Kafolati', 
    isBenefit: true,
    competitors: {
        jon: true, // check
        mano: false, // x
        abba: false, // x
        mountain: false, // x
    }
  },
  { 
    feature: 'Shaffof jarayon va doimiy aloqa', 
    isBenefit: true,
    competitors: {
        jon: true, // check
        mano: true, // check
        abba: null, // minus
        mountain: true, // check
    }
  },
   { 
    feature: 'PCG a\'zolari uchun -50% chegirma', 
    isBenefit: true,
    competitors: {
        jon: true, // check
        mano: false, // x
        abba: false, // x
        mountain: false, // x
    }
  },
];


export type SelectedServices = Record<keyof typeof serviceDetails, boolean>;

export const pcgDiscount = 0.50;
export const bonusThreshold = 18750000;
export const bonusDescription = "Biznes vizitka dizayni sovg'a tariqasida";

interface PackageSelections {
    selectedServices: SelectedServices;
    isPcgMember: boolean;
}

export interface PriceDetails {
    base: number;
    final: number;
    discountApplied: string;
    discountValue: number;
    savings: number;
    bonus: string | null;
}


export const calculatePackagePrice = (selections: PackageSelections): PriceDetails => {
    const { selectedServices, isPcgMember } = selections;
    
    let basePrice = 0;
    for (const serviceKey in selectedServices) {
        if (serviceKey in serviceDetails && selectedServices[serviceKey as keyof SelectedServices]) {
            basePrice += serviceDetails[serviceKey as keyof SelectedServices].price;
        }
    }

    let discountValue = 0;
    let discountType = "";
    
    if (isPcgMember && basePrice > 0) {
        discountValue = pcgDiscount;
        discountType = 'PCG Tez Natija 3 uchun -50% chegirma';
    }
    
    const finalPrice = basePrice * (1 - discountValue);
    const savings = basePrice - finalPrice;

    const bonus = finalPrice > bonusThreshold ? bonusDescription : null;

    return {
        base: basePrice,
        final: finalPrice,
        discountApplied: discountType,
        discountValue: discountValue,
        savings,
        bonus,
    };
}

export const generateSummary = (selections: PackageSelections) => {
    const { selectedServices } = selections;
    
    const services = [];
    for (const serviceKey in selectedServices) {
        if (serviceKey in serviceDetails && selectedServices[serviceKey as keyof SelectedServices]) {
            services.push(serviceDetails[serviceKey as keyof SelectedServices].label);
        }
    }

    let summary = `Tanlangan xizmatlar: ${services.join(', ') || 'Yo\'q'}`;

    const { discountApplied, bonus } = calculatePackagePrice(selections);
    
    if (discountApplied) {
        summary += ` | Chegirma: ${discountApplied}`;
    }
    
    if (bonus) {
        summary += ` | Bonus: ${bonus}`;
    }

    return summary;
}
