/**
 * Reels Zavodi umumiy konstantalari (docs/reels-factory/PRD.md).
 * Bog'liqliksiz modul: Sanity Studio schema ham, services/case-reels skriptlari ham import qila oladi.
 * Sanity'dagi yo'l: portfolio.reel.status, portfolio.reel.videos.<lang>, portfolio.reel.publishedAt.
 */
export const REEL_LANGS = ['uz', 'ru', 'en', 'zh'] as const;
export type ReelLang = (typeof REEL_LANGS)[number];

export const REEL_STATUSES = ['none', 'draft', 'approved', 'scheduled', 'published', 'rejected'] as const;
export type ReelStatus = (typeof REEL_STATUSES)[number];

export const REEL_STATUS_TITLES: Record<ReelStatus, string> = {
  none: "Yo'q",
  draft: 'Render qilindi — tasdiq kutilmoqda',
  approved: 'Egasi tasdiqladi',
  scheduled: 'Rejalashtirildi',
  published: 'Chiqarildi',
  rejected: 'Rad etildi',
};
