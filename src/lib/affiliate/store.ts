import 'server-only';
import { randomUUID } from 'node:crypto';
import { getServiceClient } from '@/lib/supabase/service';
import { ensureTursoSchema, getTursoClient, isTursoConfigured } from '@/lib/turso';
import { logger } from '@/lib/logger';
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

export type AffiliateSafe = {
  id: string;
  fullName: string;
  phone: string;
  promoCode: string;
  createdAt: string;
};

export type AffiliateWithStats = AffiliateSafe & {
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
    id: String(r.id),
    fullName: String(r.full_name),
    phone: String(r.phone),
    telegramUsername: r.telegram_username ? String(r.telegram_username) : null,
    promoCode: String(r.promo_code),
    accessToken: String(r.access_token),
    createdAt: String(r.created_at),
  };
}

function mapAffiliateSafe(r: any): AffiliateSafe {
  return {
    id: String(r.id),
    fullName: String(r.full_name),
    phone: String(r.phone),
    promoCode: String(r.promo_code),
    createdAt: String(r.created_at),
  };
}

function mapReferral(r: any): Referral {
  return {
    id: String(r.id),
    affiliateId: String(r.affiliate_id),
    amocrmLeadId: r.amocrm_lead_id !== null && r.amocrm_lead_id !== undefined ? Number(r.amocrm_lead_id) : null,
    leadName: String(r.lead_name),
    leadPhone: String(r.lead_phone),
    serviceHint: r.service_hint ? String(r.service_hint) : null,
    status: (r.status as 'new' | 'won' | 'lost') || 'new',
    createdAt: String(r.created_at),
    wonAt: r.won_at ? String(r.won_at) : null,
  };
}

function mapPayout(r: any): Payout {
  return {
    id: String(r.id),
    referralId: String(r.referral_id),
    affiliateId: String(r.affiliate_id),
    service: String(r.service),
    amount: Number(r.amount),
    paid: Boolean(r.paid),
    paidAt: r.paid_at ? String(r.paid_at) : null,
    createdAt: String(r.created_at),
  };
}

export async function findAffiliateByPromoCode(code: string): Promise<Affiliate | null> {
  const cleanCode = code.trim().toUpperCase();
  if (isTursoConfigured()) {
    await ensureTursoSchema();
    const client = getTursoClient();
    if (!client) return null;
    const res = await client.execute({
      sql: 'SELECT * FROM affiliates WHERE promo_code = ? LIMIT 1',
      args: [cleanCode],
    });
    if (!res.rows.length) return null;
    return mapAffiliate(res.rows[0]);
  }

  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db
    .from('affiliates')
    .select('*')
    .eq('promo_code', cleanCode)
    .maybeSingle();
  if (error || !data) return null;
  return mapAffiliate(data);
}

export async function findAffiliateByToken(token: string): Promise<Affiliate | null> {
  const cleanToken = token.trim();
  if (isTursoConfigured()) {
    await ensureTursoSchema();
    const client = getTursoClient();
    if (!client) return null;
    const res = await client.execute({
      sql: 'SELECT * FROM affiliates WHERE access_token = ? LIMIT 1',
      args: [cleanToken],
    });
    if (!res.rows.length) return null;
    return mapAffiliate(res.rows[0]);
  }

  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db.from('affiliates').select('*').eq('access_token', cleanToken).maybeSingle();
  if (error || !data) return null;
  return mapAffiliate(data);
}

export async function findAffiliateByPhone(phone: string): Promise<Affiliate | null> {
  const cleanPhone = phone.trim();
  if (isTursoConfigured()) {
    await ensureTursoSchema();
    const client = getTursoClient();
    if (!client) return null;
    const res = await client.execute({
      sql: 'SELECT * FROM affiliates WHERE phone = ? LIMIT 1',
      args: [cleanPhone],
    });
    if (!res.rows.length) return null;
    return mapAffiliate(res.rows[0]);
  }

  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db.from('affiliates').select('*').eq('phone', cleanPhone).maybeSingle();
  if (error || !data) return null;
  return mapAffiliate(data);
}

