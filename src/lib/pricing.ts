export const servicePrices = {
    naming: 550,
    logo: 550,
    style: 850,
    brandbook: 990,
};

export const pcgDiscount = 0.50;

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

    if (isPcgMember) {
        discountValue = pcgDiscount;
        discountType = 'PCG Tez Natija 3 uchun -50% chegirma';
    }
    
    const finalPrice = basePrice * (1 - discountValue);
    const savings = basePrice - finalPrice;

    return {
        base: basePrice,
        final: finalPrice,
        discountApplied: discountType,
        discountValue: discountValue,
        savings,
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

    const { discountApplied } = calculatePackagePrice(selections);
    
    if (discountApplied) {
        summary += ` | Chegirma: ${discountApplied}`;
    }

    return summary;
}
