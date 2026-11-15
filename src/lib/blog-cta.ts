export type BlogCtaCluster = 'patent' | 'packaging' | 'naming' | 'brandbook' | 'branding';

export type BlogCtaSecondaryKey =
  | 'ctaSecondaryPatent'
  | 'ctaSecondaryPackaging'
  | 'ctaSecondaryNaming'
  | 'ctaSecondaryBrandbook'
  | 'ctaSecondaryBranding';

export type BlogCtaServiceKey =
  | 'ctaServicePatent'
  | 'ctaServicePackaging'
  | 'ctaServiceNaming'
  | 'ctaServiceBrandbook'
  | 'ctaServiceBranding';

export interface BlogCtaTarget {
  cluster: BlogCtaCluster;
  href: string;
  secondaryKey: BlogCtaSecondaryKey;
  serviceKey: BlogCtaServiceKey;
}

const CLUSTER_CONFIG: Record<BlogCtaCluster, Omit<BlogCtaTarget, 'cluster'>> = {
  patent: {
    href: '/xizmatlar/patent-kalkulyatori',
    secondaryKey: 'ctaSecondaryPatent',
    serviceKey: 'ctaServicePatent',
  },
  packaging: {
    href: '/xizmatlar/qadoq-dizayni',
    secondaryKey: 'ctaSecondaryPackaging',
    serviceKey: 'ctaServicePackaging',
  },
  naming: {
    href: '/xizmatlar/neyming',
    secondaryKey: 'ctaSecondaryNaming',
    serviceKey: 'ctaServiceNaming',
  },
  brandbook: {
    href: '/xizmatlar/brandbook',
    secondaryKey: 'ctaSecondaryBrandbook',
    serviceKey: 'ctaServiceBrandbook',
  },
  branding: {
    href: '/diagnostika',
    secondaryKey: 'ctaSecondaryBranding',
    serviceKey: 'ctaServiceBranding',
  },
};

const CLUSTER_PATTERNS: Array<{ cluster: Exclude<BlogCtaCluster, 'branding'>; pattern: RegExp }> = [
  {
    cluster: 'patent',
    pattern: /patent|trademark|tovar[- ]belgi|tovarnogo[- ]znaka|madrid|ogrilik|krazhi|theft|товарн|патент|商标|专利/i,
  },
  {
    cluster: 'packaging',
    pattern: /packag|qadoq|upakovk|упаковк|包装/i,
  },
  {
    cluster: 'naming',
    pattern: /naming|neyming|brend[- ]nom|нейминг|命名/i,
  },
  {
    cluster: 'brandbook',
    pattern: /brandbook|brendbuk|firma[- ]uslub|firmenniy|aydentik|identifikatsiya|corporate[- ]style|guideline|брендбук|фирменн|品牌手册/i,
  },
];

export function resolveBlogCtaTarget(input: {
  slug?: string;
  title?: string;
  keywords?: string[];
}): BlogCtaTarget {
  const haystack = [input.slug || '', input.title || '', ...(input.keywords ?? [])].join(' ');
  const matched = CLUSTER_PATTERNS.find(({ pattern }) => pattern.test(haystack));
  const cluster: BlogCtaCluster = matched ? matched.cluster : 'branding';

  return {
    cluster,
    ...CLUSTER_CONFIG[cluster],
  };
}