export async function isPromoCodeTaken(code: string): Promise<boolean> {
  const cleanCode = code.trim().toUpperCase();
  if (isTursoConfigured()) {
    await ensureTursoSchema();
    const client = getTursoClient();
    if (!client) return false;
    const res = await client.execute({
      sql: 'SELECT id FROM affiliates WHERE promo_code = ? LIMIT 1',
      args: [cleanCode],
    });
    return res.rows.length > 0;
  }

  const db = getServiceClient();
  if (!db) return false;
  const { data } = await db
    .from('affiliates')
    .select('id')
    .eq('promo_code', cleanCode)
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
  if (isTursoConfigured()) {
    await ensureTursoSchema();
    const client = getTursoClient();
    if (!client) return null;
    const id = randomUUID();
    const now = new Date().toISOString();
    try {
      await client.execute({
        sql: `INSERT INTO affiliates (id, full_name, phone, telegram_username, promo_code, access_token, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          input.fullName,
          input.phone,
          input.telegramUsername ?? null,
          input.promoCode,
          input.accessToken,
          now,
        ],
      });
      return {
        id,
        fullName: input.fullName,
        phone: input.phone,
        telegramUsername: input.telegramUsername ?? null,
        promoCode: input.promoCode,
        accessToken: input.accessToken,
        createdAt: now,
      };
    } catch (err: any) {
      if (!String(err?.message || '').includes('UNIQUE constraint failed')) {
        logger.error('Affiliate insert failed (Turso)', { message: err?.message });
      }
      return null;
    }
  }

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
  if (error) {
    if (error.code !== '23505') {
      logger.error('Affiliate insert failed', { code: error.code, message: error.message });
    }
    return null;
  }
  if (!data) return null;
  return mapAffiliate(data);
}

export async function createReferral(input: {
  affiliateId: string;
  amocrmLeadId: number | null;
  leadName: string;
  leadPhone: string;
  serviceHint: string | null;
}): Promise<Referral | null> {
  if (isTursoConfigured()) {
    await ensureTursoSchema();
    const client = getTursoClient();
    if (!client) return null;
    const id = randomUUID();
    const now = new Date().toISOString();
    try {
      await client.execute({
        sql: `INSERT INTO referrals (id, affiliate_id, amocrm_lead_id, lead_name, lead_phone, service_hint, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'new', ?)`,
        args: [
          id,
          input.affiliateId,
          input.amocrmLeadId,
          input.leadName,
          input.leadPhone,
          input.serviceHint,
          now,
        ],
      });
      return {
        id,
        affiliateId: input.affiliateId,
        amocrmLeadId: input.amocrmLeadId,
        leadName: input.leadName,
        leadPhone: input.leadPhone,
        serviceHint: input.serviceHint,
        status: 'new',
        createdAt: now,
        wonAt: null,
      };
    } catch (err: any) {
      logger.error('Referral insert failed (Turso)', { message: err?.message });
      return null;
    }
  }

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
  if (isTursoConfigured()) {
    await ensureTursoSchema();
    const client = getTursoClient();
    if (!client) return null;
    const res = await client.execute({
      sql: 'SELECT * FROM referrals WHERE amocrm_lead_id = ? LIMIT 1',
      args: [amocrmLeadId],
    });
    if (!res.rows.length) return null;
    return mapReferral(res.rows[0]);
  }

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
  const wonAt = new Date().toISOString();
  if (isTursoConfigured()) {
    await ensureTursoSchema();
    const client = getTursoClient();
    if (!client) return;
    await client.execute({
      sql: `UPDATE referrals SET status = 'won', won_at = ? WHERE id = ?`,
      args: [wonAt, referralId],
    });
    return;
  }

  const db = getServiceClient();
  if (!db) return;
  await db
    .from('referrals')
    .update({ status: 'won', won_at: wonAt })
    .eq('id', referralId);
}

export async function markReferralLost(referralId: string): Promise<void> {
  if (isTursoConfigured()) {
    await ensureTursoSchema();
    const client = getTursoClient();
    if (!client) return;
    await client.execute({
      sql: `UPDATE referrals SET status = 'lost' WHERE id = ?`,
      args: [referralId],
    });
    return;
  }

  const db = getServiceClient();
  if (!db) return;
  await db.from('referrals').update({ status: 'lost' }).eq('id', referralId);
}

export async function createPayoutIfAbsent(input: {
  referralId: string;
  affiliateId: string;
  service: PayoutService;
}): Promise<Payout | null> {
  const amount = payoutAmount(input.service);

  if (isTursoConfigured()) {
    await ensureTursoSchema();
    const client = getTursoClient();
    if (!client) return null;
    const existing = await client.execute({
      sql: 'SELECT * FROM payouts WHERE referral_id = ? LIMIT 1',
      args: [input.referralId],
    });
    if (existing.rows.length) return null;

    const id = randomUUID();
    const now = new Date().toISOString();
    try {
      await client.execute({
        sql: `INSERT INTO payouts (id, referral_id, affiliate_id, service, amount, paid, created_at) VALUES (?, ?, ?, ?, ?, 0, ?)`,
        args: [id, input.referralId, input.affiliateId, input.service, amount, now],
      });
      return {
        id,
        referralId: input.referralId,
        affiliateId: input.affiliateId,
        service: input.service,
        amount,
        paid: false,
        paidAt: null,
        createdAt: now,
      };
    } catch (err: any) {
      if (!String(err?.message || '').includes('UNIQUE constraint failed')) {
        logger.error('Payout insert failed (Turso)', { message: err?.message });
      }
      return null;
    }
  }

  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db
    .from('payouts')
    .insert({
      referral_id: input.referralId,
      affiliate_id: input.affiliateId,
      service: input.service,
      amount,
      paid: false,
    })
    .select('*')
    .single();
  if (error) {
    if (error.code !== '23505') {
      logger.error('Payout insert failed', {
        referralId: input.referralId,
        code: error.code,
        message: error.message,
      });
    }
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
  if (isTursoConfigured()) {
    await ensureTursoSchema();
    const client = getTursoClient();
    if (!client) return { referrals: [], payouts: [], stats: computeStats([], []) };

    const [refRes, payRes] = await Promise.all([
      client.execute({
        sql: 'SELECT * FROM referrals WHERE affiliate_id = ? ORDER BY created_at DESC',
        args: [affiliateId],
      }),
      client.execute({
        sql: 'SELECT * FROM payouts WHERE affiliate_id = ?',
        args: [affiliateId],
      }),
    ]);
    const referrals = refRes.rows.map(mapReferral);
    const payouts = payRes.rows.map(mapPayout);
    return { referrals, payouts, stats: computeStats(referrals, payouts) };
  }

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
  if (isTursoConfigured()) {
    await ensureTursoSchema();
    const client = getTursoClient();
    if (!client) return [];

    const [affRes, refRes, payRes] = await Promise.all([
      client.execute('SELECT id, full_name, phone, promo_code, created_at FROM affiliates ORDER BY created_at DESC'),
      client.execute('SELECT affiliate_id FROM referrals'),
      client.execute('SELECT affiliate_id, amount FROM payouts'),
    ]);

    const affiliates = affRes.rows.map(mapAffiliateSafe);
    const refCounts = new Map<string, number>();
    for (const r of refRes.rows) {
      const affId = String(r.affiliate_id);
      refCounts.set(affId, (refCounts.get(affId) ?? 0) + 1);
    }
    const bonusSums = new Map<string, number>();
    for (const p of payRes.rows) {
      const affId = String(p.affiliate_id);
      bonusSums.set(affId, (bonusSums.get(affId) ?? 0) + Number(p.amount));
    }
    return affiliates.map((a) => ({
      ...a,
      referralCount: refCounts.get(a.id) ?? 0,
      totalBonus: bonusSums.get(a.id) ?? 0,
    }));
  }

  const db = getServiceClient();
  if (!db) return [];
  const [affRes, refRes, payRes] = await Promise.all([
    db
      .from('affiliates')
      .select('id, full_name, phone, promo_code, created_at')
      .order('created_at', { ascending: false }),
    db.from('referrals').select('affiliate_id'),
    db.from('payouts').select('affiliate_id, amount'),
  ]);
  const affiliates = (affRes.data ?? []).map(mapAffiliateSafe);
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
  if (isTursoConfigured()) {
    await ensureTursoSchema();
    const client = getTursoClient();
    if (!client) return [];

    let sql = `
      SELECT 
        p.id, p.referral_id, p.affiliate_id, p.service, p.amount, p.paid, p.paid_at, p.created_at,
        a.promo_code as affiliate_promo_code, a.full_name as affiliate_name,
        r.lead_name
      FROM payouts p
      LEFT JOIN affiliates a ON p.affiliate_id = a.id
      LEFT JOIN referrals r ON p.referral_id = r.id
    `;
    const args: any[] = [];
    if (filter === 'unpaid') {
      sql += ' WHERE p.paid = 0';
    } else if (filter === 'paid') {
      sql += ' WHERE p.paid = 1';
    }
    sql += ' ORDER BY p.created_at DESC';

    const res = await client.execute({ sql, args });
    return res.rows.map((r: any) => ({
      id: String(r.id),
      referralId: String(r.referral_id),
      affiliateId: String(r.affiliate_id),
      service: String(r.service),
      amount: Number(r.amount),
      paid: Boolean(r.paid),
      paidAt: r.paid_at ? String(r.paid_at) : null,
      createdAt: String(r.created_at),
      affiliatePromoCode: String(r.affiliate_promo_code ?? ''),
      affiliateName: String(r.affiliate_name ?? ''),
      leadName: String(r.lead_name ?? ''),
    }));
  }

  const db = getServiceClient();
  if (!db) return [];
  let query = db
    .from('payouts')
    .select(
      'id, referral_id, affiliate_id, service, amount, paid, paid_at, created_at, affiliates(promo_code, full_name), referrals(lead_name)',
    )
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
  const paidAt = new Date().toISOString();
  if (isTursoConfigured()) {
    await ensureTursoSchema();
    const client = getTursoClient();
    if (!client) return;
    await client.execute({
      sql: 'UPDATE payouts SET paid = 1, paid_at = ? WHERE id = ?',
      args: [paidAt, payoutId],
    });
    return;
  }

  const db = getServiceClient();
  if (!db) return;
  await db.from('payouts').update({ paid: true, paid_at: paidAt }).eq('id', payoutId);
}
