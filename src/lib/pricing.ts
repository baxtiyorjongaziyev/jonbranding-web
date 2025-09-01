

export const servicePrices = {
    naming: 7150000,
    logo: 7150000,
    style: 11050000,
    brandbook: 12870000,
};

export const pcgDiscount = 0.50;
export const bonusThreshold = 19500000;
export const bonusDescription = "Biznes vizitka dizayni sovg'a tariqasida";

interface SelectedServices {
    naming: boolean;
    logo: boolean;
    style: boolean;
    brandbook: boolean;
}

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
    if (selectedServices.naming) basePrice += servicePrices.naming;
    if (selectedServices.logo) basePrice += servicePrices.logo;
    if (selectedServices.style) basePrice += servicePrices.style;
    if (selectedServices.brandbook) basePrice += servicePrices.brandbook;

    let discountValue = 0;
    let discountType = "";

    // Apply discount only if PCG member and base price is over the logo price
    if (isPcgMember && basePrice > servicePrices.logo) {
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
    if (selectedServices.naming) services.push('Naming');
    if (selectedServices.logo) services.push('Logo');
    if (selectedServices.style) services.push('Korporativ uslub');
    if (selectedServices.brandbook) services.push('Brandbook');

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
