

export const serviceDetails = {
    audit: {
        label: "Logo Auditi",
        description: "Mavjud logotipni tahlil qilish va yaxshilash bo'yicha tavsiyalar.",
        price: 1500000,
        
        timeline: "2-3 kun",
        note: null,
    },
    namingCheck: {
        label: "Neyming Tekshiruvi",
        description: "Brend nomining O'zbekiston va xalqaro bazalarda bo'shligini tekshirish.",
        price: 2000000,
        
        timeline: "1-2 kun",
        note: null,
    },
    consultation: {
        label: "30 daqiqalik maslahat",
        description: "Brending bo'yicha har qanday savolingizga tezkor yo'l-yo'riq va professional maslahat.",
        price: 500000,
        
        timeline: "30 daqiqa",
        note: null,
    },
    strategy: { 
        label: "Brend-strategiya va platforma", 
        description: "Bozor tahlili, brend auditi, pozitsiyalash va qadriyatlar taklifini ishlab chiqish.", 
        price: 60000000, 
        
        timeline: "8 haftadan",
        note: null,
    },
    commStrategy: { 
        label: "Kommunikatsion strategiya", 
        description: "Mijozlar bilan muloqot strategiyasi: ohang, asosiy xabarlar, kanallar.", 
        price: 50000000,
        
        timeline: "8 haftadan",
        note: null,
    },
    naming: { 
        label: "Neyming (Brend nom ishlab chiqish)", 
        description: "Brendingiz uchun unutilmas va kuchli nom tanlash.", 
        price: 13000000,
        
        timeline: "2-3 hafta",
        note: null,
    },
    logo: { 
        label: "Logotip va bazaviy stil", 
        description: "Logotip, ranglar palitrasi, shriftlar. 2 ta konsepsiya, 5 ta nositelda namoyish.", 
        price: 26000000,
        
        timeline: "2-4 hafta",
        note: null,
    },
    designSystem: { 
        label: "To'liq dizayn-tizim", 
        description: "<strong>Logotipni o'z ichiga oladi.</strong> Ranglar, shriftlar, firma grafikasi, ikonikalar, tasvirlar uslubi. 3 ta konsepsiya.", 
        price: 39000000,
        
        timeline: "4-6 hafta",
        note: null,
    },
    brandbook: { 
        label: "Brendbuk va gaydlayn", 
        description: "Firma uslubidan foydalanish bo'yicha qoidalar hujjati.", 
        price: 13000000,
        
        timeline: "1 haftadan",
        note: null,
    },
    packaging: { 
        label: "Qadoq dizayni", 
        description: "3 SKU uchun qadoq ishlab chiqish, chop etishga tayyorlash. Qadoq formasi alohida ishlab chiqiladi.", 
        price: 13000000,
        
        timeline: "4-6 hafta",
        note: null,
    },
    smm: { 
        label: "Ijtimoiy tarmoqlar uchun stil", 
        description: "Postlar va storislarni firma uslubida bezash.", 
        price: 13000000,
        
        timeline: "2 haftadan",
        note: null,
    },
    merch: {
        label: "Brendli merch va nositellar",
        description: "Kiyim, aksessuarlar, POSM materiallari dizayni.",
        price: 0,
        
        timeline: "2 haftadan",
        note: "Individual hisoblanadi"
    },
    illustrations: {
        label: "Illustratsiyalar va animatsiya",
        description: "Firma grafikasi, infografika va animatsiyalar yaratish.",
        price: 0,
        
        timeline: "3 haftadan",
        note: "Individual hisoblanadi"
    },
    urgency: {
        label: "Shoshilinch loyiha (+50%)",
        description: "Loyiha navbatsiz, qisqa muddatda (2-3 kun) tayyorlanadi. Umumiy narxga 50% ustama qo'shiladi.",
        price: 0,
        
        timeline: "Individual",
        note: "Narxga qo'shiladi"
    },
    nda: {
        label: "Maxfiylik shartnomasi (NDA) (+25%)",
        description: "Loyiha ma'lumotlarini oshkor etmaslik shartnomasi. Umumiy narxga 25% ustama qo'shiladi.",
        price: 0,
        
        timeline: "Individual",
        note: "Narxga qo'shiladi"
    }
};

export function formatPrice(price: number) {
    if (price >= 1000000) {
        return `${price.toLocaleString('fr-FR').replace(/\s/g, ' ')} so'm`;
    }
    return `${price.toLocaleString('fr-FR')} so'm`;
}


