// Dictionary type interfaces generated from src/locales/uz.json

export interface HeroDictionary {
  agencyTagline?: string;
  preHeadline?: string;
  title?: string;
  descriptionPlain?: string;
  description?: string;
  headlines?: string[];
  buttonTexts?: string[];
  buttonHint?: string;
  cta?: string;
  ctaSecondary?: string;
  proofItems?: string[];
  auditTitle?: string;
  auditSubtitle?: string;
  auditScore?: string;
  auditScoreLabel?: string;
  auditSignals?: string[];
  showcaseTags?: string[];
}

export interface TrustedByDictionary {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  metrics?: Array<{ value: string; label: string }>;
}

export interface TestimonialsDictionary {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  playVideo?: string;
  playAudio?: string;
  pauseAudio?: string;
  textReviewsTitle?: string;
  textReviewsSubtitle?: string;
}

export interface FaqDictionary {
  title?: string;
  subtitle?: string;
  faqItems?: Array<{ question: string; answer: string }>;
  ctaTitle?: string;
  ctaDesc?: string;
  ctaButton?: string;
}

export interface FounderDictionary {
  title?: string;
  message?: string;
  points?: Array<{ icon: string; text: string }>;
  phoneButton?: string;
  telegramButton?: string;
  videoButton?: string;
  videoAlt?: string;
  principles?: string[];
}

export interface ProcessDictionary {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  phases?: Array<{ phase: string; title: string; description: string; tasks: string[] }>;
  ctaTitle?: string;
  ctaDesc?: string;
  ctaButton?: string;
  proofItems?: string[];
}

export interface AuditOfferDictionary {
  eyebrow?: string;
  title?: string;
  description?: string;
  cta?: string;
  promise?: string;
  outcomes?: Array<{ value: string; label: string }>;
  items?: Array<{ title: string; desc: string }>;
  proof?: string[];
}

export interface BeforeAfterDictionary {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaTitle?: string;
  ctaDesc?: string;
  ctaButton?: string;
  cta?: string;
  caseLabel?: string;
  proofCards?: Array<{ value: string; label: string }>;
}

export interface BlogPreviewDictionary {
  title?: string;
  subtitle?: string;
  readMore?: string;
  viewAll?: string;
}

export interface StatsDictionary {
  badge?: string;
  projects?: string;
  projects_val?: string;
  experience?: string;
  experience_val?: string;
  clients?: string;
  clients_val?: string;
  recommend?: string;
  recommend_val?: string;
  detail?: string;
}

export interface LeadMagnetDictionary {
  title?: string;
  subtitle?: string;
  cta?: string;
  magnets?: Array<{ id: string; icon: string; title: string; desc: string; tag?: string }>;
  checklistContent?: Record<string, unknown>;
}

export interface CtaBlockDictionary {
  title?: string;
  description?: string;
  buttonText?: string;
}

export interface ServiceSectionsDictionary {
  title?: string;
  subtitle?: string;
  services?: Array<{
    id: string;
    title: string;
    description: string;
    features?: string[];
    price?: string;
    href?: string;
  }>;
}

export interface QueueStatusDictionary {
  title?: string;
  subtitle?: string;
  description?: string;
  queueTitle?: string;
  booked?: string;
  available?: string;
  tooltipBooked?: string;
  tooltipAvailable?: string;
  remainingSlots?: string;
  slotsUnit?: string;
  onlineNow?: string;
  peopleUnit?: string;
  nextProjectStart?: string;
  ctaButton?: string;
  ctaSubtitle?: string;
  timeframes?: string[];
}

export interface GalleryDictionary {
  title?: string;
  subtitle?: string;
}

export interface PickTwoSelectorDictionary {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  options?: Array<{ id: string; label: string; icon?: string }>;
  messages?: Record<string, string>;
  tooltip?: string;
}
