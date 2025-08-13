export const servicePrices = {
    naming: 550,
    logo: 550,
    style: 850,
    brandbook: 990,
};

export const paymentDiscounts = {
    '100': 0.30,
    '50': 0.15,
    'none': 0,
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
    paymentOption: string;
    isPcgMember: boolean;
}

export const calculatePackagePrice = (selections: PackageSelections) => {
    const { selectedServices, paymentOption, isPcgMember } = selections;
    
    let basePrice = 0;
    if (selectedServices.naming) basePrice += servicePrices.naming;
    if (selectedServices.logo) basePrice += servicePrices.logo;
    if (selectedServices.style) basePrice += servicePrices.style;
    if (selectedServices.brandbook) basePrice += servicePrices.brandbook;

    // Logo is the base, so at least its price must be there for discounts
    const canApplyDiscount = selectedServices.logo && basePrice > servicePrices.logo;

    let paymentDiscountValue = paymentDiscounts[paymentOption as keyof typeof paymentDiscounts] || 0;
    let bestDiscount = 0;
    let discountType = "Chegirmasiz";

    if (canApplyDiscount) {
        bestDiscount = paymentDiscountValue;
        if (paymentOption !== 'none') {
            discountType = `${(paymentDiscountValue * 100)}% chegirma (${paymentOption}% oldindan to'lov)`;
        }

        if (isPcgMember && pcgDiscount > bestDiscount) {
            bestDiscount = pcgDiscount;
            discountType = 'PCG Tez Natija 3 uchun -50% chegirma';
        }
    }
    
    const finalPrice = basePrice * (1 - bestDiscount);

    return {
        base: basePrice,
        final: finalPrice,
        discountApplied: finalPrice < basePrice ? discountType : 'Chegirma qo\'llanilmadi',
        discountValue: bestDiscount,
    };
}

export const generateSummary = (selections: PackageSelections) => {
    const { selectedServices, paymentOption } = selections;
    
    const services = [];
    if (selectedServices.naming) services.push('Naming');
    if (selectedServices.logo) services.push('Logo');
    if (selectedServices.style) services.push('Korporativ uslub');
    if (selectedServices.brandbook) services.push('Brandbook');

    let summary = `Tanlangan xizmatlar: ${services.join(', ') || 'Yo\'q'}`;

    const { discountApplied } = calculatePackagePrice(selections);
    
    let paymentText = "Bo'lib to'lash";
    if (paymentOption === '100') paymentText = "100% oldindan";
    if (paymentOption === '50') paymentText = "50% oldindan";
    
    summary += ` | To'lov: ${paymentText}`;
    summary += ` | Chegirma: ${discountApplied}`;

    return summary;
}
