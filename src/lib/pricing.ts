export const servicePrices = {
    naming: 550,
    logo: 550,
    style: 850,
    brandbook: 990,
};

export const basePackages = [
    { id: 'A', name: 'Logo', price: servicePrices.logo },
    { id: 'B', name: 'Logo + Korporativ uslub', price: servicePrices.logo + servicePrices.style },
    { id: 'C', name: 'Logo + Korporativ uslub + Brandbook', price: servicePrices.logo + servicePrices.style + servicePrices.brandbook },
];

export const paymentDiscounts = {
    '100': 0.30,
    '50': 0.15,
    'none': 0,
};

export const pcgDiscount = 0.50;

interface PackageSelections {
    selectedPackage: string;
    includeNaming: boolean;
    paymentOption: string;
    isPcgMember: boolean;
}

export const calculatePackagePrice = (selections: PackageSelections) => {
    const { selectedPackage, includeNaming, paymentOption, isPcgMember } = selections;
    const currentPackage = basePackages.find(p => p.id === selectedPackage);
    if (!currentPackage) return { base: 0, final: 0, discountApplied: '', discountValue: 0 };

    let basePrice = currentPackage.price;
    if (includeNaming) {
        basePrice += servicePrices.naming;
    }

    let paymentDiscountValue = paymentDiscounts[paymentOption as keyof typeof paymentDiscounts] || 0;
    let bestDiscount = paymentDiscountValue;
    let discountType = `${(paymentDiscountValue * 100)}% chegirma (${paymentOption}% oldindan to'lov)`;

    if (paymentOption === 'none') {
        discountType = "Chegirmasiz";
    }

    if (isPcgMember && pcgDiscount > bestDiscount) {
        bestDiscount = pcgDiscount;
        discountType = 'PCG Tez Natija 3 uchun -50% chegirma';
    }
    
    const finalPrice = basePrice * (1 - bestDiscount);

    return {
        base: basePrice,
        final: finalPrice,
        discountApplied: discountType,
        discountValue: bestDiscount,
    };
}

export const generateSummary = (selections: PackageSelections) => {
    const { selectedPackage, includeNaming, paymentOption } = selections;
    const pkg = basePackages.find(p => p.id === selectedPackage);
    let summary = `Paket: ${pkg?.name || 'Noma\'lum'}`;
    if (includeNaming) summary += ' + Naming';

    const { discountApplied } = calculatePackagePrice(selections);
    
    let paymentText = "Bo'lib to'lash";
    if (paymentOption === '100') paymentText = "100% oldindan";
    if (paymentOption === '50') paymentText = "50% oldindan";
    
    summary += ` | To'lov: ${paymentText}`;
    summary += ` | Chegirma: ${discountApplied}`;

    return summary;
}