export const comparisonData = [
  { 
    feature: 'Neyming',
    competitors: {
        jon: `${formatPrice(serviceDetails.naming.price)}`,
        mano: `${formatPrice(40000000)}`,
        abba: `${formatPrice(38000000)}`,
        mountain: `${formatPrice(35000000)}`,
    }
  },
  { 
    feature: 'Logotip va stil',
    competitors: {
        jon: `${formatPrice(serviceDetails.logo.price)}`,
        mano: `${formatPrice(82000000)}`,
        abba: `${formatPrice(78000000)}`,
        mountain: `${formatPrice(71500000)}`,
    }
  },
   { 
    feature: 'Brendbuk',
    competitors: {
        jon: `${formatPrice(serviceDetails.brandbook.price)}`,
        mano: `${formatPrice(42000000)}`,
        abba: `${formatPrice(40000000)}`,
        mountain: `${formatPrice(50000000)}`,
    }
  },
  { 
    feature: 'Qadoq dizayni',
    competitors: {
        jon: `${formatPrice(serviceDetails.packaging.price)}`,
        mano: `${formatPrice(120000000)}`,
        abba: `${formatPrice(110000000)}`,
        mountain: `${formatPrice(150000000)}`,
    }
  },
  { 
    feature: 'Brend-strategiya',
    competitors: {
        jon: `${formatPrice(serviceDetails.strategy.price)}`,
        mano: `${formatPrice(240000000)}`,
        abba: null,
        mountain: false,
    }
  },
   { 
    feature: 'Kommunikatsion strategiya',
    competitors: {
        jon: `${formatPrice(serviceDetails.commStrategy.price)}`,
        mano: `${formatPrice(190000000)}`,
        abba: null,
        mountain: false,
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
        jon: true,
        mano: false,
        abba: false,
        mountain: false,
    }
  },
  { 
    feature: 'Shaffof jarayon va doimiy aloqa', 
    isBenefit: true,
    competitors: {
        jon: true,
        mano: true,
        abba: null,
        mountain: true,
    }
  },
   { 
    feature: 'PCG a\'zolari uchun -50% chegirma', 
    isBenefit: true,
    competitors: {
        jon: true,
        mano: false,
        abba: false,
        mountain: false,
    }
  },
];


export type SelectedServices = Record<keyof typeof serviceDetails, boolean>;

export const packageDiscountThreshold = 3;
export const packageDiscount = 0.20; // 20%
export const urgencySurcharge = 0.50;
export const ndaSurcharge = 0.25;
export const bonusThreshold = 18750000;
export const bonusDescription = "Biznes vizitka dizayni sovg'a tariqasida";

const mainServices: (keyof SelectedServices)[] = ['naming', 'logo', 'designSystem', 'brandbook', 'packaging'];


interface PackageSelections {
    selectedServices: SelectedServices;
}

export interface PriceDetails {
    base: number;
    final: number;
    discountApplied: string;
    discountValue: number;
    savings: number;
    bonus: string | null;
    surcharges: { name: string, value: number }[];
}


export const calculatePackagePrice = (selections: PackageSelections): PriceDetails => {
    const { selectedServices } = selections;
    
    let basePrice = 0;
    let mainServicesCount = 0;
    
    // Exclude percentage-based services from initial sum
    const percentageServices: (keyof SelectedServices)[] = ['urgency', 'nda'];

    for (const serviceKey in selectedServices) {
        const key = serviceKey as keyof SelectedServices;
        if (
            serviceDetails[key] && 
            selectedServices[key] &&
            !percentageServices.includes(key)
        ) {
            basePrice += serviceDetails[key].price;
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
        surcharges.push({ name: 'Shoshilinch uchun ustama (+50%)', value: surchargeAmount });
    }

    if (selectedServices.nda) {
        const surchargeAmount = basePrice * ndaSurcharge;
        priceAfterSurcharges += surchargeAmount;
        surcharges.push({ name: 'NDA uchun ustama (+25%)', value: surchargeAmount });
    }
    
    let priceAfterDiscount = priceAfterSurcharges;
    let discountValue = 0;
    let discountType = "";
    
    if (mainServicesCount >= packageDiscountThreshold) {
        const discountAmount = priceAfterSurcharges * packageDiscount;
        priceAfterDiscount -= discountAmount;
        discountValue = packageDiscount;
        discountType = `Paketli chegirma (${mainServicesCount} ta xizmat) -20%`;
    }
    
    const finalPrice = priceAfterDiscount;
    const savings = priceAfterSurcharges - finalPrice;

    const bonus = finalPrice > bonusThreshold ? bonusDescription : null;

    return {
        base: basePrice,
        final: finalPrice,
        discountApplied: discountType,
        discountValue: discountValue,
        savings,
        bonus,
        surcharges,
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

    const { discountApplied, bonus, surcharges } = calculatePackagePrice(selections);
    
    if (surcharges.length > 0) {
        const surchargeSummary = surcharges.map(s => s.name).join(', ');
        summary += ` | Qo'shimcha shartlar: ${surchargeSummary}`;
    }

    if (discountApplied) {
        summary += ` | Chegirma: ${discountApplied}`;
    }
    
    if (bonus) {
        summary += ` | Bonus: ${bonus}`;
    }

    return summary;
}
