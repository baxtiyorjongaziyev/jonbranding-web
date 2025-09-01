
export const serviceDetails = {
    strategy: { 
        label: "Brend-strategiya va platforma", 
        description: "Bozor tahlili, brend auditi, pozitsiyalash va qadriyatlar taklifini ishlab chiqish.", 
        price: 30000000, 
        marketPrice: 240000000,
        timeline: "8 haftadan",
        note: null,
        isBase: false
    },
    commStrategy: { 
        label: "Kommunikatsion strategiya", 
        description: "Mijozlar bilan muloqot strategiyasi: ohang, asosiy xabarlar, kanallar.", 
        price: 23750000, 
        marketPrice: 190000000,
        timeline: "8 haftadan",
        note: null,
        isBase: false
    },
    naming: { 
        label: "Neyming", 
        description: "Brendingiz uchun unutilmas va kuchli nom tanlash.", 
        price: 5000000, 
        marketPrice: 40000000,
        timeline: "2-3 hafta",
        note: null,
        isBase: false
    },
    logo: { 
        label: "Logotip va bazaviy stil", 
        description: "Logotip, ranglar palitrasi, shriftlar. 2 ta konsepsiya, 5 ta nositelda namoyish.", 
        price: 10250000, 
        marketPrice: 82000000,
        timeline: "2-4 hafta",
        note: null,
        isBase: false
    },
    designSystem: { 
        label: "To'liq dizayn-tizim", 
        description: "Logotip, ranglar, shriftlar, firma grafikasi, ikonikalar, tasvirlar uslubi. 3 ta konsepsiya.", 
        price: 15000000, 
        marketPrice: 120000000,
        timeline: "4-6 hafta",
        note: null,
        isBase: false
    },
    brandbook: { 
        label: "Brendbuk va gaydlayn", 
        description: "Firma uslubidan foydalanish bo'yicha qoidalar hujjati.", 
        price: 5250000, 
        marketPrice: 42000000,
        timeline: "1 haftadan",
        note: null,
        isBase: false
    },
    packaging: { 
        label: "Qadoq dizayni", 
        description: "3 SKU uchun qadoq ishlab chiqish, chop etishga tayyorlash. Qadoq formasi alohida ishlab chiqiladi.", 
        price: 15000000, 
        marketPrice: 120000000,
        timeline: "4-6 hafta",
        note: null,
        isBase: false
    },
    smm: { 
        label: "Ijtimoiy tarmoqlar uchun stil", 
        description: "Postlar va storislarni firma uslubida bezash.", 
        price: 5625000, 
        marketPrice: 45000000,
        timeline: "2 haftadan",
        note: null,
        isBase: false
    }
};

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
