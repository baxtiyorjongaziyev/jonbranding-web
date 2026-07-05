export interface ParsedProject {
  title: string;
  client: string;
  category: 'logo-design' | 'naming' | 'brandbook' | 'corporate-style' | 'packaging' | 'brand-strategy';
  description: string;
  tags: string[];
  results: Array<{ metric: string; value: string }>;
  driveFolderUrl: string | null;
  driveFolderId: string | null;
}

export interface AIEnrichedData {
  title: string;
  client: string;
  category: string;
  description: string;
  tags: string[];
  results: Array<{ metric: string; value: string }>;
  body?: Array<{ style: string; children: Array<{ text: string }> }>;
  driveFolderUrl: string | null;
  driveFolderId: string | null;
  detailedDescription?: string;
  targetAudience?: string;
  solution?: string;
  testimonials?: string[];
  coverImageIndex?: number;
  imageOrder?: number[];
  /** SEO — sahifa <title> uchun, taxminan 60 belgigacha */
  metaTitle?: string;
  /** SEO — <meta name="description"> uchun, taxminan 160 belgigacha */
  metaDescription?: string;
  /** SEO — qidiruv kalit so'zlari */
  seoKeywords?: string[];
}

/** Faqat Drive'da qidirish uchun kerakli minimal ma'lumot (tezkor, faqat matn) */
export interface SearchTerms {
  title: string;
  client: string;
}

export interface SanityImageAsset {
  _type: 'reference';
  _ref: string;
}

export interface PortfolioPayload {
  _type: 'portfolio';
  title: string;
  slug: { _type: 'slug'; current: string };
  client: string;
  category: string;
  tags: string[];
  description: string;
  coverImage: { _type: 'image'; asset: SanityImageAsset };
  galleryImages: Array<{ _type: 'image'; asset: SanityImageAsset }>;
  results: Array<{ _key: string; metric: string; value: string }>;
  afterImage?: { _type: 'image'; asset: SanityImageAsset };
  body?: Array<{ style: string; children: Array<{ text: string }> }>;
  featured: boolean;
  publishedAt: string;
  order?: number;
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords?: string[];
}

export interface WorkflowConfig {
  /** Telegram kuzatiladigan kanallar */
  telegramChannels: string[];
  /** Instagram kuzatiladigan akkauntlar */
  instagramAccounts: string[];
  /** Instagram hashtaglar */
  instagramHashtags: string[];
  /** Google Drive asosiy papkasi (agar to'g'ridan-to'g'ri Drive orqali ishlansa) */
  googleDriveParentId?: string;
  /** Har bir manbadan qancha post tekshiriladi */
  postsPerSource: number;
  /** Faqat drive linki bor postlarmi? */
  requireDriveLink: boolean;
  /** Avtomatik yuklash yoki faqat preview */
  autoUpload: boolean;
  /** Soatiga necha marta tekshirish */
  intervalMinutes: number;
}

export interface ProcessedPost {
  source: 'telegram' | 'instagram' | 'drive';
  sourceId: string;
  originalText: string;
  aiData: AIEnrichedData;
  driveFolderId: string | null;
  imageCount: number;
  sanityId?: string;
  status: 'new' | 'downloaded' | 'uploaded' | 'failed';
  error?: string;
  timestamp: string;
}