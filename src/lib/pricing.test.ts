import { describe, it, expect } from 'vitest';
import { generateSummary, calculatePackagePrice } from './pricing';

describe('generateSummary', () => {
    it('should generate an empty string when no services are selected', () => {
        const selections = {
            selectedServices: {}
        };
        expect(generateSummary(selections)).toBe('');
    });

    it('should generate a summary for a single selected service in default language (uz)', () => {
        const selections = {
            selectedServices: {
                audit: true
            }
        };
        expect(generateSummary(selections)).toBe('Logo Auditi');
    });

    it('should generate a summary for a single selected service in ru', () => {
        const selections = {
            selectedServices: {
                audit: true
            }
        };
        expect(generateSummary(selections, 'ru')).toBe('Аудит логотипа');
    });

    it('should generate a summary for multiple selected services', () => {
        const selections = {
            selectedServices: {
                audit: true,
                namingCheck: true
            }
        };
        expect(generateSummary(selections, 'en')).toBe('Logo Audit, Naming Check');
    });

    it('should filter out unselected services', () => {
        const selections = {
            selectedServices: {
                audit: true,
                namingCheck: false,
                consultation: true
            }
        };
        expect(generateSummary(selections, 'en')).toBe('Logo Audit, Consultation');
    });

    it('should include promo code in default language (uz)', () => {
        const selections = {
            selectedServices: {
                audit: true
            },
            promoCode: 'DISCOUNT20'
        };
        expect(generateSummary(selections)).toBe('Logo Auditi (Promokod: DISCOUNT20)');
    });

    it('should include promo code in other languages (en)', () => {
        const selections = {
            selectedServices: {
                audit: true
            },
            promoCode: 'DISCOUNT20'
        };
        expect(generateSummary(selections, 'en')).toBe('Logo Audit (Promo Code: DISCOUNT20)');
    });

    it('should handle missing service in dictionary gracefully', () => {
        const selections = {
            selectedServices: {
                unknownService: true
            }
        };
        expect(generateSummary(selections)).toBe('');
    });

    it('should handle undefined promoCode', () => {
        const selections = {
            selectedServices: {
                audit: true
            },
            promoCode: undefined
        };
        expect(generateSummary(selections)).toBe('Logo Auditi');
    });
});

describe('calculatePackagePrice promo code validation', () => {
    const baseSelections = {
        selectedServices: { logoStandard: true },
        discountType: 'none',
    };

    it('rejects an arbitrary code (no discount applied)', () => {
        const result = calculatePackagePrice({ ...baseSelections, promoCode: 'RANDOMCODE' });
        expect(result.isPromoApplied).toBe(false);
        expect(result.discountApplied).toHaveLength(0);
    });

    it('rejects an empty code', () => {
        const result = calculatePackagePrice({ ...baseSelections, promoCode: '' });
        expect(result.isPromoApplied).toBe(false);
    });

    it.each(['RAMAZON', 'PCG', 'TEZNATIJA', 'KURSDOSH', 'SALOM', 'ISTISNO'])(
        'accepts valid code %s (case-insensitive) and applies a discount',
        (code) => {
            const result = calculatePackagePrice({ ...baseSelections, promoCode: code.toLowerCase() });
            expect(result.isPromoApplied).toBe(true);
            expect(result.discountApplied.length).toBeGreaterThan(0);
            expect(result.final).toBeLessThan(result.base);
        }
    );
});
