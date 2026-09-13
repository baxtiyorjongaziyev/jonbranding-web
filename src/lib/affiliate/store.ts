import { getServiceClient } from '@/lib/supabase/service';
import { payoutAmount, type PayoutService } from '@/lib/affiliate/payouts';

export type Affiliate = {
  id: string;
  fullName: string;
  phone: string;
  telegramUsername: string | null;
  promoCode: string;
  accessToken: string;
  createdAt: string;
};

export type Referral = {
  id: string;
  affiliateId: string;
  amocrmLeadId: number | null;
  leadName: string;
  leadPhone: string;
  serviceHint: string | null;
  status: 'new' | 'won' | 'lost';
  createdAt: string;
  wonAt: string | null;
};

export type Payout = {
  id: string;
  referralId: string;
  affiliateId: string;
  service: string;
  amount: number;
  paid: boolean;
  paidAt: string | null;
  createdAt: string;
};

export type DashboardStats = {
  totalReferrals: number;
  wonReferrals: number;
  totalBonus: number;
  paidBonus: number;
  pendingBonus: number;
};

export type AffiliateWithStats = Affiliate & {
  referralCount: number;
  totalBonus: number;
};

export type PayoutRow = Payout & {
  affiliatePromoCode: string;
  affiliateName: string;
  leadName: string;
};

function mapAffiliate(r: any): Affiliate {
  return {
    id: r.id,
    fullName: r.full_name,
    phone: r.phone,
    telegramUsername: r.telegram_username ?? null,
    promoCode: r.promo_code,
    accessToken: r.access_token,
    createdAt: r.created_at,
  };
}

function mapReferral(r: any): Referral {
  return {
    id: r.id,
    affiliateId: r.affiliate_id,
    amocrmLeadId: r.amocrm_lead_id ?? null,
    leadName: r.lead_name,
    leadPhone: r.lead_phone,
    serviceHint: r.service_hint ?? null,
    status: r.status,
    createdAt: r.created_at,
    wonAt: r.won_at ?? null,
  };
}

function mapPayout(r: any): Payout {
  return {
    id: r.id,
    referralId: r.referral_id,
    affiliateId: r.affiliate_id,
    service: r.service,
    amount: r.amount,
    paid: r.paid,
    paidAt: r.paid_at ?? null,
    createdAt: r.created_at,
  };
}

export async function findAffiliateByPromoCode(code: string): Promise<Affiliate | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db
    .from('affiliates')
    .select('*')
    .eq('promo_code', code.trim().toUpperCase())
    .maybeSingle();
  if (error || !data) return null;
  return mapAffiliate(data);
}

export async function findAffiliateByToken(token: string): Promise<Affiliate | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db.from('affiliates').select('*').eq('access_token', token).maybeSingle();
  if (error || !data) return null;
  return mapAffiliate(data);
}

export async function findAffiliateByPhone(phone: string): Promise<Affiliate | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db.from('affiliates').select('*').eq('phone', phone).maybeSingle();
  if (error || !data) return null;
  return mapAffiliate(data);
}

export async function isPromoCodeTaken(code: string): Promise<boolean> {
  const db = getServiceClient();
  if (!db) return false;
  const { data } = await db
    .from('affiliates')
    .select('id')
    .eq('promo_code', code.trim().toUpperCase())
    .maybeSingle();
  return Boolean(data);
}

export async function createAffiliate(input: {
  fullName: string;
  phone: string;
  telegramUsername?: string;
  promoCode: string;
  accessToken: string;
}): Promise<Affiliate | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db
    .from('affiliates')
    .insert({
      full_name: input.fullName,
      phone: input.phone,
      telegram_username: input.telegramUsername ?? null,
      promo_code: input.promoCode,
      access_token: input.accessToken,
    })
    .select('*')
    .single();
  if (error || !data) return null;
  return mapAffiliate(data);
}

export async function createReferral(input: {
  affiliateId: string;
  amocrmLeadId: number | null;
  leadName: string;
  leadPhone: string;
  serviceHint: string | null;
}): Promise<Referral | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db
    .from('referrals')
    .insert({
      affiliate_id: input.affiliateId,
      amocrm_lead_id: input.amocrmLeadId,
      lead_name: input.leadName,
      lead_phone: input.leadPhone,
      service_hint: input.serviceHint,
    })
    .select('*')
    .single();
  if (error || !data) return null;
  return mapReferral(data);
}

