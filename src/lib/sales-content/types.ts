export type ServiceId =
  | 'naming'
  | 'logo'
  | 'visual-identity'
  | 'brandbook'
  | 'packaging'
  | 'packaging-extra'
  | 'trademark-search'
  | 'trademark-standard'
  | 'trademark-express';

/**
 * Sotuv kontenti tiplari — barcha tillar shu shaklga bo'ysunadi.
 */

export type Service = {
  /** Tildan mustaqil barqaror kalit. Kategoriya va shartlarda shu ishlatiladi. */
  id: ServiceId;
  name: string;
  price: string;
  duration: string;
  lead: string;
  deliverables: string[];
  benefit: string;
  audience: string;
  note?: string;
  addon?: { label: string; price: string };
  proof?: { label: string; items: string[] };
};

export type ServiceGroup = {
  title: string;
  intro: string;
  items: Service[];
};

export type Package = {
  name: string;
  price: string;
  separate: string;
  saving: string;
  audience: string;
  features: string[];
  duration: string;
  featured?: boolean;
  badge?: string;
};

export type Faq = { q: string; a: string };
export type WhyUsItem = { title: string; desc: string };
export type Job = { pain: string; gain: string };
export type ProcessStep = { title: string; desc: string };

/** Ikki qismli sarlavha: birinchi qismi oddiy, ikkinchisi serif bilan ajratiladi. */
export type SplitHeading = { pre: string; hi: string };

/** Sahifa interfeysi matnlari (kontent emas, sarlavha va tugmalar). */
export type SalesUi = {
  currency: string;
  stats: { experience: string; clients: string; projects: string };
  payment: { contract: string; delivery: string };
  notSure: string;
  eyebrows: {
    prices: string;
    task: string;
    services: string;
    process: string;
    factors: string;
    packages: string;
    trust: string;
    difference: string;
    faq: string;
    talk: string;
  };
  hero: SplitHeading & { sub: string };
  jobs: SplitHeading & { sub: string; now: string; withUs: string };
  services: SplitHeading & {
    sub: string;
    note: string;
    showcase: string;
    cases: string;
    price: string;
    duration: string;
    cta: string;
    deliverables: string;
    benefit: string;
  };
  process: SplitHeading & { paymentTitle: string };
  factors: SplitHeading;
  packages: SplitHeading & {
    sub: string;
    separate: { pre: string; mid: string; suf: string };
    cta: string;
    note: string;
  };
  trust: SplitHeading;
  difference: SplitHeading & { guaranteesTitle: string };
  faq: SplitHeading;
  cta: SplitHeading & { sub: string; button: string };
  footnote: string;
  /** Ariza oynasi. Paket variantlari `packages` dan + packageSuffix bilan yasaladi. */
  modal: {
    title: string;
    titleDone: string;
    desc: string;
    descDone: string;
    close: string;
    name: string;
    namePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    service: string;
    submit: string;
    sending: string;
    phoneError: string;
    submitError: string;
    packageSuffix: string;
  };
};

export type SalesContent = {
  serviceGroups: ServiceGroup[];
  packages: Package[];
  faqs: Faq[];
  whyUs: WhyUsItem[];
  guarantees: string[];
  jobs: Job[];
  processSteps: ProcessStep[];
  priceFactors: string[];
  ui: SalesUi;
};
