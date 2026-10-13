/**
 * Xizmat sahifasi shabloni (`/brand-strategy` tuzilishi asosida).
 * Har xizmatning mazmuni `src/lib/service-pages/<xizmat>.ts` da — sahifa
 * faqat shu obyektni chizadi. Narx va tarkib `sales-content` dan olinadi.
 */

export type ServiceDeliverable = {
  title: string;
  subtitle: string;
  details: string[];
  result?: string;
};

export type ServiceQuote = {
  name: string;
  company: string;
  quote: string;
  image?: string;
};

export type ServicePageContent = {
  /** Analytics va CRM manbasi, masalan `naming_page`. */
  source: string;
  /** `submit-form` dagi barqaror xizmat ID'si (`sales-content` dagi `id`). */
  serviceKey: string;
  serviceName: string;
  price: string;
  priceValue: number;
  /** Narx boshlang'ich bo'lsa: "880 000 so‘mdan". */
  priceFrom?: boolean;
  duration?: string;

  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    format: string;
    note?: string;
    primaryCta: string;
  };

  problem: {
    title: string;
    intro: string;
    pains: string[];
    statement: string;
    statementLead: string;
  };

  /** Xizmat nima va nima emas. */
  whatIs: {
    title: string;
    paragraphs: string[];
    isNot: string[];
  };

  deliverables: {
    title: string;
    lead: string;
    items: ServiceDeliverable[];
  };

  proof?: {
    title: string;
    lead: string;
    /** Tasdiqlangan ishlar (masalan biz yaratgan nomlar). */
    chips?: string[];
    quotes?: ServiceQuote[];
  };

  process: {
    title: string;
    steps: { title: string; desc: string; time?: string }[];
  };

  audience: {
    fit: string[];
    notFit: string[];
  };

  guarantees: string[];

  /** Keyingi qadam sifatida taklif qilinadigan xizmatlar. */
  related?: { title: string; desc: string; href: string; price: string }[];

  faqs: { q: string; a: string }[];

  finalCta: {
    title: string;
    lead: string;
  };
};