export async function findReferralByLeadId(amocrmLeadId: number): Promise<Referral | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db
    .from('referrals')
    .select('*')
    .eq('amocrm_lead_id', amocrmLeadId)
    .maybeSingle();
  if (error || !data) return null;
  return mapReferral(data);
}

export async function markReferralWon(referralId: string): Promise<void> {
  const db = getServiceClient();
  if (!db) return;
  await db
    .from('referrals')
    .update({ status: 'won', won_at: new Date().toISOString() })
    .eq('id', referralId);
}

export async function markReferralLost(referralId: string): Promise<void> {
  const db = getServiceClient();
  if (!db) return;
  await db.from('referrals').update({ status: 'lost' }).eq('id', referralId);
}

export async function createPayoutIfAbsent(input: {
  referralId: string;
  affiliateId: string;
  service: PayoutService;
}): Promise<Payout | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db
    .from('payouts')
    .insert({
      referral_id: input.referralId,
      affiliate_id: input.affiliateId,
      service: input.service,
      amount: payoutAmount(input.service),
      paid: false,
    })
    .select('*')
    .single();
  if (error) {
    // 23505 = unique_violation → payout allaqachon mavjud, bu normal (idempotentlik).
    return null;
  }
  return data ? mapPayout(data) : null;
}

function computeStats(referrals: Referral[], payouts: Payout[]): DashboardStats {
  const totalBonus = payouts.reduce((sum, p) => sum + p.amount, 0);
  const paidBonus = payouts.filter((p) => p.paid).reduce((sum, p) => sum + p.amount, 0);
  return {
    totalReferrals: referrals.length,
    wonReferrals: referrals.filter((r) => r.status === 'won').length,
    totalBonus,
    paidBonus,
    pendingBonus: totalBonus - paidBonus,
  };
}

export async function getAffiliateDashboard(affiliateId: string): Promise<{
  referrals: Referral[];
  payouts: Payout[];
  stats: DashboardStats;
}> {
  const db = getServiceClient();
  if (!db) return { referrals: [], payouts: [], stats: computeStats([], []) };

  const [refRes, payRes] = await Promise.all([
    db.from('referrals').select('*').eq('affiliate_id', affiliateId).order('created_at', { ascending: false }),
    db.from('payouts').select('*').eq('affiliate_id', affiliateId),
  ]);

  const referrals = (refRes.data ?? []).map(mapReferral);
  const payouts = (payRes.data ?? []).map(mapPayout);
  return { referrals, payouts, stats: computeStats(referrals, payouts) };
}

export async function listAffiliatesWithStats(): Promise<AffiliateWithStats[]> {
  const db = getServiceClient();
  if (!db) return [];
  const [affRes, refRes, payRes] = await Promise.all([
    db.from('affiliates').select('*').order('created_at', { ascending: false }),
    db.from('referrals').select('affiliate_id'),
    db.from('payouts').select('affiliate_id, amount'),
  ]);
  const affiliates = (affRes.data ?? []).map(mapAffiliate);
  const refCounts = new Map<string, number>();
  for (const r of refRes.data ?? []) refCounts.set(r.affiliate_id, (refCounts.get(r.affiliate_id) ?? 0) + 1);
  const bonusSums = new Map<string, number>();
  for (const p of payRes.data ?? []) bonusSums.set(p.affiliate_id, (bonusSums.get(p.affiliate_id) ?? 0) + p.amount);
  return affiliates.map((a) => ({
    ...a,
    referralCount: refCounts.get(a.id) ?? 0,
    totalBonus: bonusSums.get(a.id) ?? 0,
  }));
}

export async function listPayouts(filter: 'all' | 'unpaid' | 'paid'): Promise<PayoutRow[]> {
  const db = getServiceClient();
  if (!db) return [];
  let query = db
    .from('payouts')
    .select('*, affiliates(promo_code, full_name), referrals(lead_name)')
    .order('created_at', { ascending: false });
  if (filter === 'unpaid') query = query.eq('paid', false);
  if (filter === 'paid') query = query.eq('paid', true);
  const { data, error } = await query;
  if (error || !data) return [];
  return data.map((r: any) => ({
    ...mapPayout(r),
    affiliatePromoCode: r.affiliates?.promo_code ?? '',
    affiliateName: r.affiliates?.full_name ?? '',
    leadName: r.referrals?.lead_name ?? '',
  }));
}

export async function markPayoutPaid(payoutId: string): Promise<void> {
  const db = getServiceClient();
  if (!db) return;
  await db.from('payouts').update({ paid: true, paid_at: new Date().toISOString() }).eq('id', payoutId);
}
