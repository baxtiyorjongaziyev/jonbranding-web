import { logger } from '@/lib/logger';
import { findAffiliateByPromoCode, createReferral } from '@/lib/affiliate/store';
import { serviceFromHint } from '@/lib/affiliate/payouts';
import { normalizePhone } from '@/lib/lead-contact';
import { type LeadData, type AmoCrmLeadResult } from './lead-types';

export async function attributeAffiliateReferral(
  leadData: LeadData,
  amoCrmResult?: AmoCrmLeadResult
): Promise<void> {
  try {
    const promoRaw = String(leadData.promoCode || '').trim();
    if (!promoRaw) return;

    const affiliate = await findAffiliateByPromoCode(promoRaw.toUpperCase());
    if (!affiliate) return;

    // Prefer stable, locale-independent calculator IDs (serviceKeys, e.g.
    // "logoPremium") over localized display text (packageSummary), which
    // may not tokenize to a known service in every language/script.
    const serviceHintSource =
      (Array.isArray(leadData.serviceKeys) && leadData.serviceKeys.length
        ? leadData.serviceKeys.join(',')
        : '') ||
      leadData.packageSummary ||
      leadData.role ||
      '';
    const hint = serviceFromHint(serviceHintSource);

    if (!amoCrmResult?.leadId) {
      logger.warn('Affiliate referral created without amoCRM lead id — will not auto-match on webhook', {
        promoCode: affiliate.promoCode,
      });
    }

    await createReferral({
      affiliateId: affiliate.id,
      amocrmLeadId: amoCrmResult?.leadId ?? null,
      leadName: String(leadData.fullName || 'Mijoz'),
      leadPhone: normalizePhone(leadData.phone || '') || '',
      serviceHint: hint ?? (serviceHintSource || null),
    });

    logger.info('Affiliate referral recorded', {
      promoCode: affiliate.promoCode,
      leadId: amoCrmResult?.leadId ?? null,
    });
  } catch (error) {
    logger.error('Affiliate attribution failed', {
      reason: error instanceof Error ? error.message : String(error),
    });
  }
}
